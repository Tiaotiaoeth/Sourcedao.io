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

    function setDefault(address examAddr, address rewardAddr) external onlyOwner {
        _examination = Examination(examAddr);
        _reward = Reward(rewardAddr);
    }

    function prepare(string memory _examId, uint8 _type, uint8 _level) external {
        // 第一步，生成试卷
        _examination.genExam(_examId, _type, _level);
        // 第二步，预生成SBT
        _reward.prefetchSBTMetaByExam(_examId, _type, _level);
    }

    function submit(string memory _examId, uint8 _score, string memory _picContent) external {
        _reward.postSBTMetaByExam(_examId, _score, _picContent);
    }
}