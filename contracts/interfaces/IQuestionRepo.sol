// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IQuestionRepo {
    event AddQuestion(address indexed author, uint8 qtype, uint8 qlevel, string qhash);

    function addQuestion(address _author, uint8 _type, uint8 _level, string memory _ipfshash, uint8 _standardAnswer) external;
    function randQuestion(uint8 _type, uint8 _level, uint _seed) external view returns (string memory);
    function getStandardAnswer(string memory _qhash) external view returns (uint8);
}