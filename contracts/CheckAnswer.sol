// SPDX-License-Identifier: MIT
// Copyright (c) Sourcedao
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IQuestionRepo.sol";
import "./interfaces/IExamination.sol";

/**
 * 阅卷
 */
contract CheckAnswer is Ownable {
    struct Answers {
        uint8 score;  // 用户得分
        uint8[] userAnswers; // 用户答案
    }
    mapping(uint8 => mapping(uint8 => uint)) private _questionSizeMap; // 保存对应考试类型、难度的考题数量
    mapping(string => Answers) private _idToExamAnswers;            // 试卷上链，用户答案

    IQuestionRepo _questionRepo;
    IExamination _examination;

    event SetQuestionRepo(address repoAddr);
    event SetExamination(address examAddr);

    function setQuestionRepo(address repoAddr) external onlyOwner {
        _questionRepo = IQuestionRepo(repoAddr);

        emit SetQuestionRepo(repoAddr);
    }

    function setExamination(address examAddr) external onlyOwner {
        _examination = IExamination(examAddr);

        emit SetExamination(examAddr);
    }

    function check(
        string memory _examId,
        uint8[] calldata _answers
    ) external {
        require(_idToExamAnswers[_examId].score == 0, "CheckedYet!");

        uint8 score = 0;
        string[] memory questsions = _examination.getExam(_examId);
        require(questsions.length == _answers.length);

        for (uint i = 0; i < _answers.length; i++) {
            string memory qhash = questsions[i];
            uint8 standard = _questionRepo.getStandardAnswer(qhash);
            if (standard == _answers[i]) {
                score += _questionRepo.getScore(qhash);
            }
        }

        Answers storage ans = _idToExamAnswers[_examId];
        ans.score = score;
        ans.userAnswers = _answers;
    }

    function getScore(string memory _examId) external view returns (uint8) {
        return _idToExamAnswers[_examId].score;
    }

    function getAnswers(string memory _examId) external view returns (uint8[] memory) {
        require(_idToExamAnswers[_examId].score > 0, "NotChecked!");

        return _idToExamAnswers[_examId].userAnswers;
    }
}
