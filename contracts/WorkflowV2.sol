// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./Examination.sol";
import "./Reward.sol";

/*
 * 为了减少用户支付gas的次数，临时优化的考试流程，将
 * 阅卷和mint sbt逻辑移至前端执行。注意：这个流程是
 * 不安全的，因为阅卷和mint逻辑没有在链上执行。
 *
 * 相比于V1版本，增加合约安全性
 */
contract WorkflowV2 is Ownable {
    Examination _examination;
    CheckAnswer _checker;
    Reward _reward;

    // 不同类型考试的介绍，英文
    mapping(uint8 => string) private _typeIntroduction;

    /* 用于额外安全验证 */
    // 验证必须是同一个用户参与一次考试
    mapping(string => address) private _examId2User;
    // 每个考试只允许提交一次
    mapping(string => bool) private _examSumbitted;

    event SetExamForWorkflow(address examAddr);
    event SetCheckerForWorkflow(address checkerAddr);
    event SetReward(address rewardAddr);

    function setExamForWorkflow(address examAddr) external onlyOwner {
        _examination = Examination(examAddr);

        emit SetExamForWorkflow(examAddr);
    }

    function setCheckerForWorkflow(address checkerAddr) external onlyOwner {
        _checker = CheckAnswer(checkerAddr);

        emit SetCheckerForWorkflow(checkerAddr);
    }

    function setReward(address rewardAddr) external onlyOwner {
        _reward = Reward(rewardAddr);

        emit SetReward(rewardAddr);
    }

    function setIntroduction(
        uint8 _type, 
        string memory _intro
    ) external onlyOwner {
        _typeIntroduction[_type] = _intro;
    }

    function setDefault(
        address examAddr, 
        address checkerAddr, 
        address rewardAddr
    ) external onlyOwner {
        _examination = Examination(examAddr);
        _checker = CheckAnswer(checkerAddr);
        _reward = Reward(rewardAddr);

        _typeIntroduction[1] = "BGA -Blockchain General Authentication is a basic authentication oriented to the blockchain field, which mainly involves the characteristics, application fields, operation mechanism, distribution, cryptography, smart contract, network, storage and other core contents of the blockchain.It is a comprehensive test and ability certification for users to master blockchain basic knowledge, major digital assets, important blockchain products and services and other knowledge levels.It is mainly for junior users and developers, and can also be used as the entry certificate of blockchain.";
        //unicode"区块链通识认证（BGA-Blockchain General Authentication）是面向区块链领域的基础认证，主要涉及区块链的特性、适用领域、运转机制以及区块链的分布式、密码学、智能合约、网络、存储等核心内容。是对用户掌握区块链基础知识、主要数字资产、重要区块链产品与服务等知识水平的全面检验和能力认证，主要面向初级用户以及初级开发者，也可以作为区块链的入门证书。";
    }

    function prepare(
        address _to,
        string memory _examId, 
        uint8 _type, 
        uint8 _level
    ) external {
        require(_to == msg.sender, "PrepareUsrErr.");
        // 第一步，生成试卷
        _examination.delegateGenerateExam(_to, _examId, _type, _level);
        // 第二步，预生成SBT
        _reward.prefetchSBTMetaByExam(_examId, _type, _level);

        _examId2User[_examId] = _to;
    }

    function submit(
        address _to, 
        string memory _examId, 
        uint8 _score, 
        uint8[] calldata _answers,
        string memory _picContent
    ) external {
        require(_to == msg.sender, "SubmitUsrErr.");
        require(_to == _examId2User[_examId], "DiffUsr4SingleExam.");
        require(!_examSumbitted[_examId], "SumbitYet.");

        // 上传试题答案
        _checker.setAnswers(_examId, _answers, _score);
        // 生成SBT
        _reward.postSBTMetaByExam(_to, _examId, _score, _picContent);

        _examSumbitted[_examId] = true;
    }

    function getIntroduction(uint8 _type) external view returns (string memory) {
        return _typeIntroduction[_type];
    }
}
