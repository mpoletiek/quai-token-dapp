// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC20, Ownable {
    
    // Maximum supply cap (0 means no limit)
    uint256 public maxSupply;
    // Mapping to track total minted amount
    uint256 public totalMinted;
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 _maxSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        require(initialSupply <= _maxSupply || _maxSupply == 0, "Initial supply exceeds max supply");
        
        maxSupply = _maxSupply;
        totalMinted = initialSupply;
        
        _mint(msg.sender, initialSupply);
    }
    
    /**
     * @dev Mint tokens to a specific address (owner only)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than zero");
        
        if (maxSupply > 0) {
            require(totalSupply() + amount <= maxSupply, "Minting would exceed max supply");
        }
        
        totalMinted += amount;
        _mint(to, amount);        
        
    }
    
    
    /**
     * @dev Burn tokens from caller's balance
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance to burn");
        
        _burn(msg.sender, amount);
    }
    
    
    /**
     * @dev Update the maximum supply (owner only)
     * @param newMaxSupply New maximum supply (0 means no limit)
     */
    function updateMaxSupply(uint256 newMaxSupply) external onlyOwner {
        require(newMaxSupply == 0 || newMaxSupply >= totalSupply(), "New max supply must be >= current supply");
        
        maxSupply = newMaxSupply;        
    }
    
}
