// Copyright (c) Sourcedao
// SPDX-License-Identifier: MIT

module sourcedao_move::check_answer {
    address owner;     // 保存合约的拥有者

    mapping(uint8 => mapping(uint8 => uint)) private _questionSizeMap; // 保存对应考试类型、难度的考题数量
    mapping(string => mapping(string => bool)) private _idToExamDedup; // 试卷上链，去重
    mapping(string => string[]) private _idToExamQuestions;            // 试卷上链，试题

    IQuestionRepo _questionRepo;
    IExamination _examination;

    event SetQuestionRepo(address repoAddr);
    event SetExamination(address examAddr);

    constructor() {
        owner = msg.sender;
    }

    function setQuestionRepo(address repoAddr) external onlyOwner {
        _questionRepo = IQuestionRepo(repoAddr);

        emit SetQuestionRepo(repoAddr);
    }

    function setExamination(address examAddr) external onlyOwner {
        _examination = IExamination(examAddr);

        emit SetExamination(examAddr);
    }

    function getScore(
        string memory _examId,
        uint8[] calldata _answers
    ) external view returns (uint8) {
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
        return score;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}

}