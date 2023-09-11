import isEqual from 'lodash.isequal'
import {useMemo} from 'react'
import {CommentState, AccountEdit} from '../../types'

// TYPES
type PropertyNameEditsType = {
  [propertyName: string]: PropertyNameEdit
}

interface EditedResult {
  editedComment: CommentState | undefined
  succeededEdits: {}
  pendingEdits: {}
  failedEdits: {}
  state?: PossibleEditState
}

type PossibleEditState = 'succeeded' | 'pending' | 'failed'

type PropertyNameEdit = {
  timestamp: number
  value: string
}

// CONSTANTS
const DEFAULT_EDITED_RESULT = {
  editedComment: undefined,
  succeededEdits: {},
  pendingEdits: {},
  failedEdits: {},
  state: undefined,
}

const EXPIRY_TIME = 1200 // 60 * 20, 20 minutes

// functions
function useEditedResult2(commentEdits: AccountEdit[], comment: CommentState | undefined): EditedResult {
  return useMemo(() => {
    const editedResult: EditedResult = DEFAULT_EDITED_RESULT
    if (!comment) throw Error('no comment to edit')

    // there are no edits
    if (!commentEdits?.length) return editedResult

    // iterate over commentEdits and consolidate them into 1 propertyNameEdits object
    const propertyNameEdits: PropertyNameEditsType = consolidatePropertyNameEdits(commentEdits)
    const now = Math.round(Date.now() / 1000)

    // iterate over propertyNameEdits and find if succeeded, pending or failed
    for (const propertyName in propertyNameEdits) {
      const propertyNameEdit: PropertyNameEdit = propertyNameEdits[propertyName]
      const state: PossibleEditState = evaluateCommentUpdate(comment, propertyNameEdit, now, propertyName)

      // comment update time is sufficiently distanced from propertyNameEdit
      // and comment doesn't have propertyNameEdit, assume failed
      const {value, verifiedState} = verifyEditedResultState(propertyNameEdit, state, editedResult)
      // set propertyNameEdit e.g. editedResult.succeededEdits.removed = true
      editedResult[`${verifiedState}Edits`][propertyName] = value
      editedResult.state = verifiedState
    }

    // define editedComment
    editedResult.editedComment = {...comment}
    // add pending and succeeded props so the editor can see his changes right away
    // don't add failed edits to reflect the current state of the edited comment
    for (const propertyName in editedResult.pendingEdits) {
      editedResult.editedComment[propertyName] = editedResult.pendingEdits[propertyName]
    }
    for (const propertyName in editedResult.succeededEdits) {
      editedResult.editedComment[propertyName] = editedResult.succeededEdits[propertyName]
    }

    return editedResult
  }, [comment, commentEdits])
}

function consolidatePropertyNameEdits(commentEdits: AccountEdit[]): PropertyNameEditsType {
  // don't include these props as they are not edit props, they are publication props
  const nonEditPropertyNames: Set<string> = new Set(['author, signer', 'commentCid', 'subplebbitAddress', 'timestamp'])

  const propertyNameEdits: PropertyNameEditsType = {}
  for (const commentEdit of commentEdits) {
    for (const propertyName in commentEdit) {
      // not valid edited properties
      if (commentEdit[propertyName] === undefined || nonEditPropertyNames.has(propertyName)) {
        continue
      }
      const previousTimestamp = propertyNameEdits[propertyName]?.timestamp || 0
      // only use the latest propertyNameEdit timestamp
      if (commentEdit.timestamp > previousTimestamp) {
        propertyNameEdits[propertyName] = {
          timestamp: commentEdit.timestamp,
          value: commentEdit[propertyName],
          // NOTE: don't use comment edit challengeVerification.challengeSuccess
          // to know if an edit has failed or succeeded, since another mod can also edit
          // if another mod overrides an edit, consider the edit failed
        }
      }
    }
  }
  return propertyNameEdits
}

function verifyEditedResultState(
  propertyNameEdit: PropertyNameEdit,
  state: PossibleEditState,
  editedResult: EditedResult
): {value: string; verifiedState: PossibleEditState} {
  // if any propertyNameEdit failed, consider the commentEdit failed
  if (state === 'failed') {
    return {
      value: propertyNameEdit.value,
      verifiedState: 'failed',
    }
  }
  // if all propertyNameEdit succeeded, consider the commentEdit succeeded
  if (state === 'succeeded' && !editedResult.state) {
    return {
      value: propertyNameEdit.value,
      verifiedState: 'succeeded',
    }
  }
  // if any propertyNameEdit are pending, and none have failed, consider the commentEdit pending
  if (state === 'pending' && editedResult.state !== 'failed') {
    return {
      value: propertyNameEdit.value,
      verifiedState: 'pending',
    }
  }
  // application should stop there as type checks should prevent going here
  throw Error('unknown state')
}

