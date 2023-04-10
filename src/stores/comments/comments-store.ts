import validator from '../../lib/validator'
import localForageLru from '../../lib/localforage-lru'
const commentsDatabase = localForageLru.createInstance({name: 'comments', size: 5000})
import Logger from '@plebbit/plebbit-logger'
const log = Logger('plebbit-react-hooks:comments:stores')
import {Comment, Comments, Account} from '../../types'
import utils from '../../lib/utils'
import createStore from 'zustand'
import accountsStore from '../accounts'

let plebbitGetCommentPending: {[key: string]: boolean} = {}

// reset all event listeners in between tests
export const listeners: any = []

export type CommentsState = {
  comments: Comments
  errors: {[commentCid: string]: Error[]}
  addCommentToStore: Function
}

const commentsStore = createStore<CommentsState>((setState: Function, getState: Function) => ({
  comments: {},
  errors: {},

  async addCommentToStore(commentId: string, account: Account) {
    const {comments} = getState()

    // comment is in store already, do nothing
    let comment: Comment | undefined = comments[commentId]
    if (comment || plebbitGetCommentPending[commentId + account.id]) {
      return
    }
    plebbitGetCommentPending[commentId + account.id] = true

    // try to find comment in database
    comment = await getCommentFromDatabase(commentId, account)

    // comment not in database, fetch from plebbit-js
    try {
      if (!comment) {
        comment = await account.plebbit.createComment({cid: commentId})
        await commentsDatabase.setItem(commentId, utils.clone(comment))
      }
      log('commentsStore.addCommentToStore', {commentId, comment, account})
      setState((state: CommentsState) => ({comments: {...state.comments, [commentId]: utils.clone(comment)}}))
    } catch (e) {
      throw e
    } finally {
      plebbitGetCommentPending[commentId + account.id] = false
    }

    // the comment is still missing up to date mutable data like upvotes, edits, replies, etc
    comment?.on('update', async (updatedComment: Comment) => {
      updatedComment = utils.clone(updatedComment)
      await commentsDatabase.setItem(commentId, updatedComment)
      log('commentsStore comment update', {commentId, updatedComment, account})
      setState((state: CommentsState) => ({comments: {...state.comments, [commentId]: updatedComment}}))
    })

    comment?.on('updatingstatechange', (updatingState: string) => {
      setState((state: CommentsState) => ({
        comments: {
          ...state.comments,
          [commentId]: {...state.comments[commentId], updatingState},
        },
      }))
    })

    comment?.on('error', (error: Error) => {
      setState((state: CommentsState) => {
        let commentErrors = state.errors[commentId] || []
        commentErrors = [...commentErrors, error]
        return {...state, errors: {...state.errors, [commentId]: commentErrors}}
      })
    })

    // when publishing a comment, you don't yet know its CID
    // so when a new comment is fetched, check to see if it's your own
    // comment, and if yes, add the CID to your account comments database
    // if comment.timestamp isn't defined, it means the next update will contain the timestamp and author
    // which is used in addCidToAccountComment
    if (!comment?.timestamp) {
      comment?.once('update', () =>
        accountsStore
          .getState()
          .accountsActionsInternal.addCidToAccountComment(comment)
          .catch((error: any) => log.error('accountsActionsInternal.addCidToAccountComment error', {comment, error}))
      )
    }

    listeners.push(comment)
    comment?.update().catch((error: unknown) => log.trace('comment.update error', {comment, error}))
  },
}))

const getCommentFromDatabase = async (commentId: string, account: Account) => {
  const commentData: any = await commentsDatabase.getItem(commentId)
  if (!commentData) {
    return
  }
  const comment = await account.plebbit.createComment(commentData)
  return comment
}

// reset store in between tests
const originalState = commentsStore.getState()
// async function because some stores have async init
export const resetCommentsStore = async () => {
  plebbitGetCommentPending = {}
  // remove all event listeners
  listeners.forEach((listener: any) => listener.removeAllListeners())
  // destroy all component subscriptions to the store
  commentsStore.destroy()
  // restore original state
  commentsStore.setState(originalState)
}

// reset database and store in between tests
export const resetCommentsDatabaseAndStore = async () => {
  await localForageLru.createInstance({name: 'comments'}).clear()
  await resetCommentsStore()
}

export default commentsStore
