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
    // 考试类型，在链上存储使用typeId，以节省存储开销
    struct ExamType {
        uint8 typeId;
        string name;
    }
    
    // 考试级别，在链上存储使用levelId，以节省存储开销
    struct ExamLevel {
        uint8 levelId;
        string name;
    }
    
    ExamType[] private _examTypes;
    ExamLevel[] private _examLevels;
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
}
