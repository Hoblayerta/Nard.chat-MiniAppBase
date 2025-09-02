// Wagmi hooks available if needed
// import { useWriteContract, useReadContract } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

// Discussion Storage Contract ABI
const DISCUSSION_STORAGE_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "StorieId",
        type: "uint256"
      }
    ],
    name: "archiveThread",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "commentId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "StorieId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "parentId",
        type: "uint256"
      }
    ],
    name: "CommentCreated",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "StorieId",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "parentId",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "content",
        type: "string"
      },
      {
        internalType: "string",
        name: "metadata",
        type: "string"
      }
    ],
    name: "createComment",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "title",
        type: "string"
      },
      {
        internalType: "string",
        name: "content",
        type: "string"
      },
      {
        internalType: "string",
        name: "metadata",
        type: "string"
      }
    ],
    name: "createStorie",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "StorieId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "author",
        type: "address"
      }
    ],
    name: "StorieCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "StorieId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "archiver",
        type: "address"
      }
    ],
    name: "ThreadArchived",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "commentReplies",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "comments",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "parentId",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "author",
        type: "address"
      },
      {
        internalType: "string",
        name: "content",
        type: "string"
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      },
      {
        internalType: "int256",
        name: "score",
        type: "int256"
      },
      {
        internalType: "string",
        name: "metadata",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "StorieComments",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "Stories",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "author",
        type: "address"
      },
      {
        internalType: "string",
        name: "title",
        type: "string"
      },
      {
        internalType: "string",
        name: "content",
        type: "string"
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      },
      {
        internalType: "int256",
        name: "score",
        type: "int256"
      },
      {
        internalType: "bool",
        name: "isArchived",
        type: "bool"
      },
      {
        internalType: "string",
        name: "metadata",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;

const CONTRACT_ADDRESS = "0xc613d6564baeac4abf110ecad84ac59016233c6e" as `0x${string}`;

export class DiscussionStorage {
  private address: `0x${string}`;
  private abi: readonly object[];

  constructor() {
    this.address = CONTRACT_ADDRESS;
    this.abi = DISCUSSION_STORAGE_ABI;
  }

  getAddress(): `0x${string}` {
    return this.address;
  }

  getAbi() {
    return this.abi;
  }

  // Note: These methods now return the contract configuration
  // The actual contract calls should be made using wagmi hooks in components
  getCreateStorieConfig(title: string, content: string, metadata: string) {
    return {
      address: this.address,
      abi: this.abi,
      functionName: 'createStorie',
      args: [title, content, metadata],
      chainId: baseSepolia.id,
    };
  }

  getArchiveThreadConfig(StorieId: number) {
    return {
      address: this.address,
      abi: this.abi,
      functionName: 'archiveThread',
      args: [BigInt(StorieId)],
      chainId: baseSepolia.id,
    };
  }

  getCreateCommentConfig(StorieId: number, parentId: number, content: string, metadata: string) {
    return {
      address: this.address,
      abi: this.abi,
      functionName: 'createComment',
      args: [BigInt(StorieId), BigInt(parentId), content, metadata],
      chainId: baseSepolia.id,
    };
  }

  getStorieConfig(StorieId: number) {
    return {
      address: this.address,
      abi: this.abi,
      functionName: 'Stories',
      args: [BigInt(StorieId)],
      chainId: baseSepolia.id,
    };
  }

  getCommentConfig(commentId: number) {
    return {
      address: this.address,
      abi: this.abi,
      functionName: 'comments',
      args: [BigInt(commentId)],
      chainId: baseSepolia.id,
    };
  }
}