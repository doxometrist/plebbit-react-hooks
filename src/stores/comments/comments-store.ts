import validator from '../../lib/validator'
import localForageLru from '../../lib/localforage-lru'
const commentsDatabase = localForageLru.createInstance({
  name: 'comments',
  size: 5000,
})
import Logger from '@plebbit/plebbit-logger'
const log = Logger('plebbit-react-hooks:comments:stores')
import {Account, Comments, CommentState} from '../../types'
import utils from '../../lib/utils'
import createStore from 'zustand'
import accountsStore from '../accounts'
import {CommentType} from '@plebbit/plebbit-js/dist/node/types'
import {Comment} from '@plebbit/plebbit-js/dist/node/comment'

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

  async addCommentToStore(commentCid: string, account: Account) {
    const {comments} = getState()

    // comment is in store already, do nothing
    let comment: CommentState | undefined = comments[commentCid]
    if (comment || plebbitGetCommentPending[commentCid + account.id]) {
      return
    }
    plebbitGetCommentPending[commentCid + account.id] = true

    // try to find comment in database
    comment = await getCommentFromDatabase(commentCid, account)
    // todo local type incompatible with plebbit-js type

    // comment not in database, fetch from plebbit-js
    try {
      if (!comment) {
        // todo fix this
        comment = await account.plebbit.createComment({
          cid: commentCid,
        } as unknown as CommentType)
        await commentsDatabase.setItem(commentCid, utils.clone(comment))
      }
      log('commentsStore.addCommentToStore', {commentCid, comment, account})
      setState((state: CommentsState) => ({
        comments: {...state.comments, [commentCid]: utils.clone(comment)},
      }))
    } catch (e) {
      throw e
    } finally {
      plebbitGetCommentPending[commentCid + account.id] = false
    }

    // the comment is still missing up to date mutable data like upvotes, edits, replies, etc
    // todo so it's also a listener, not just an interface?
    comment?.on('update', async (updatedComment: CommentState) => {
      updatedComment = utils.clone(updatedComment)
      await commentsDatabase.setItem(commentCid, updatedComment)
      log('commentsStore comment update', {
        commentCid,
        updatedComment,
        account,
      })
      setState((state: CommentsState) => ({
        comments: {...state.comments, [commentCid]: updatedComment},
      }))
    })

    comment?.on('updatingstatechange', (updatingState: string) => {
      setState((state: CommentsState) => ({
        comments: {
          ...state.comments,
          [commentCid]: {...state.comments[commentCid], updatingState},
        },
      }))
    })

    comment?.on('error', (error: Error) => {
      setState((state: CommentsState) => {
        let commentErrors = state.errors[commentCid] || []
        commentErrors = [...commentErrors, error]
        return {
          ...state,
          errors: {...state.errors, [commentCid]: commentErrors},
        }
      })
    })

    // set clients on comment so the frontend can display it, dont persist in db because a reload cancels updating
    utils.clientsOnStateChange(comment?.clients, (state: string) => {
      setState((state: CommentsState) => ({
        comments: {
          ...state.comments,
          [commentCid]: {
            ...state.comments[commentCid],
            clients: utils.clone(comment?.clients),
          },
        },
      }))
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
          .catch((error) =>
            log.error('accountsActionsInternal.addCidToAccountComment error', {
              comment,
              error,
            })
          )
      )
    }

    listeners.push(comment)
    comment?.update().catch((error: unknown) => log.trace('comment.update error', {comment, error}))
  },
}))

const getCommentFromDatabase = async (commentCid: string, account: Account): Promise<Comment | undefined> => {
  const commentData: any = await commentsDatabase.getItem(commentCid)
  if (!commentData) return undefined
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
