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
    uint8[] private _examTypeIds;
    uint8[] private _examLevelIds;
    mapping(uint8 => ExamType) private _examTypes;
    mapping(uint8 => ExamLevel) private _examLevels;
    // 考试时间，由考试类型和考试级别决定
    mapping(uint8 => mapping(uint8 => uint16)) private _examDuration; 

    mapping(uint8 => mapping(uint8 => uint)) private _questionSizeMap; // 保存对应考试类型、难度的考题数量
    mapping(string => mapping(string => bool)) private _idToExamDedup; // 试卷上链，去重
    mapping(string => string[]) private _idToExamQuestions;            // 试卷上链，试题

    using Counters for Counters.Counter;
    Counters.Counter private _randSeed;
    IQuestionRepo _questionRepo;

    function setQuestionRepo(address repoAddr) external onlyOwner {
        _questionRepo = IQuestionRepo(repoAddr);

        emit SetQuestionRepo(repoAddr);
    }

    function addExaminationType(uint8 qtype, string memory name) external onlyOwner {
        require(_examTypes[qtype] == 0, "DupType");

        ExamType storage eType = _examTypes[qtype];
        eType.typeId = qtype;
        eType.name = name;
        _examTypeIds.push(qtype);

        emit AddExaminationType(qtype, name);
    }

    function addExaminationLevel(uint8 qlevel, string memory name) external onlyOwner {
        require(_examLevels[qlevel] == 0, "DupLevel");

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

    function getSize(uint8 _type, uint8 _level) private view returns (uint) {
        return _questionSizeMap[_type][_level];
    }

    function getExam(string memory _examId) external view returns (string[] memory) {
        string[] memory questions = _idToExamQuestions[_examId];
        return questions;
    }

    // 生成一次测试
    function genExam(string memory _examId, uint8 _type, uint8 _level) external {
        require(_idToExamQuestions[_examId] == 0, "ExamGeneratedYet");

        uint size = getSize(_type, _level);

        mapping(string => bool) storage dedup = _idToExamDedup[_examId];
        string[] storage questions = _idToExamQuestions[_examId];
        for (uint i = 0; i < size;) {
            _randSeed.increment();
            uint256 randInt = _randSeed.current();
            string memory qhash = _questionRepo.randQuestion(_type, _level, randInt);
            if (!dedup[qhash]) {
                dedup[qhash] = true;
                questions.push(qhash);
                i++;
            }
        }

        emit GenerateExamination(msg.sender, _type, _level, size);
    }

    function listTypes() external view returns (ExamType[] memory) {
        uint len = _examTypeIds.length;
        ExamType[] types = new ExamType[](len);
        for (uint i=0; i < len; i++) {
            types[i] = _examTypes[_examTypeIds[i]];
        }
        return types;
    }

    function listLevels() external view returns (ExamLevel[] memory) {
        uint len = _examLevelIds.length;
        ExamLevel[] levels = new ExamLevel[](len);
        for (uint i=0; i < len; i++) {
            levels[i] = _examTypes[_examLevelIds[i]];
        }
        return levels;
    }
    
    function getExaminationDuration(uint8 qtype, uint8 qlevel) external view returns (uint16) {
        return _examDuration[qtype][qlevel];
    }
}
