pragma solidity ^0.8.13;

/**
 * 生成一次考试的合约。
 */
contract Examination {
    address public owner;     // 保存合约的拥有者，只有拥有者可以修改questionRepo和questionSizeMap
    address questionRepo;     // 保存ipfs上题目库地址
    mapping(uint8 => mapping(uint8 => uint8)) questionSizeMap; // 保存对应考试类型、难度的考题数量

    event GenerateExamination(address indexed sender, uint8 type, uint8 level);

    constructor() {
        owner = msg.sender;
    }
    
    // 只有合约拥有者可以设置试题库的地址
    function setRepoAddr(address _repoAddr) public {
        require(owner == msg.sender);
        questionRepo = _repoAddr;
    }

    // 只有合约拥有者可以设置每种考试的题目数量，
    // 每种考试由考试类型和难度决定
    function setSizeMap(uint8 _type, uint8 _level, uint8 _size) public {
        require(owner == msg.sender);
        questionSizeMap[_type][_level] = _size;
    }

    // TODO：边界检查
    function getSize(uint8 _type, utin8 _level) pure returns (uint8) {
        return questionSizeMap[_type][_level];
    }


    function rand(uint256 _length) 
        uint256 random = uint256(keccak256(abi.encodePacked(block.difficulty, now)));
        return random%_length;
    }
    // 生成一次测试
    function genExam(uint8 _type, uint8 _level) public view returns (address[]) {
        uint8 size = getSize(_type, _level);
        address[size] questions;
        for (uint i = 0; i < size; i++) {
            // TODO: random question
            question[i] = random question;
        }
        return questions;

        emit GenerateExamination(msg.sender, _type, _level);
    }
}