function evaluateCommentUpdate(comment: CommentState, propertyNameEdit: PropertyNameEdit, now: number, propertyName: string): PossibleEditState {
  // comment update hasn't been received, impossible to evaluate the status of a comment edit
  // better to show pending than unedited, otherwise the editor might try to edit again
  if (!comment?.updatedAt) return 'pending'

  // comment.updatedAt is older than propertyNameEdit, propertyNameEdit is pending
  // because we haven't received the update yet and can't evaluate
  if (comment?.updatedAt! < propertyNameEdit.timestamp) return 'pending'

  // comment.updatedAt is newer than propertyNameEdit, a comment update
  // has been received after the edit was published so we can evaluate
  // comment has propertyNameEdit, propertyNameEdit succeeded
  if (isEqual(comment![propertyName], propertyNameEdit.value)) return 'succeeded'

  // comment does not have propertyNameEdit
  // propertyNameEdit is newer than 20min, it is too recent to evaluate
  // so we should assume pending
  if (propertyNameEdit.timestamp > now - EXPIRY_TIME) return 'pending'

  // propertyNameEdit is older than 20min, we can evaluate it
  // comment update was received too shortly after propertyNameEdit was
  // published, assume pending until a more recent comment update is received
  const timeSinceUpdate = comment?.updatedAt! - propertyNameEdit.timestamp
  if (timeSinceUpdate < EXPIRY_TIME) return 'pending'

  return 'failed'
}

export function useEditedResult(commentEdits: AccountEdit[], comment: CommentState | undefined): EditedResult {
  return useMemo(() => {
    if (!comment) throw Error('no comment to edit')
    const editedResult: EditedResult = DEFAULT_EDITED_RESULT

    // there are no edits
    if (!commentEdits?.length) return editedResult

    // iterate over commentEdits and consolidate them into 1 propertyNameEdits object
    const propertyNameEdits: PropertyNameEditsType = consolidatePropertyNameEdits(commentEdits)
    const now = Math.round(Date.now() / 1000)
    // no longer consider an edit pending ater an expiry time of 20 minutes

    // iterate over propertyNameEdits and find if succeeded, pending or failed
    for (const propertyName in propertyNameEdits) {
      const propertyNameEdit = propertyNameEdits[propertyName]

      const setPropertyNameEditState = (state: 'succeeded' | 'pending' | 'failed') => {
        // set propertyNameEdit e.g. editedResult.succeededEdits.removed = true
        editedResult[`${state}Edits`][propertyName] = propertyNameEdit.value

        // if any propertyNameEdit failed, consider the commentEdit failed
        if (state === 'failed') {
          editedResult.state = 'failed'
        }
        // if all propertyNameEdit succeeded, consider the commentEdit succeeded
        if (state === 'succeeded' && !editedResult.state) {
          editedResult.state = 'succeeded'
        }
        // if any propertyNameEdit are pending, and none have failed, consider the commentEdit pending
        if (state === 'pending' && editedResult.state !== 'failed') {
          editedResult.state = 'pending'
        }
        if (!editedResult.state) {
          throw Error(`didn't define editedResult.state`)
        }
      }

      // comment update hasn't been received, impossible to evaluate the status of a comment edit
      // better to show pending than unedited, otherwise the editor might try to edit again
      if (!comment?.updatedAt) {
        setPropertyNameEditState('pending')
        continue
      }

      // comment.updatedAt is older than propertyNameEdit, propertyNameEdit is pending
      // because we haven't received the update yet and can't evaluate
      if (comment.updatedAt < propertyNameEdit.timestamp) {
        setPropertyNameEditState('pending')
        continue
      }

      // comment.updatedAt is newer than propertyNameEdit, a comment update
      // has been received after the edit was published so we can evaluate
      else {
        // comment has propertyNameEdit, propertyNameEdit succeeded
        if (isEqual(comment[propertyName], propertyNameEdit.value)) {
          setPropertyNameEditState('succeeded')
          continue
        }

        // comment does not have propertyNameEdit
        else {
          // propertyNameEdit is newer than 20min, it is too recent to evaluate
          // so we should assume pending
          if (propertyNameEdit.timestamp > now - EXPIRY_TIME) {
            setPropertyNameEditState('pending')
            continue
          }

          // propertyNameEdit is older than 20min, we can evaluate it
          else {
            // comment update was received too shortly after propertyNameEdit was
            // published, assume pending until a more recent comment update is received
            const timeSinceUpdate = comment.updatedAt - propertyNameEdit.timestamp
            if (timeSinceUpdate < EXPIRY_TIME) {
              setPropertyNameEditState('pending')
              continue
            }

            // comment update time is sufficiently distanced from propertyNameEdit
            // and comment doesn't have propertyNameEdit, assume failed
            else {
              setPropertyNameEditState('failed')
              continue
            }
          }
        }
      }
    }

    // define editedComment
    editedResult.editedComment = {...comment}
    // add pending and succeeded props so the editor can see his changes right away
    // don't add failed edits to reflect the current state of the edited comment
    for (const propertyName in editedResult.pendingEdits) {
      editedResult.editedComment[propertyName] = editedResult.pendingEdits[propertyName]
    }
    for (const propertyName in editedResult.succeededEdits) {
      editedResult.editedComment[propertyName] = editedResult.succeededEdits[propertyName]
    }

    return editedResult
  }, [comment, commentEdits])
}
