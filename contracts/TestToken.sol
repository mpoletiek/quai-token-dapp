// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract TestToken is ERC20, ERC20Permit, Ownable {
    
    // Maximum supply cap (0 means no limit)
    uint256 public maxSupply;
    // Mapping to track total minted amount
    uint256 public totalMinted;
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 _maxSupply
    ) ERC20(name, symbol) ERC20Permit(name) Ownable(msg.sender) {
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
    
    // ============ PERMIT ENHANCEMENTS ============
    
    /**
     * @dev Get the current nonce for an address
     * @param owner The address to get the nonce for
     * @return The current nonce
     */
    function getNonce(address owner) external view returns (uint256) {
        return nonces(owner);
    }
    
    /**
     * @dev Get the domain separator for permit signatures
     * @return The domain separator
     */
    function getDomainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }
    
    /**
     * @dev Gasless transfer using permit
     * This function allows a spender to transfer tokens on behalf of the owner
     * using a permit signature, without the owner needing to send a transaction
     * @param from The address to transfer from
     * @param to The address to transfer to
     * @param amount The amount to transfer
     * @param deadline The deadline for the permit
     * @param v The recovery ID of the signature
     * @param r The r component of the signature
     * @param s The s component of the signature
     */
    function permitTransfer(
        address from,
        address to,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        // First, use the permit to set the allowance
        permit(from, msg.sender, amount, deadline, v, r, s);
        
        // Then transfer the tokens
        transferFrom(from, to, amount);
    }
    
    /**
     * @dev Batch permit for multiple approvals
     * Allows setting multiple allowances with a single transaction
     * @param owners Array of owner addresses
     * @param spenders Array of spender addresses
     * @param amounts Array of amounts to approve
     * @param deadlines Array of deadlines for each permit
     * @param v Array of recovery IDs
     * @param r Array of r components
     * @param s Array of s components
     */
    function batchPermit(
        address[] calldata owners,
        address[] calldata spenders,
        uint256[] calldata amounts,
        uint256[] calldata deadlines,
        uint8[] calldata v,
        bytes32[] calldata r,
        bytes32[] calldata s
    ) external {
        require(
            owners.length == spenders.length &&
            spenders.length == amounts.length &&
            amounts.length == deadlines.length &&
            deadlines.length == v.length &&
            v.length == r.length &&
            r.length == s.length,
            "Arrays length mismatch"
        );
        
        for (uint256 i = 0; i < owners.length; i++) {
            permit(owners[i], spenders[i], amounts[i], deadlines[i], v[i], r[i], s[i]);
        }
    }
    
    
}
