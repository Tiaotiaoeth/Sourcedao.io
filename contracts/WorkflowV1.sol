// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./Examination.sol";
import "./Reward.sol";

/*
 * 为了减少用户支付gas的次数，临时优化的考试流程，将
 * 阅卷和mint sbt逻辑移至前端执行。注意：这个流程是
 * 不安全的，因为阅卷和mint逻辑没有在链上执行。
 */
contract WorkflowV1 is Ownable {
    Examination _examination;
    Reward _reward;

    // 不同类型考试的介绍，中文
    mapping(uint8 => string) private _typeIntroduction;

    event SetExamForWorkflow(address examAddr);
    event SetReward(address rewardAddr);

    function setExamForWorkflow(address examAddr) external onlyOwner {
        _examination = Examination(examAddr);

        emit SetExamForWorkflow(examAddr);
    }

    function setReward(address rewardAddr) external onlyOwner {
        _reward = Reward(rewardAddr);

        emit SetReward(rewardAddr);
    }

    function setIntroduction(uint8 _type, string memory _intro) external onlyOwner {
        _typeIntroduction[_type] = _intro;
    }

    function setDefault(address examAddr, address rewardAddr) external onlyOwner {
        _examination = Examination(examAddr);
        _reward = Reward(rewardAddr);

        _typeIntroduction[1] = unicode"区块链通识认证（BGA-Blockchain General Authentication）是面向区块链领域的基础认证，主要涉及区块链的特性、适用领域、运转机制以及区块链的分布式、密码学、智能合约、网络、存储等核心内容。是对用户掌握区块链基础知识、主要数字资产、重要区块链产品与服务等知识水平的全面检验和能力认证，主要面向初级用户以及初级开发者，也可以作为区块链的入门证书。";
        //Introduction: BGA -Blockchain General Authentication is a basic authentication oriented to the blockchain field, which mainly involves the characteristics, application fields, operation mechanism, distribution, cryptography, smart contract, network, storage and other core contents of the blockchain.It is a comprehensive test and ability certification for users to master blockchain basic knowledge, major digital assets, important blockchain products and services and other knowledge levels.It is mainly for junior users and developers, and can also be used as the entry certificate of blockchain.
    }

    function prepare(string memory _examId, uint8 _type, uint8 _level) external {
        // 第一步，生成试卷
        _examination.genExam(_examId, _type, _level);
        // 第二步，预生成SBT
        _reward.prefetchSBTMetaByExam(_examId, _type, _level);
    }

    function submit(address _to, string memory _examId, uint8 _score, string memory _picContent) external {
        _reward.postSBTMetaByExam(_to, _examId, _score, _picContent);
    }

    function getIntroduction(uint8 _type) external view returns (string memory) {
        return _typeIntroduction[_type];
    }
}
