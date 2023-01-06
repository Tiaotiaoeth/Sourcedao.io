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
    struct CheckedExamination {
        string examId;   // 试卷ID
        uint8 score;     // 用户得分
        uint time;       // 交卷时间
        uint8[] userAnswers; // 用户答案
    }
    mapping(uint8 => mapping(uint8 => uint)) private _questionSizeMap; // 保存对应考试类型、难度的考题数量
    mapping(string => CheckedExamination) private _idToExamAnswers;            // 试卷上链，用户答案
    mapping(address => string[]) private _userToExamIds;            // 用户提交的试卷列表

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

    function setDefault(address repoAddr, address examAddr) external onlyOwner {
        _questionRepo = IQuestionRepo(repoAddr);
        _examination = IExamination(examAddr);
    }
    
    // 阅卷打分
    function check(
        string memory _examId,
        uint8[] calldata _answers
    ) external {
        // 检查当前试卷是否已经打过分
        require(_idToExamAnswers[_examId].score == 0, "CheckedYet!");

        uint16 score = 0;        // 用户实际得分
        uint16 totalScore = 0;  // 试卷总分，总分可能不是100分
        // 获取试题ID
        string[] memory questsions = _examination.getExam(_examId);
        require(questsions.length == _answers.length);

        for (uint i = 0; i < _answers.length; i++) {
            string memory qhash = questsions[i];
            // 查询标准答案
            uint8 standard = _questionRepo.getStandardAnswer(qhash);
            // 查询试题分值
            uint8 value = _questionRepo.getScore(qhash);
            if (standard == _answers[i]) {
                score += value;
            }
            totalScore += value;
        }
        // 归一化成100分值
        score = score * 100 / totalScore;

        setAnswers(_examId, _answers, uint8(score));
    }

    function setAnswers(
        string memory _examId, 
        uint8[] calldata _answers,
        uint8 score
    ) public {
        require(_idToExamAnswers[_examId].score == 0, "CheckedYet!");

        CheckedExamination storage ans = _idToExamAnswers[_examId];
        ans.examId = _examId;
        ans.score = score;
        ans.time = block.timestamp;
        ans.userAnswers = _answers;
    }

    function getScore(string memory _examId) external view returns (uint8) {
        return _idToExamAnswers[_examId].score;
    }

    function getAnswers(string memory _examId) external view returns (uint8[] memory) {
        require(_idToExamAnswers[_examId].score > 0, "NotChecked!");

        return _idToExamAnswers[_examId].userAnswers;
    }

    function getCheckedExaminationByUser(address _user) external view returns (string[] memory) {
        return _userToExamIds[_user];
    }

    function getCheckedExamination(string memory _examId) external view returns (CheckedExamination memory) {
        return _idToExamAnswers[_examId];
    }

    function getQuestionSize(uint8 _type, uint8 _level) external view returns (uint) {
        return _examination.getSize(_type, _level);
    }

    function getExamExpire(uint8 _type, uint8 _level) external view returns (uint16) {
        return _examination.getExpire(_type, _level);
    }

    function getExaminationDurationDelegate(uint8 qtype, uint8 qlevel) external view returns (uint16) {
        return _examination.getExaminationDuration(qtype, qlevel);
    }

}
