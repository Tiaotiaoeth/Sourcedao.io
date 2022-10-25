pragma solidity ^0.8.13;
import "./QuestionRepo.sol";

/**
 * 生成一次考试的合约。
 */
contract Examination {
    address public owner;     // 保存合约的拥有者，只有拥有者可以修改questionRepo和questionSizeMap
    mapping(uint8 => mapping(uint8 => uint8)) questionSizeMap; // 保存对应考试类型、难度的考题数量

    event GenerateExamination(address indexed sender, uint8 type, uint8 level);

    constructor() {
        owner = msg.sender;
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

    // 生成一次测试
    function genExam(uint8 _type, uint8 _level) public view returns (string[], uint256[]) {
        uint8 size = getSize(_type, _level);
        address[size] questions;
        uint256[size] indices;
        for (uint i = 0; i < size; i++) {
            (indices[i], question[i]) = randQuestionHash(_type, _level);
        }
        return (questions, indices);

        emit GenerateExamination(msg.sender, _type, _level);
    }
}
