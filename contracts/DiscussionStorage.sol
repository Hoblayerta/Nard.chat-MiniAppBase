// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct Comment {
    uint256 id;
    uint256 parentId;
    address author;
    string content;
    uint256 timestamp;
    int256 score; // net votes
    string metadata; // JSON for badges, vote multipliers, etc.
}

struct Post {
    uint256 id;
    address author;
    string title;
    string content;
    uint256 timestamp;
    int256 score;
    bool isArchived;
    string metadata;
}

contract DiscussionStorage {
    Post[] public posts;
    Comment[] public comments;
    
    mapping(uint256 => uint256[]) public postComments; // postId => commentIds
    mapping(uint256 => uint256[]) public commentReplies; // commentId => replyIds
    
    event PostCreated(uint256 indexed postId, address author);
    event CommentCreated(uint256 indexed commentId, uint256 postId, uint256 parentId);
    event ThreadArchived(uint256 indexed postId, address archiver);

    function createPost(
        string calldata title,
        string calldata content,
        string calldata metadata
    ) external returns (uint256) {
        uint256 postId = posts.length;
        posts.push(Post({
            id: postId,
            author: msg.sender,
            title: title,
            content: content,
            timestamp: block.timestamp,
            score: 0,
            isArchived: false,
            metadata: metadata
        }));
        
        emit PostCreated(postId, msg.sender);
        return postId;
    }

    function createComment(
        uint256 postId,
        uint256 parentId,
        string calldata content,
        string calldata metadata
    ) external returns (uint256) {
        require(postId < posts.length, "Invalid post");
        require(parentId == 0 || (parentId - 1) < comments.length, "Invalid parent");
        
        uint256 commentId = comments.length + 1; // 1-based for easier UI
        comments.push(Comment({
            id: commentId,
            parentId: parentId,
            author: msg.sender,
            content: content,
            timestamp: block.timestamp,
            score: 0,
            metadata: metadata
        }));
        
        if (parentId == 0) {
            postComments[postId].push(commentId);
        } else {
            commentReplies[parentId].push(commentId);
        }
        
        emit CommentCreated(commentId, postId, parentId);
        return commentId;
    }

    function archiveThread(uint256 postId) external {
        require(postId < posts.length, "Invalid post");
        require(!posts[postId].isArchived, "Already archived");
        
        posts[postId].isArchived = true;
        emit ThreadArchived(postId, msg.sender);
    }
}