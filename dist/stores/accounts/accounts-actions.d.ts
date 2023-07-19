import { Account, PublishCommentOptions, PublishVoteOptions, PublishCommentEditOptions, PublishSubplebbitEditOptions, CreateSubplebbitOptions } from '../../types';
export declare const createAccount: (accountName?: string) => Promise<void>;
export declare const deleteAccount: (accountName?: string) => Promise<void>;
export declare const setActiveAccount: (accountName: string) => Promise<void>;
export declare const setAccount: (account: Account) => Promise<void>;
export declare const setAccountsOrder: (newOrderedAccountNames: string[]) => Promise<void>;
export declare const importAccount: (serializedAccount: string) => Promise<void>;
export declare const exportAccount: (accountName?: string) => Promise<string>;
export declare const subscribe: (subplebbitAddress: string, accountName?: string) => Promise<void>;
export declare const unsubscribe: (subplebbitAddress: string, accountName?: string) => Promise<void>;
export declare const blockAddress: (address: string, accountName?: string) => Promise<void>;
export declare const unblockAddress: (address: string, accountName?: string) => Promise<void>;
export declare const blockCid: (cid: string, accountName?: string) => Promise<void>;
export declare const unblockCid: (cid: string, accountName?: string) => Promise<void>;
export declare const publishComment: (publishCommentOptions: PublishCommentOptions, accountName?: string) => Promise<undefined>;
export declare const deleteComment: (commentCidOrAccountCommentIndex: string | number, accountName?: string) => Promise<never>;
export declare const publishVote: (publishVoteOptions: PublishVoteOptions, accountName?: string) => Promise<void>;
export declare const publishCommentEdit: (publishCommentEditOptions: PublishCommentEditOptions, accountName?: string) => Promise<void>;
export declare const publishSubplebbitEdit: (subplebbitAddress: string, publishSubplebbitEditOptions: PublishSubplebbitEditOptions, accountName?: string) => Promise<void>;
export declare const createSubplebbit: (createSubplebbitOptions: CreateSubplebbitOptions, accountName?: string) => Promise<any>;
export declare const deleteSubplebbit: (subplebbitAddress: string, accountName?: string) => Promise<void>;
