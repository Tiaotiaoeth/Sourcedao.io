// SPDX-License-Identifier: MIT
// Copyright (c) Sourcedaopragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SourceContrib is ERC721, Ownable {

    address immutable public signer_;
    // mint完成，每个tokenId对应的钱包地址
    mapping(uint256 => address) public mintedAddress;

    string private baseURI_;
    // 最多1000枚token
    uint256 public constant MAX_SUPPLY = 1000;
    // 每个token价值0.01 ETH
    uint256 public constant PRICE = 0.01 * 10**18; // 0.01 ETH

    constructor(
        string memory _name, 
        string memory _symbol, 
        string memory _baseURI,
        address _signer
    ) ERC721(_name, _symbol) {
        baseURI_ = _baseURI;
        signer_ = _signer;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI_;
    }

    // 利用ECDSA验证签名并mint
    function mint(
        address _to, 
        uint256 _tokenId, 
        bytes memory _signature
    ) external {
        bytes32 _msgHash = getMessageHash(_to, _tokenId);
        bytes32 _ethSignedMessageHash = ECDSA.toEthSignedMessageHash(_msgHash);
        require(verify(_ethSignedMessageHash, _signature), "InvalidSignature");
        require(!mintedAddress[_tokenId], "AlreadyMinted!");
        safeMint(_to, _tokenId);
    }

    function getMessageHash(
        address _account, 
        uint256 _tokenId
    ) public pure returns(bytes32) {
        return keccak256(abi.encodePacked(_account, _tokenId));
    }

    function verify(
        bytes32 _msgHash, 
        bytes memory _signature
    ) public view returns (bool)
    {
        address receivedAddress = ECDSA.recover(_msgHash, _signature);
        return (receivedAddress != address(0) && receivedAddress == signer_);
    }

    function safeMint(address _to, uint256 _tokenId) public {
        require(mintedAddress[_tokenId] == address(0), "AlreadyMinted!");

        mintedAddress[_tokenId] = _to;
        _safeMint(to, tokenId);
    }

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        msg.sender.transfer(balance);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 _interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return _interfaceId == type(IERC5192).interfaceId ||
            super.supportsInterface(_interfaceId);
    }

}