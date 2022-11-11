// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./interfaces/IQuestionRepo.sol";
import "./interfaces/IExamination.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * 生成一次考试的合约。
 */
contract Examination is IExamination {
    address owner;     // 保存合约的拥有者，只有拥有者可以修改questionRepo和questionSizeMap

    mapping(uint8 => mapping(uint8 => uint)) private _questionSizeMap; // 保存对应考试类型、难度的考题数量
    mapping(string => mapping(string => bool)) private _idToExamDedup; // 试卷上链，去重
    mapping(string => string[]) private _idToExamQuestions;            // 试卷上链，试题

    using Counters for Counters.Counter;
    Counters.Counter private _randSeed;
    IQuestionRepo _questionRepo;

    constructor() {
        owner = msg.sender;
    }

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

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}
