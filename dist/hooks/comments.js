import { useEffect } from 'react';
import { useAccount } from './accounts';
import validator from '../lib/validator';
import Logger from '@plebbit/plebbit-logger';
const log = Logger('plebbit-react-hooks:hooks:comments');
import useCommentsStore from '../stores/comments';
import shallow from 'zustand/shallow';
/**
 * @param commentCid - The IPFS CID of the comment to get
 * @param acountName - The nickname of the account, e.g. 'Account 1'. If no accountName is provided, use
 * the active account.
 */
export function useComment(commentCid, accountName) {
    const account = useAccount(accountName);
    const comment = useCommentsStore((state) => state.comments[commentCid || '']);
    const addCommentToStore = useCommentsStore((state) => state.addCommentToStore);
    useEffect(() => {
        if (!commentCid || !account) {
            return;
        }
        validator.validateUseCommentArguments(commentCid, account);
        if (!comment) {
            // if comment isn't already in store, add it
            addCommentToStore(commentCid, account).catch((error) => log.error('useComment addCommentToStore error', { commentCid, error }));
        }
    }, [commentCid, account === null || account === void 0 ? void 0 : account.id]);
    if (account && commentCid) {
        log('useComment', { commentCid, comment, commentsStore: useCommentsStore.getState().comments, account });
    }
    return comment;
}
/**
 * @param commentCids - The IPFS CIDs of the comments to get
 * @param acountName - The nickname of the account, e.g. 'Account 1'. If no accountName is provided, use
 * the active account.
 */
export function useComments(commentCids = [], accountName) {
    const account = useAccount(accountName);
    const comments = useCommentsStore((state) => commentCids.map((commentCid) => state.comments[commentCid || '']), shallow);
    const addCommentToStore = useCommentsStore((state) => state.addCommentToStore);
    useEffect(() => {
        if (!commentCids || !account) {
            return;
        }
        validator.validateUseCommentsArguments(commentCids, account);
        const uniqueCommentCids = new Set(commentCids);
        for (const commentCid of uniqueCommentCids) {
            addCommentToStore(commentCid, account).catch((error) => log.error('useComments addCommentToStore error', { commentCid, error }));
        }
    }, [commentCids.toString(), account === null || account === void 0 ? void 0 : account.id]);
    if (account && (commentCids === null || commentCids === void 0 ? void 0 : commentCids.length)) {
        log('useComments', { commentCids, comments, commentsStore: useCommentsStore.getState().comments, account });
    }
    return comments;
}
