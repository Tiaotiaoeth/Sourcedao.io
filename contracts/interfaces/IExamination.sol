// SPDX-License-Identifier: MIT
// Copyright (c) Sourcedao
pragma solidity ^0.8.17;

interface IExamination {
    // 考试类型，在链上存储使用typeId，以节省存储开销
    struct ExamType {
        uint8 typeId;
        string name;
    }
    
    // 考试级别，在链上存储使用levelId，以节省存储开销
    struct ExamLevel {
        uint8 levelId;
        string name;
    }
        
    struct UserExamination {
        uint _time;         // 试卷生成时间
        uint8 _type;        // 考试类型
        uint8 _level;       // 考试难度
        string _examId;     // 试卷ID
        string[] _questions; // 试题列表
    }
    event SetQuestionRepo(address repoAddr);
    event AddExaminationType(uint8 qtype, string name);
    event AddExaminationLevel(uint8 qlevel, string name);
    event SetExaminationSize(uint8 qtype, uint8 qlevel, uint size);
    event SetExaminationExpire(uint8 qtype, uint8 qlevel, uint16 expire);
    event SetExaminationDuration(uint8 qtype, uint8 qlevel, uint16 qminutes);
    event GenerateExamination(address indexed sender, uint8 qtype, uint8 qlevel, uint size);

    function setQuestionRepo(address repoAddr) external;
    function addExaminationType(uint8 qtype, string memory name) external;
    function addExaminationLevel(uint8 qlevel, string memory name) external;
    function setExaminationDuration(uint8 qtype, uint8 qlevel, uint16 qminutes) external;
    function setSizeMap(uint8 _type, uint8 _level, uint _size) external;
    function setLevelPercent(uint8 _type, uint8 _level, uint8 _hardPct, uint8 _normalPct, uint8 _easyPct) external;
    function setExpire(uint8 _type, uint8 _level, uint16 _expire) external;
    function getSize(uint8 _type, uint8 _level) external view returns (uint);
    function getExpire(uint8 _type, uint8 _level) external view returns (uint16);
    function getExam(string memory _examId) external view returns (string[] memory);
    function genExam(string memory _examId, uint8 _type, uint8 _level) external;
    function listTypes() external view returns (ExamType[] memory);
    function listLevels() external view returns (ExamLevel[] memory);
    function getExaminationDuration(uint8 qtype, uint8 qlevel) external view returns (uint16);
    function getExamsByUser(address _user) external view returns (string[] memory);
    function getExaminationMeta(string memory _examId) external view returns (UserExamination memory);
}
