// SPDX-License-Identifier: MIT
// Copyright (c) Sourcedao
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IERC5192.sol";

contract SBT is ERC721, ERC721Enumerable, Ownable {
    string private baseURI_;

    constructor(string memory _name, string memory _symbol, string memory _pBaseURI) ERC721(_name, _symbol) {
        baseURI_ = _pBaseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI_;
    }

    // 每个SBT的locked状态
    mapping(uint256 => bool) _locked;


    event Locked(uint256 tokenId);
    event Unlocked(uint256 tokenId);

    function locked(uint256 tokenId) external view returns (bool) {
        require(ownerOf(tokenId) != address(0));
        return _locked[tokenId];
    }

    function safeMint(address to, uint256 tokenId) public {
        require(_locked[tokenId] != true, "Locked!");

        _locked[tokenId] = true;
        emit Locked(tokenId);

        _safeMint(to, tokenId);
    }

    modifier IsTransferAllowed(uint256 tokenId) {
        require(!_locked[tokenId]);
        _;
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    )
        public virtual override(IERC721, ERC721) IsTransferAllowed(tokenId) {
        super.safeTransferFrom(
            from,
            to,
            tokenId
        );
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    )
        public virtual override(IERC721, ERC721) IsTransferAllowed(tokenId) {
        super.safeTransferFrom(
            from,
            to,
            tokenId,
            data
        );
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    )
        public virtual override(IERC721, ERC721) IsTransferAllowed(tokenId) {
        super.safeTransferFrom(
            from,
            to,
            tokenId
        );
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
