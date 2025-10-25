// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ReceiptRegistry
 * @notice Optional on-chain receipt registry for s402 payments on Sei
 * @dev This contract allows recording of resource purchases for transparency and analytics
 */
contract ReceiptRegistry {
    // Events
    event ResourcePurchased(
        uint256 indexed resourceId,
        address indexed buyer,
        uint256 amountUsd6,
        string reference
    );
    
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    
    event ResourceRegistered(
        uint256 indexed resourceId,
        string resourceUri,
        uint256 priceUsd6
    );
    
    // State variables
    address public owner;
    uint256 public nextResourceId;
    
    // Resource information
    struct Resource {
        string uri;
        uint256 priceUsd6; // Price in USDC (6 decimals)
        bool active;
        uint256 totalPurchases;
        uint256 totalRevenue;
    }
    
    // Purchase receipt
    struct Receipt {
        uint256 resourceId;
        address buyer;
        uint256 amountUsd6;
        uint256 timestamp;
        string reference;
        bytes32 txHash;
    }
    
    // Mappings
    mapping(uint256 => Resource) public resources;
    mapping(uint256 => Receipt) public receipts;
    mapping(address => uint256[]) public userPurchases;
    mapping(bytes32 => bool) public processedTransactions;
    
    uint256 public totalReceipts;
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "ReceiptRegistry: caller is not the owner");
        _;
    }
    
    modifier resourceExists(uint256 resourceId) {
        require(resources[resourceId].active, "ReceiptRegistry: resource does not exist");
        _;
    }
    
    /**
     * @notice Contract constructor
     */
    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }
    
    /**
     * @notice Register a new resource
     * @param resourceUri The URI of the resource
     * @param priceUsd6 The price in USDC with 6 decimals
     * @return resourceId The ID of the registered resource
     */
    function registerResource(
        string calldata resourceUri,
        uint256 priceUsd6
    ) external onlyOwner returns (uint256 resourceId) {
        resourceId = nextResourceId++;
        
        resources[resourceId] = Resource({
            uri: resourceUri,
            priceUsd6: priceUsd6,
            active: true,
            totalPurchases: 0,
            totalRevenue: 0
        });
        
        emit ResourceRegistered(resourceId, resourceUri, priceUsd6);
    }
    
    /**
     * @notice Update resource price
     * @param resourceId The ID of the resource
     * @param newPriceUsd6 The new price in USDC with 6 decimals
     */
    function updateResourcePrice(
        uint256 resourceId,
        uint256 newPriceUsd6
    ) external onlyOwner resourceExists(resourceId) {
        resources[resourceId].priceUsd6 = newPriceUsd6;
    }
    
    /**
     * @notice Deactivate a resource
     * @param resourceId The ID of the resource to deactivate
     */
    function deactivateResource(uint256 resourceId) 
        external 
        onlyOwner 
        resourceExists(resourceId) 
    {
        resources[resourceId].active = false;
    }
    
    /**
     * @notice Record a purchase
     * @param resourceId The ID of the purchased resource
     * @param buyer The address of the buyer
     * @param amountUsd6 The amount paid in USDC (6 decimals)
     * @param reference A unique reference for the purchase
     * @return receiptId The ID of the created receipt
     */
    function recordPurchase(
        uint256 resourceId,
        address buyer,
        uint256 amountUsd6,
        string calldata reference
    ) external onlyOwner resourceExists(resourceId) returns (uint256 receiptId) {
        require(buyer != address(0), "ReceiptRegistry: invalid buyer address");
        require(amountUsd6 > 0, "ReceiptRegistry: amount must be greater than 0");
        
        // Generate transaction hash from parameters
        bytes32 txHash = keccak256(
            abi.encodePacked(resourceId, buyer, amountUsd6, reference, block.timestamp)
        );
        
        // Ensure this transaction hasn't been processed
        require(!processedTransactions[txHash], "ReceiptRegistry: duplicate transaction");
        
        receiptId = totalReceipts++;
        
        receipts[receiptId] = Receipt({
            resourceId: resourceId,
            buyer: buyer,
            amountUsd6: amountUsd6,
            timestamp: block.timestamp,
            reference: reference,
            txHash: txHash
        });
        
        // Update resource statistics
        resources[resourceId].totalPurchases++;
        resources[resourceId].totalRevenue += amountUsd6;
        
        // Track user purchase
        userPurchases[buyer].push(receiptId);
        
        // Mark transaction as processed
        processedTransactions[txHash] = true;
        
        emit ResourcePurchased(resourceId, buyer, amountUsd6, reference);
    }
    
    /**
     * @notice Record a purchase with transaction hash
     * @param resourceId The ID of the purchased resource
     * @param buyer The address of the buyer
     * @param amountUsd6 The amount paid in USDC (6 decimals)
     * @param reference A unique reference for the purchase
     * @param txHash The transaction hash of the payment
     * @return receiptId The ID of the created receipt
     */
    function recordPurchaseWithTxHash(
        uint256 resourceId,
        address buyer,
        uint256 amountUsd6,
        string calldata reference,
        bytes32 txHash
    ) external onlyOwner resourceExists(resourceId) returns (uint256 receiptId) {
        require(buyer != address(0), "ReceiptRegistry: invalid buyer address");
        require(amountUsd6 > 0, "ReceiptRegistry: amount must be greater than 0");
        require(!processedTransactions[txHash], "ReceiptRegistry: duplicate transaction");
        
        receiptId = totalReceipts++;
        
        receipts[receiptId] = Receipt({
            resourceId: resourceId,
            buyer: buyer,
            amountUsd6: amountUsd6,
            timestamp: block.timestamp,
            reference: reference,
            txHash: txHash
        });
        
        // Update resource statistics
        resources[resourceId].totalPurchases++;
        resources[resourceId].totalRevenue += amountUsd6;
        
        // Track user purchase
        userPurchases[buyer].push(receiptId);
        
        // Mark transaction as processed
        processedTransactions[txHash] = true;
        
        emit ResourcePurchased(resourceId, buyer, amountUsd6, reference);
    }
    
    /**
     * @notice Get user's purchase history
     * @param user The address of the user
     * @return receiptIds Array of receipt IDs for the user
     */
    function getUserPurchases(address user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userPurchases[user];
    }
    
    /**
     * @notice Get resource statistics
     * @param resourceId The ID of the resource
     * @return uri The resource URI
     * @return priceUsd6 The current price
     * @return totalPurchases The total number of purchases
     * @return totalRevenue The total revenue generated
     */
    function getResourceStats(uint256 resourceId)
        external
        view
        returns (
            string memory uri,
            uint256 priceUsd6,
            uint256 totalPurchases,
            uint256 totalRevenue
        )
    {
        Resource memory resource = resources[resourceId];
        return (
            resource.uri,
            resource.priceUsd6,
            resource.totalPurchases,
            resource.totalRevenue
        );
    }
    
    /**
     * @notice Transfer ownership of the contract
     * @param newOwner The address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "ReceiptRegistry: new owner is the zero address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
    
    /**
     * @notice Check if a transaction has been processed
     * @param txHash The transaction hash to check
     * @return bool True if the transaction has been processed
     */
    function isTransactionProcessed(bytes32 txHash) external view returns (bool) {
        return processedTransactions[txHash];
    }
}


