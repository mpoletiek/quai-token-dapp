// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract TestTokenV2 is Initializable, ERC20Upgradeable, ERC20PermitUpgradeable, ERC20PausableUpgradeable, OwnableUpgradeable {
    
    // Maximum supply cap (0 means no limit)
    uint256 public maxSupply;
    // Mapping to track total minted amount
    uint256 public totalMinted;
    
    // V2 Features: Blacklist and Whitelist functionality
    mapping(address => bool) public blacklisted;
    mapping(address => bool) public whitelisted;
    bool public whitelistEnabled;
    
    // Events for V2 features
    event AddressBlacklisted(address indexed account, bool blacklisted);
    event AddressWhitelisted(address indexed account, bool whitelisted);
    event WhitelistToggled(bool enabled);
    
    function initialize(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 _maxSupply,
        address initialOwner
    ) public initializer {
        require(initialSupply <= _maxSupply || _maxSupply == 0, "Initial supply exceeds max supply");
        require(initialOwner != address(0), "Initial owner cannot be zero address");
        
        __ERC20_init(name, symbol);
        __ERC20Permit_init(name);
        __Ownable_init(initialOwner);
        __Pausable_init();
        
        maxSupply = _maxSupply;
        totalMinted = initialSupply;
        
        // V2 initialization
        whitelistEnabled = false;
        
        _mint(initialOwner, initialSupply);
    }

    // Reinitialize
    function initializeV2(uint256 _newSupply) public reinitializer(2) {  
        maxSupply = _newSupply;
    }
    
    /**
     * @dev Mint tokens to a specific address (owner only)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner whenNotPaused {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than zero");
        require(!blacklisted[to], "Cannot mint to blacklisted address");
        
        if (whitelistEnabled) {
            require(whitelisted[to], "Cannot mint to non-whitelisted address");
        }
        
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
    function burn(uint256 amount) external onlyOwner whenNotPaused {
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
    
    // ============ PAUSABLE FUNCTIONALITY ============
    
    /**
     * @dev Override _update to integrate pausability with permit functionality
     * This function is called by both ERC20Pausable and ERC20Permit
     */
    function _update(address from, address to, uint256 value) internal override(ERC20Upgradeable, ERC20PausableUpgradeable) {
        // V2: Check blacklist before allowing transfers
        require(!blacklisted[from], "Transfer from blacklisted address");
        require(!blacklisted[to], "Transfer to blacklisted address");
        
        // V2: Check whitelist if enabled
        if (whitelistEnabled) {
            require(whitelisted[from], "Transfer from non-whitelisted address");
            require(whitelisted[to], "Transfer to non-whitelisted address");
        }
        
        super._update(from, to, value);
    }
    
    /**
     * @dev Pause the contract (owner only)
     * When paused, transfers, minting, burning, and permit functions are disabled
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract (owner only)
     * Restores normal functionality
     */
    function unpause() external onlyOwner {
        _unpause();
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
    ) external whenNotPaused {
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
    ) external whenNotPaused {
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
    
    // ============ V2 FEATURES: BLACKLIST/WHITELIST ============
    
    /**
     * @dev Add or remove an address from the blacklist (owner only)
     * @param account The address to blacklist/unblacklist
     * @param blacklistStatus True to blacklist, false to remove from blacklist
     */
    function setBlacklisted(address account, bool blacklistStatus) external onlyOwner {
        require(account != address(0), "Cannot blacklist zero address");
        blacklisted[account] = blacklistStatus;
        emit AddressBlacklisted(account, blacklistStatus);
    }
    
    /**
     * @dev Batch blacklist multiple addresses (owner only)
     * @param accounts Array of addresses to blacklist/unblacklist
     * @param blacklistStatus True to blacklist, false to remove from blacklist
     */
    function batchSetBlacklisted(address[] calldata accounts, bool blacklistStatus) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            require(accounts[i] != address(0), "Cannot blacklist zero address");
            blacklisted[accounts[i]] = blacklistStatus;
            emit AddressBlacklisted(accounts[i], blacklistStatus);
        }
    }
    
    /**
     * @dev Add or remove an address from the whitelist (owner only)
     * @param account The address to whitelist/unwhitelist
     * @param whitelistStatus True to whitelist, false to remove from whitelist
     */
    function setWhitelisted(address account, bool whitelistStatus) external onlyOwner {
        require(account != address(0), "Cannot whitelist zero address");
        whitelisted[account] = whitelistStatus;
        emit AddressWhitelisted(account, whitelistStatus);
    }
    
    /**
     * @dev Batch whitelist multiple addresses (owner only)
     * @param accounts Array of addresses to whitelist/unwhitelist
     * @param whitelistStatus True to whitelist, false to remove from whitelist
     */
    function batchSetWhitelisted(address[] calldata accounts, bool whitelistStatus) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            require(accounts[i] != address(0), "Cannot whitelist zero address");
            whitelisted[accounts[i]] = whitelistStatus;
            emit AddressWhitelisted(accounts[i], whitelistStatus);
        }
    }
    
    /**
     * @dev Enable or disable the whitelist feature (owner only)
     * When enabled, only whitelisted addresses can transfer tokens
     * @param enabled True to enable whitelist, false to disable
     */
    function setWhitelistEnabled(bool enabled) external onlyOwner {
        whitelistEnabled = enabled;
        emit WhitelistToggled(enabled);
    }
    
    /**
     * @dev Check if an address is blacklisted
     * @param account The address to check
     * @return True if the address is blacklisted
     */
    function isBlacklisted(address account) external view returns (bool) {
        return blacklisted[account];
    }
    
    /**
     * @dev Check if an address is whitelisted
     * @param account The address to check
     * @return True if the address is whitelisted
     */
    function isWhitelisted(address account) external view returns (bool) {
        return whitelisted[account];
    }
    
    /**
     * @dev Get the current whitelist status
     * @return True if whitelist is enabled
     */
    function isWhitelistEnabled() external view returns (bool) {
        return whitelistEnabled;
    }
    
    /**
     * @dev V2 Version identifier
     * @return The version string
     */
    function version() external pure returns (string memory) {
        return "2.0.0";
    }
    
}
