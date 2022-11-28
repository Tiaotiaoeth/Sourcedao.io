// SPDX-License-Identifier: MIT
// Copyright (c) Sourcedao
pragma solidity ^0.8.17;

interface IExamination {
    event SetQuestionRepo(address repoAddr);
    event SetExaminationSize(uint8 qtype, uint8 qlevel, uint size);
    event GenerateExamination(address indexed sender, uint8 qtype, uint8 qlevel, uint size);

    function setQuestionRepo(address repoAddr) external;
    function setSizeMap(uint8 _type, uint8 _level, uint _size) external;
    function getExam(string memory _examId) external view returns (string[] memory);
    function genExam(string memory _examId, uint8 _type, uint8 _level) external;
}
