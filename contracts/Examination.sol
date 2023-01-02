// SPDX-License-Identifier: MIT
// Copyright (c) Sourcedao
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IQuestionRepo.sol";
import "./interfaces/IExamination.sol";

/**
 * 生成一次考试的合约。
 */
contract Examination is IExamination, Ownable {
    struct UserExamination {
        uint _time;         // 试卷生成时间
        uint8 _type;        // 考试类型
        uint8 _level;       // 考试难度
        string _examId；    // 试卷ID
        string[] _questions; // 试题列表
    }
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
    mapping(uint8 => mapping(uint8 => LevelPercent)) private _levelPercent;     // 不同类型和难度的试卷，各种难度题目的比例

    mapping(uint8 => mapping(uint8 => uint)) private _questionSizeMap; // 保存对应考试类型、难度的考题数量
    mapping(string => mapping(string => bool)) private _idToExamDedup; // 试卷上链，试题去重
    mapping(address => string[]) private _userToExamIds;               // 用户生成的所有试卷ID
    mapping(string => UserExamination) private _idToExamination;       // 试卷上链，包含试题列表

    using Counters for Counters.Counter;
    Counters.Counter private _randSeed;
    IQuestionRepo _questionRepo;

    function setQuestionRepo(address repoAddr) external onlyOwner {
        _questionRepo = IQuestionRepo(repoAddr);

        emit SetQuestionRepo(repoAddr);
    }

    function addExaminationType(uint8 qtype, string memory name) external onlyOwner {
        require(_examTypes[qtype].typeId == 0, "DupType");

        ExamType storage eType = _examTypes[qtype];
        eType.typeId = qtype;
        eType.name = name;
        _examTypeIds.push(qtype);

        emit AddExaminationType(qtype, name);
    }

    function addExaminationLevel(uint8 qlevel, string memory name) external onlyOwner {
        require(_examLevels[qlevel].levelId == 0, "DupLevel");

        ExamLevel storage eLevel = _examLevels[qlevel];
        eLevel.levelId = qlevel;
        eLevel.name = name;
        _examLevelIds.push(qlevel);

        emit AddExaminationLevel(qlevel, name);
    }

    function setExaminationDuration(uint8 qtype, uint8 qlevel, uint16 qminutes) external onlyOwner {
        _examDuration[qtype][qlevel] = qminutes;

        emit SetExaminationDuration(qtype, qlevel, qminutes);
    }

    // 只有合约拥有者可以设置每种考试的题目数量，
    // 每种考试由考试类型和难度决定
    function setSizeMap(uint8 _type, uint8 _level, uint _size) external onlyOwner {
        _questionSizeMap[_type][_level] = _size;

        emit SetExaminationSize(_type, _level, _size);
    }

    function setLevelPercent(uint8 _type, uint8 _level, uint8 _hardPct, uint8 _normalPct, uint8 _easyPct) external onlyOwner {
        LevelPercent storage lp = _levelPercent[_type][_level];
        lp.hardPct = _hardPct;
        lp.normalPct = _normalPct;
        lp.easyPct = _easyPct;
    }

    function getSize(uint8 _type, uint8 _level) private view returns (uint) {
        return _questionSizeMap[_type][_level];
    }

    function getExam(string memory _examId) external view returns (string[] memory) {
        return _idToExamination[_examId]._questions;
    }

    // 生成一次测试
    function genExam(string memory _examId, uint8 _type, uint8 _level) external {
        require(_idToExamination[_examId]._questions.length == 0, "ExamGeneratedYet");
        // 试题数量
        uint size = getSize(_type, _level);
        // 随机挑选试题，去重
        mapping(string => bool) storage dedup = _idToExamDedup[_examId];
        UserExamination storage userExam = _idToExamination[_examId];
        userExam._time = block.timestamp;
        userExam._type = _type;
        userExam._level = _level;
        userExam._examId = _examId;

        LevelPercent storage lp = _levelPercent[_type][_level];
        uint16 totalValue = 0;
        // 先生成简单题目
        uint8 qlevel = 1;
        uint levelSize = size * lp.easyPct / 100;
        for (uint i = 0; i < levelSize;) {
            _randSeed.increment();
            uint256 randInt = _randSeed.current();
            string memory qhash = _questionRepo.randQuestion(_type, qlevel, randInt);
            if (!dedup[qhash]) {
                dedup[qhash] = true;
                userExam._questions.push(qhash);
                i++;
            }
        }
        // 生成普通题目
        qlevel = 2;
        levelSize = size * lp.normalPct / 100;
        for (uint i = 0; i < levelSize;) {
            _randSeed.increment();
            uint256 randInt = _randSeed.current();
            string memory qhash = _questionRepo.randQuestion(_type, qlevel, randInt);
            if (!dedup[qhash]) {
                dedup[qhash] = true;
                userExam._questions.push(qhash);
                i++;
            }
        }
        // 生成难题
        qlevel = 3;
        levelSize = size * lp.hardPct / 100;
        for (uint i = 0; i < levelSize;) {
            _randSeed.increment();
            uint256 randInt = _randSeed.current();
            string memory qhash = _questionRepo.randQuestion(_type, qlevel, randInt);
            if (!dedup[qhash]) {
                dedup[qhash] = true;
                userExam._questions.push(qhash);
                i++;
            }
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

    function getExamsByUser(address _user) external view returns (sring[] memory) {
        return _userToExamIds[_user];
    }

    function getExaminationMeta(string memory _examId) external view returns (UserExamination memory) {
        return _idToExamination[_examId];
    }
}
