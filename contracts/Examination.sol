// SPDX-License-Identifier: MIT
// Copyright (c) Sourcedao
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IQuestionRepo.sol";
import "./interfaces/IExamination.sol";

/**
 * 生成一次考试的合约。
 */
contract Examination is IExamination, Ownable {

    struct LevelPercent {
        uint8 hardPct;
        uint8 normalPct;
        uint8 easyPct;
    }
    uint8[] private _examTypeIds;
    uint8[] private _examLevelIds;
    mapping(uint8 => ExamType) private _examTypes;
    mapping(uint8 => ExamLevel) private _examLevels;
    // 考试时间，由考试类型和考试级别决定
    mapping(uint8 => mapping(uint8 => uint16)) private _examDuration; 
    // 成绩有效期，单位月份，由考试类型和考试级别决定
    mapping(uint8 => mapping(uint8 => uint16)) private _examExpire; 
    mapping(uint8 => mapping(uint8 => LevelPercent)) private _levelPercent;     // 不同类型和难度的试卷，各种难度题目的比例

    mapping(uint8 => mapping(uint8 => uint)) private _questionSizeMap; // 保存对应考试类型、难度的考题数量
    mapping(address => string[]) private _userToExamIds;               // 用户生成的所有试卷ID
    mapping(string => UserExamination) private _idToExamination;       // 试卷上链，包含试题列表

    IQuestionRepo _questionRepo;

    function setQuestionRepo(address repoAddr) external onlyOwner {
        _questionRepo = IQuestionRepo(repoAddr);

        emit SetQuestionRepo(repoAddr);
    }

    // 合约初始化
    function setDefault(address repoAddr) external onlyOwner {
        _questionRepo = IQuestionRepo(repoAddr);
        
        //addExaminationType(1, unicode"区块链通识");
        ExamType storage eType = _examTypes[1];
        eType.typeId = 1;
        eType.name = unicode"区块链通识";
        _examTypeIds.push(1);

        // 添加考试难度
        //addExaminationLevel(1, unicode"初级");
        ExamLevel storage eLevel1 = _examLevels[1];
        eLevel1.levelId = 1;
        eLevel1.name = unicode"初级";
        _examLevelIds.push(1);

        //addExaminationLevel(2, unicode"中级");
        ExamLevel storage eLevel2 = _examLevels[2];
        eLevel2.levelId = 2;
        eLevel2.name = unicode"中级";
        _examLevelIds.push(2);

        //addExaminationLevel(3, unicode"高级");
        ExamLevel storage eLevel3 = _examLevels[3];
        eLevel3.levelId = 3;
        eLevel3.name = unicode"高级";
        _examLevelIds.push(3);

        // 设置不同难度试卷的题目数量
        //setSizeMap(1, 1, 20);    // 测试时用20题，正式上线改为100题
        _questionSizeMap[1][1] = 20;

        // 设置试卷中不同难度题目的比例
        // setLevelPercent(type, level, hardPct, normalPct, easyPct)
        //setLevelPercent(1, 1, 20, 30, 50);
        LevelPercent storage lp = _levelPercent[1][1];
        lp.hardPct = 20;
        lp.normalPct = 30;
        lp.easyPct = 50;
        // 设置考试时长(minutes)
        //setExaminationDuration(1, 2, examMinutes);
        _examDuration[1][1] = 20;
        // 设置有效期（month）
        _examExpire[1][1] = 3;
    }

    function addExaminationType(
        uint8 qtype, 
        string memory name
    ) external onlyOwner {
        require(_examTypes[qtype].typeId == 0, "DupType");

        ExamType storage eType = _examTypes[qtype];
        eType.typeId = qtype;
        eType.name = name;
        _examTypeIds.push(qtype);

        emit AddExaminationType(qtype, name);
    }

    function addExaminationLevel(
        uint8 qlevel, 
        string memory name
    ) external onlyOwner {
        require(_examLevels[qlevel].levelId == 0, "DupLevel");

        ExamLevel storage eLevel = _examLevels[qlevel];
        eLevel.levelId = qlevel;
        eLevel.name = name;
        _examLevelIds.push(qlevel);

        emit AddExaminationLevel(qlevel, name);
    }

    function setExaminationDuration(
        uint8 qtype, 
        uint8 qlevel, 
        uint16 qminutes
    ) external onlyOwner {
        _examDuration[qtype][qlevel] = qminutes;

        emit SetExaminationDuration(qtype, qlevel, qminutes);
    }

    // 只有合约拥有者可以设置每种考试的题目数量，
    // 每种考试由考试类型和难度决定
    function setSizeMap(
        uint8 _type, 
        uint8 _level, 
        uint _size
    ) external onlyOwner {
        _questionSizeMap[_type][_level] = _size;

        emit SetExaminationSize(_type, _level, _size);
    }

    function setLevelPercent(
        uint8 _type, 
        uint8 _level, 
        uint8 _hardPct, 
        uint8 _normalPct, 
        uint8 _easyPct
    ) external onlyOwner {
        LevelPercent storage lp = _levelPercent[_type][_level];
        lp.hardPct = _hardPct;
        lp.normalPct = _normalPct;
        lp.easyPct = _easyPct;
    }

    function setExpire(
        uint8 _type, 
        uint8 _level, 
        uint16 _expire
    ) external onlyOwner {
        _examExpire[_type][_level] = _expire;

        emit SetExaminationExpire(_type, _level, _expire);
    }

    function getSize(uint8 _type, uint8 _level) external view returns (uint) {
        return _questionSizeMap[_type][_level];
    }

    function getExpire(uint8 _type, uint8 _level) external view returns (uint16) {
        return _examExpire[_type][_level];
    }

    function getExam(string memory _examId) external view returns (string[] memory) {
        return _idToExamination[_examId]._questions;
    }

    // 生成一次测试
    function genExam(
        string memory _examId, 
        uint8 _type, 
        uint8 _level
    ) external {
        require(_idToExamination[_examId]._questions.length == 0, "ExamGeneratedYet");
        // 试题数量
        uint size = _questionSizeMap[_type][_level];
        UserExamination storage userExam = _idToExamination[_examId];
        userExam._time = block.timestamp;
        userExam._type = _type;
        userExam._level = _level;
        userExam._examId = _examId;

        LevelPercent storage lp = _levelPercent[_type][_level];
        // 先生成简单题目
        uint levelSize = size * lp.easyPct / 100;
        string[] memory qhashs1 = _questionRepo.randQuestion(_type, 1, levelSize);
        for (uint i = 0; i < levelSize;i++) {
            userExam._questions.push(qhashs1[i]);
        }
        // 生成普通题目
        levelSize = size * lp.normalPct / 100;
        string[] memory qhashs2 = _questionRepo.randQuestion(_type, 2, levelSize);
        for (uint i = 0; i < levelSize; i++) {
            userExam._questions.push(qhashs2[i]);
        }
        // 生成难题
        levelSize = size * lp.hardPct / 100;
        string[] memory qhashs3 = _questionRepo.randQuestion(_type, 3, levelSize);
        for (uint i = 0; i < levelSize; i++) {
            userExam._questions.push(qhashs3[i]);
        }

        emit GenerateExamination(msg.sender, _type, _level, size);
        // 试卷上链
        string[] storage examIds = _userToExamIds[msg.sender];
        examIds.push(_examId);
    }

    function listTypes() external view returns (ExamType[] memory) {
        uint len = _examTypeIds.length;
        ExamType[] memory types = new ExamType[](len);
        for (uint i=0; i < len; i++) {
            types[i] = _examTypes[_examTypeIds[i]];
        }
        return types;
    }

    function listLevels() external view returns (ExamLevel[] memory) {
        uint len = _examLevelIds.length;
        ExamLevel[] memory levels = new ExamLevel[](len);
        for (uint i=0; i < len; i++) {
            levels[i] = _examLevels[_examLevelIds[i]];
        }
        return levels;
    }
    
    function getExaminationDuration(uint8 qtype, uint8 qlevel) external view returns (uint16) {
        return _examDuration[qtype][qlevel];
    }

    function getExamsByUser(address _user) external view returns (string[] memory) {
        return _userToExamIds[_user];
    }

    function getExaminationMeta(string memory _examId) external view returns (UserExamination memory) {
        return _idToExamination[_examId];
    }
}
