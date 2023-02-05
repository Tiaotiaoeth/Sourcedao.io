// SPDX-License-Identifier: MIT
// Copyright (c) Sourcedao
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IQuestionRepo.sol";

/**
 * 题库合约
 * 
 * 主要用于存储试题。
 */
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

    // 合约初始化
    function setDefault() external onlyOwner {
        // 不同难度试题的得分
        levelToScore[1] = 2;
        levelToScore[2] = 3;
        levelToScore[3] = 5;
    }
    
    // 设置不同难度题目的分值
    function setLevelScore(
        uint8 _level, 
        uint8 _score
    ) external onlyOwner {
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

    // 批量添加试题
    function batchAddQuestions(
        address _author,
        uint8 _type,
        uint8 _level,
        string[] memory _ipfshash,
        uint8[] memory _standardAnswer
    ) external onlyOwner {
        uint len = _ipfshash.length;
        require(len == _standardAnswer.length, "InvalidParam");

        for (uint i=0; i < len; i++) {
            SourceQuestion storage q = hashToQuestion[_ipfshash[i]];
            q.standardAnswer = _standardAnswer[i];
            q.level = _level;
            q.content = _ipfshash[i];
            q.author = _author;

            questions[_type][_level].push(_ipfshash[i]);
        }
    }

    // 随机选出_size道题目
    function randQuestion(
        uint8 _type, 
        uint8 _level, 
        uint _size
    ) external view returns (string[] memory) {
        uint256 length = questions[_type][_level].length;
        require(length >= _size, "NotEnoughQuestion.");
        
        string[] memory qhashs = new string[](_size);
        uint[] memory indices = new uint[](length);
        address addr =  msg.sender;
        uint df = block.difficulty;
        uint ts = block.timestamp;
        for (uint nonce=0; nonce < _size; nonce++) {
            uint totalSize = length - nonce;
            uint randnum = uint(keccak256(abi.encodePacked(nonce, addr, df, ts))) % totalSize;
            uint index = 0;
            if (indices[randnum] != 0) {
                index = indices[randnum];
            } else {
                index = randnum;
            }

            if (indices[totalSize - 1] == 0) {
                indices[randnum] = totalSize - 1; 
            } else { 
                indices[randnum] = indices[totalSize - 1];
            }
            qhashs[nonce] = questions[_type][_level][index];
        }

        return qhashs;
    }

    function getStandardAnswer(string memory _qhash) external view returns (uint8) {
        return hashToQuestion[_qhash].standardAnswer;
    }

    // 题目的分值
    function getScore(string memory _qhash) external view returns (uint8) {
        return levelToScore[hashToQuestion[_qhash].level];
    }
}
