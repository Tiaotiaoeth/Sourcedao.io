// SPDX-License-Identifier: MIT
// Copyright (c) Sourcedao
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IQuestionRepo.sol";

contract QuestionRepo is IQuestionRepo, Ownable {
    struct SourceQuestion {
        uint8 standardAnswer;   // 保存考题的正确答案
        uint8 level;            // 保存考题的难度
        string content;         // 保存考题的IPFS hash
        address author;         // 保存考题的出题人
    }

    mapping(uint8 => mapping(uint8 => string[])) private questions;
    mapping(string => SourceQuestion) private hashToQuestion;
    mapping(uint8 => uint8) private levelToScore;

    // 设置不同难度题目的分值
    function setLevelScore(uint8 _level, uint8 _score) external onlyOwner {
        levelToScore[_level] = _score;

        emit SetLevelScore(_level, _score);
    }

    // 添加试题，目前只能增加，不能修改
    function addQuestion(
        address _author,
        uint8 _type,
        uint8 _level,
        string memory _ipfshash,
        uint8 _standardAnswer
    ) external onlyOwner {
        SourceQuestion storage q = hashToQuestion[_ipfshash];
        q.standardAnswer = _standardAnswer;
        q.level = _level;
        q.content = _ipfshash;
        q.author = _author;

        questions[_type][_level].push(_ipfshash);
        emit AddQuestion(_author, _type, _level, _ipfshash);
    }

    // TODO：边界检查
    function randQuestion(uint8 _type, uint8 _level, uint _seed) external view returns (string memory) {
        uint256 length = questions[_type][_level].length;
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, _seed)));
        uint256 index = random % length;
        string memory qhash = questions[_type][_level][index];

        return qhash;
    }

    function getStandardAnswer(string memory _qhash) external view returns (uint8) {
        return hashToQuestion[_qhash].standardAnswer;
    }

    // 题目的分值
    function getScore(string memory _qhash) external view returns (uint8) {
        return levelToScore[hashToQuestion[_qhash].level];
    }
}
