// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CheckAnswer.sol";
import "./SBT.sol";

contract Reward is Ownable {
    struct SourceDaoReward {
        uint256 id;         // SBT id
        uint8 qlevel;       // 考试的难度
        uint8 qtype;        // 考试的类型
        uint16 score;       // 考试分数
        uint time;          // 考试时间，使用区块时间
        address owner;      // 考试人
        string examId;      // 试卷ID
    }

    mapping(uint8 => mapping(uint8 => uint8)) passLines;
    // 每个SBT的元信息
    mapping(uint256 => SourceDaoReward) tokenIdToRewardMeta;
    // 每次考试最多获得一枚SBT
    mapping(string => uint256) examIdToTokenId;
    // 每个用户钱包地址获得的SBT列表
    mapping(address => uint256[]) balanceList;

    using Counters for Counters.Counter;
    Counters.Counter private idCounter;

    CheckAnswer checker;
    SBT sbt;

    event SetCheckAnswer(address checkerAddr);
    event SetSBTContract(address sbtAddr);
    event RewardEvent(address indexed sender, uint8 qtype, uint8 qlevel, uint8 score, bool pass);


    function setSBTContract(address sbtAddr) external onlyOwner {
        sbt = SBT(sbtAddr);

        emit SetSBTContract(sbtAddr);
    }

    function setCheckAnswer(address checkerAddr) external onlyOwner {
        checker = CheckAnswer(checkerAddr);

        emit SetCheckAnswer(checkerAddr);
    }

    function setPassLine(uint8 _type, uint8 _level, uint8 _score) external onlyOwner {
        passLines[_type][_level] = _score;
    }

    function checkAndTryReward(
        string memory _examId, 
        uint8[] calldata _answers,
        uint8 _type, 
        uint8 _level
    ) external {
        require(examIdToTokenId[_examId] == 0, "ExamMintYet");
        uint8 score = checker.getScore(_examId, _answers);
        uint8 passLine = passLines[_type][_level];
        require(passLine > 0, "passline");
        if (score >= passLine) {
            idCounter.increment();
            uint256 tokenId = idCounter.current();

            examIdToTokenId[_examId] = tokenId;
            SourceDaoReward storage r = tokenIdToRewardMeta[tokenId];
            r.id = tokenId;
            r.qlevel = _level;
            r.qtype = _type;
            r.score = score;
            r.time = block.timestamp;
            r.owner = msg.sender;
            r.examId = _examId;

            sbt.safeMint(msg.sender, tokenId);
            balanceList[msg.sender].push(tokenId);
        }
        
        emit RewardEvent(msg.sender, _type, _level, score, score >= passLine);
    }

    // 查询SBT的元信息
    function getSBTMeta(uint256 _tokenId) external view returns (SourceDaoReward memory) {
        return tokenIdToRewardMeta[_tokenId];
    }

    // 查询考试的SBT id
    function getTokenId(string memory _examId) external view returns (uint256) {
        return examIdToTokenId[_examId];
    }

    // 查询一个用户获得的所有SBT id列表
    function getTokensByUser(address user) external view returns (uint256[] memory) {
        return balanceList[user];
    }
}
