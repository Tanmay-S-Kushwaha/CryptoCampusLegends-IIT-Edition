// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";



contract TVCharactersNFT is ERC721URIStorage{
    uint256 private _tokenId;
    uint256 public constant MAX_NFTS = 3000;
    uint256 public nftCount;
    mapping (uint256 => string) private _tokenURIs;

    constructor() ERC721("PokemonNFT", "BALL") {}

    function mintNFT( string memory tokenURI) public returns (uint256) {
        require(nftCount < MAX_NFTS, "Maximum number of NFTs reached");

        uint256 newItemId = _tokenId + 1;
        _tokenId = newItemId;

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        nftCount++;

        return newItemId;
    }



   
}
