// Note: the commented out types are TODO functionalities to implement

import {Plebbit} from '@plebbit/plebbit-js/dist/node/plebbit'
import {PlebbitOptions} from '@plebbit/plebbit-js/dist/node/types'
import {Signer} from 'ethers'

/**
 * Public interface
 */

export interface Options {
  accountName?: string
  onError?(error: Error): void
}

export interface Result {
  state: string
  error: Error | undefined
  errors: Error[]
}

// useAccount(options): result
export interface UseAccountOptions extends Options {}
export interface UseAccountResult extends Result, Account {}

// useAccounts(options): result
export interface UseAccountsOptions extends Options {}
export interface UseAccountsResult extends Result {
  accounts: Account[]
}

// useAccountComments(options): result
export interface UseAccountCommentsOptions extends Options {
  filter?: AccountPublicationsFilter
}
export interface UseAccountCommentsResult extends Result {
  accountComments: AccountComment[]
}

// useAccountComment(options): result
export interface UseAccountCommentOptions extends Options {
  commentIndex?: number
}
export interface UseAccountCommentResult extends Result, AccountComment {}

// useAccountVotes(options): result
export interface UseAccountVotesOptions extends Options {
  filter?: AccountPublicationsFilter
}
export interface UseAccountVotesResult extends Result {
  accountVotes: AccountVote[]
}

// useAccountVote(options): result
export interface UseAccountVoteOptions extends Options {
  commentCid?: string
}
export interface UseAccountVoteResult extends Result, AccountVote {
  commentCid: string | undefined
  vote: number | undefined
}

// useAccountEdits(options): result
export interface UseAccountEditsOptions extends Options {
  filter?: AccountPublicationsFilter
}
export interface UseAccountEditsResult extends Result {
  accountEdits: AccountEdit[]
}

// useNotifications(options): result
export interface UseNotificationsOptions extends Options {}
export interface UseNotificationsResult extends Result {
  notifications: Notification[]
  markAsRead(): Promise<void>
}

// useAccountSubplebbits(options): result
export interface UseAccountSubplebbitsOptions extends Options {}
export interface UseAccountSubplebbitsResult extends Result {
  accountSubplebbits: AccountSubplebbit[]
}

// usePubsubSubscribe(options): result
export interface UsePubsubSubscribeOptions extends Options {
  subplebbitAddress?: string
}
export interface UsePubsubSubscribeResult extends Result {}

// useComment(options): result
export interface UseCommentOptions extends Options {
  commentCid?: string
}
export interface UseCommentResult extends Result, Comment {}

// useComments(options): result
export interface UseCommentsOptions extends Options {
  commentCids?: string[]
}
export interface UseCommentsResult extends Result {
  // TODO: remove | undefined, that shouldn't happen when comments have comment.state
  comments: (Comment | undefined)[]
}

// useCommentThumbnailUrl(options): result
// export interface UseCommentThumbnailUrlOptions extends Options {
//   comment?: Comment
// }
// export interface UseCommentThumbnailUrlResult extends Result {
//   thumnbailUrl: string | undefined
// }

// useReplies(options): result
// export interface UseRepliesOptions extends Options {
//   commentCid?: string
//   nested?: boolean
// }
// export interface UseRepliesResult extends Result {
//   replies: Comment[]
//   hasMore: boolean
//   loadMore(): Promise<void>
// }

// useEditedComment(options): result
export interface UseEditedCommentOptions extends Options {
  comment?: Comment
}
// todo have a CommentEdit interface?
export interface UseEditedCommentResult extends Result {
  // editedComment only contains the succeeded and pending props, failed props aren't added
  editedComment: Comment | undefined
  succeededEdits: {[succeededEditPropertyName: string]: any}
  pendingEdits: {[pendingEditPropertyName: string]: any}
  failedEdits: {[failedEditPropertyName: string]: any}
  // state: 'initializing' | 'unedited' | 'succeeded' | 'pending' | 'failed'
}

// useSubplebbit(options): result
export interface UseSubplebbitOptions extends Options {
  subplebbitAddress?: string
}
export interface UseSubplebbitResult extends Result, Subplebbit {}

// useSubplebbits(options): result
export interface UseSubplebbitsOptions extends Options {
  subplebbitAddresses?: string[]
}
export interface UseSubplebbitsResult extends Result {
  subplebbits: (Subplebbit | undefined)[]
}

// useSubplebbitStats(options): result
export interface UseSubplebbitStatsOptions extends Options {
  subplebbitAddress?: string
}
export interface UseSubplebbitStatsResult extends Result, SubplebbitStats {}

// useResolvedSubplebbitAddress(options): result
export interface UseResolvedSubplebbitAddressOptions extends Options {
  subplebbitAddress: string | undefined
  cache?: boolean
}
export interface UseResolvedSubplebbitAddressResult extends Result {
  resolvedAddress: string | undefined
  chainProvider: ChainProvider | undefined
}

// useFeed(options): result
export interface UseFeedOptions extends Options {
  subplebbitAddresses: string[]
  sortType?: string
  postsPerPage?: number
}
export interface UseFeedResult extends Result {
  feed: Comment[]
  hasMore: boolean
  loadMore(): Promise<void>
}

// useBufferedFeeds(options): result
export interface UseBufferedFeedsOptions extends Options {
  feedsOptions?: UseFeedOptions[]
}
export interface UseBufferedFeedsResult extends Result {
  bufferedFeeds: Comment[][]
}

// useAuthor(options): result
export interface UseAuthorOptions extends Options {
  authorAddress?: string
  // the last known comment cid of this author (required, can't fetch author from author address alone)
  commentCid?: string
}
export interface UseAuthorResult extends Result {
  author: Author | undefined
}

// useAuthorComments(options): result
export interface UseAuthorCommentsOptions extends Options {
  authorAddress?: string
  // the last known comment cid of this author (required, can't fetch author comment from author address alone)
  commentCid?: string
  // TODO: add filter
  filter?: AccountPublicationsFilter
}
export interface UseAuthorCommentsResult extends Result {
  // TODO: remove | undefined, that shouldn't happen when comments have comment.state
  authorComments: (Comment | undefined)[]
  lastCommentCid: string | undefined
  hasMore: boolean
  loadMore(): Promise<void>
}

// useResolvedAuthorAddress(options): result
export interface UseResolvedAuthorAddressOptions extends Options {
  author?: Author
  cache?: boolean
}
export interface UseResolvedAuthorAddressResult extends Result {
  resolvedAddress: string | undefined
  chainProvider: ChainProvider | undefined
}

// useAuthorAvatar(options): result
export interface UseAuthorAvatarOptions extends Options {
  author?: Author
}
export interface UseAuthorAvatarResult extends Result {
  imageUrl: string | undefined
  metadataUrl: string | undefined
  chainProvider: ChainProvider | undefined
}

// useAuthorAddress(options): result
export interface UseAuthorAddressOptions extends Options {
  comment?: Comment
}
export interface UseAuthorAddressResult extends Result {
  authorAddress: string | undefined
  shortAuthorAddress: string | undefined
}

// useCreateAccount(options): result
// export interface UseCreateAccountOptions extends Options {}
// export interface UseCreateAccountResult extends Result {
//   createdAccount: Account | undefined
//   createAccount(): Promise<void>
// }

// useDeleteAccount(options): result
// export interface UseDeleteAccountOptions extends Options {}
// export interface UseDeleteAccountResult extends Result {
//   deletedAccount: Account | undefined
//   deleteAccount(): Promise<void>
// }

// useSetAccount(options): result
// export interface UseSetAccountOptions extends Options {
//   account?: Account
// }
// export interface UseSetAccountResult extends Result {
//   account: Account | undefined
//   setAccount(): Promise<void>
// }

// useSetActiveAccount(options): result
// export interface UseSetActiveAccountOptions extends Options {
//   activeAccount?: string
// }
// export interface UseSetActiveAccountResult extends Result {
//   activeAccount: string | undefined
//   setActiveAccount(): Promise<void>
// }

// useSetAccountsOrder(options): result
// export interface UseSetAccountsOrderOptions extends Options {
//   accountsOrder?: string[]
// }
// export interface UseSetAccountsOrderResult extends Result {
//   accountsOrder: string[]
//   setAccountsOrder(): Promise<void>
// }

// useImportAccount(options): result
// export interface UseImportAccountOptions extends Options {
//   account?: string
// }
// export interface UseImportAccountResult extends Result {
//   importedAccount: Account | undefined
//   importAccount(): Promise<void>
// }

// useExportAccount(options): result
// export interface UseExportAccountOptions extends Options {}
// export interface UseExportAccountResult extends Result {
//   exportedAccount: string | undefined
//   exportAccount(): Promise<void>
// }

// usePublishComment(options): result
export interface UsePublishCommentOptions extends Options {
  onChallenge?(challenge: Challenge, comment?: Comment): Promise<void>
  onChallengeVerification?(challengeVerification: ChallengeVerification, comment?: Comment): Promise<void>
  [publishOption: string]: any
}
export interface UsePublishCommentResult extends Result {
  index: number | undefined
  challenge: Challenge | undefined
  challengeVerification: ChallengeVerification | undefined
  publishComment(): Promise<void>
  publishChallengeAnswers(challengeAnswers: string[]): Promise<void>
}

// usePublishVote(options): result
export interface UsePublishVoteOptions extends Options {
  onChallenge?(challenge: Challenge, comment?: Comment): Promise<void>
  onChallengeVerification?(challengeVerification: ChallengeVerification, comment?: Comment): Promise<void>
  [publishOption: string]: any
}
export interface UsePublishVoteResult extends Result {
  challenge: Challenge | undefined
  challengeVerification: ChallengeVerification | undefined
  publishVote(): Promise<void>
  publishChallengeAnswers(challengeAnswers: string[]): Promise<void>
}

// usePublishCommentEdit(options): result
export interface UsePublishCommentEditOptions extends Options {
  onChallenge?(challenge: Challenge, comment?: Comment): Promise<void>
  onChallengeVerification?(challengeVerification: ChallengeVerification, comment?: Comment): Promise<void>
  [publishOption: string]: any
}
export interface UsePublishCommentEditResult extends Result {
  challenge: Challenge | undefined
  challengeVerification: ChallengeVerification | undefined
  publishCommentEdit(): Promise<void>
  publishChallengeAnswers(challengeAnswers: string[]): Promise<void>
}

// usePublishSubplebbitEdit(options): result
export interface UsePublishSubplebbitEditOptions extends Options {
  subplebbitAddress?: string
  onChallenge?(challenge: Challenge, comment?: Comment): Promise<void>
  onChallengeVerification?(challengeVerification: ChallengeVerification, comment?: Comment): Promise<void>
  [publishOption: string]: any
}
export interface UsePublishSubplebbitEditResult extends Result {
  challenge: Challenge | undefined
  challengeVerification: ChallengeVerification | undefined
  publishSubplebbitEdit(): Promise<void>
  publishChallengeAnswers(challengeAnswers: string[]): Promise<void>
}

// useCreateSubplebbit(options): result
export interface UseCreateSubplebbitOptions extends Options {
  [createSubplebbitOption: string]: any
}
export interface UseCreateSubplebbitResult extends Result {
  createdSubplebbit: Subplebbit | undefined
  createSubplebbit(): Promise<void>
}

// useDeleteSubplebbit(options): result
// export interface UseDeleteSubplebbitOptions extends Options {
//   subplebbitAddress?: string
// }
// export interface UseDeleteSubplebbitResult extends Result {
//   deletedSubplebbit: Subplebbit | undefined
//   deleteSubplebbit(): Promise<void>
// }

// useSubscribe(options): result
export interface UseSubscribeOptions extends Options {
  subplebbitAddress?: string
  multisubAddress?: string
  authorAddress?: string
}
export interface UseSubscribeResult extends Result {
  subscribed?: boolean
  subscribe(): Promise<void>
  unsubscribe(): Promise<void>
}

// useBlock(options): result
export interface UseBlockOptions extends Options {
  address?: string
  cid?: string
}
export interface UseBlockResult extends Result {
  blocked: boolean | undefined
  block(): Promise<void>
  unblock(): Promise<void>
}

// useNotify(options): result
// export interface UseNotifyOptions extends Options {
//   subplebbitAddress?: string
//   multisubAddress?: string
//   authorAddress?: string
//   commentCid?: string
// }
// export interface UseNotifySubplebbitResult extends Result {
//   notifying: boolean | undefined
//   notify(): Promise<void>
//   unnotify(): Promise<void>
// }

// useLimit(options): result
// export interface UseLimitOptions extends Options {
//   address?: string
// }
// export interface UseLimitResult extends Result {
//   limited: number | undefined
//   limit(): Promise<void>
//   unlimit(): Promise<void>
// }

// useSave(options): result
// export interface UseSaveOptions extends Options {
//   commentCid?: string
// }
// export interface UseSaveResult extends Result {
//   saved: boolean | undefined
//   save(): Promise<void>
//   unsave(): Promise<void>
// }

// useDeleteComment(options): result
// export interface UseDeleteCommentOptions extends Options {
//   commentCid?: string
//   accountCommentIndex?: number
// }
// export interface UseDeleteCommentResult extends Result {
//   deletedComment: Comment | undefined
//   deleteComment(): Promise<void>
//   undeleteComment(): Promise<void>
// }

/**
 * TODO: define these types more in depth, most are already defined in:
 * https://github.com/plebbit/plebbit-js or
 * https://github.com/plebbit/plebbit-react-hooks/blob/master/docs/schema.md
 */
export type Account = {
  id: string // random immutable string
  name: string // the nickname of the account, eg "Account 1"
  author: Author
  signer: Signer
  plebbit: Plebbit
  plebbitOptions: PlebbitOptions
  // subscriptions to show in feed
  subscriptions: string[] // subplebbit subscriptions
  multisubSubscriptions: string[]
  authorSubscriptions: string[]
  // notifications turned on for addresses/cids
  notifyingSubplebbits: {[address: string]: boolean}
  notifyingMultisubs: {[address: string]: boolean}
  notifyingAuthors: {[address: string]: boolean}
  notifyingComments: {[commentCid: string]: boolean}
  blockedAddresses: {[address: string]: boolean} // hide address from feed and notifications
  blockedCids: {[cid: string]: boolean} // hide a specific comment cid from feed and notifications
  limitedAddresses: {[address: string]: number} // limit how many times per feed page an address can appear, e.g. 1 = 100%, 0.1 = 10%, 0.001 = 0.1%
  savedComments: string[] // save a list of comments for later
  karma: Karma
  unreadNotificationCount: number
  subplebbits: {[subplebbitAddress: string]: AccountSubplebbit} // the subplebbits moderated or created by the user
}

export interface Karma {
  replyUpvoteCount: number
  replyDownvoteCount: number
  replyScore: number
  postUpvoteCount: number
  postDownvoteCount: number
  postScore: number
  upvoteCount: number
  downvoteCount: number
  score: number
}

// todo these 5 have no connection to anything
export type AccountsActions = {[key: string]: any}
export type PublishCommentOptions = {[key: string]: any}
export type PublishVoteOptions = {[key: string]: any}
export type PublishCommentEditOptions = {[key: string]: any}
export type PublishSubplebbitEditOptions = {[key: string]: any}

// todo uncertain here
export type ChallengeType = {
  type: 'image/png' | 'text/plain' | 'chain/<chainTicker>'
  //...other properties for more complex types later, e.g. an array of whitelisted addresses, a token address, etc,
}

export type Challenge = {
  type: 'image' | 'text' | 'audio' | 'video' | 'html' // tells the client how to display the challenge, start with implementing image and text only first
  challenge: string // data required to complete the challenge, could be html, png, etc.
}

// todo unknown
export type ChallengeVerification = {[key: string]: any}
export type CreateCommentOptions = {[key: string]: any}

// todo handmade
export type CreateSubplebbitOptions = {title: string}
export type CreateVoteOptions = {commentCid: string; timestamp: number}

// todo publication based stuff
export interface Publication {
  author: Author
  subplebbitAddress: string // all publications are directed to a subplebbit owner
  timestamp: number // number in seconds
  signature: Signature // sign immutable fields like author, title, content, timestamp to prevent tampering
  protocolVersion: '1.0.0' // semantic version of the protocol https://semver.org/
}

export interface Signature {
  signature: string // data in base64
  publicKey: string // 32 bytes base64 string
  type: 'ed25519' | 'eip191' // multiple versions/types to allow signing with metamask/other wallet or to change the signature fields or algorithm
  signedPropertyNames: string[] // the fields that were signed as part of the signature e.g. ['title', 'content', 'author', etc.] client should require that certain fields be signed or reject the publication, e.g. 'content', 'author', 'timestamp' are essential
}

export interface Comment extends Publication /* (IPFS file) */ {
  postCid?: string // helps faster loading post info for reply direct linking, added by the subplebbit owner not author
  parentCid?: string // same as postCid for top level comments
  content: string
  previousCid: string // each post is a linked list
  depth: number // 0 = post, 1 = top level reply, 2+ = nested reply, added by the subplebbit owner not author
  ipnsName: string // each post/comment needs its own IPNS record (CommentUpdate) for its mutable data like edits, vote counts, comments
  spoiler?: boolean
  flair?: Flair // arbitrary colored string added by the author or mods to describe the author or comment
}

export interface Flair {
  text: string
  backgroundColor?: string
  textColor?: string
  expiresAt?: number // timestamp in second, a flair assigned to an author by a mod will follow the author in future comments, unless it expires
}

export interface Vote extends Publication {
  commentCid: string
  vote: 1 | -1 | 0 // 0 is needed to cancel a vote
}

// todo probably merge with commentUpdate in the todo schema
export type CommentEdit = {[key: string]: any}
// export type SubplebbitEdit = { [key: string]: any }

export interface SubplebbitEdit extends CreateSubplebbitOptions, Publication {}

export type Subplebbit /* (IPNS record Subplebbit.address) */ = {
  address: string // validate subplebbit address in signature to prevent a crypto domain resolving to an impersonated subplebbit
  title?: string
  description?: string
  roles?: {[authorAddress: string]: SubplebbitRole} // each author address can be mapped to 1 SubplebbitRole
  pubsubTopic?: string // the string to publish to in the pubsub, a public key of the subplebbit owner's choice
  lastPostCid?: string // the most recent post in the linked list of posts
  posts?: Pages // only preload page 1 sorted by 'hot', might preload more later, comments should include Comment + CommentUpdate data
  challengeTypes?: ChallengeType[] // optional, only used for displaying on frontend, don't rely on it for challenge negotiation
  statsCid?: string
  createdAt: number
  updatedAt: number
  features?: SubplebbitFeatures
  suggested?: SubplebbitSuggested
  rules?: string[]
  flairs?: {[key: string]: Flair[]} // list of post/author flairs authors and mods can choose from
  // flairs?: { [key: 'post' | 'author']: Flair[] } // list of post/author flairs authors and mods can choose from
  protocolVersion: '1.0.0' // semantic version of the protocol https://semver.org/
  encryption: SubplebbitEncryption
  signature: Signature // signature of the Subplebbit update by the sub owner to protect against malicious gateway
}

export interface SubplebbitFeatures {
  // any boolean that changes the functionality of the sub, add "no" in front if doesn't default to false
  noVideos?: boolean
  noSpoilers?: boolean // author can't comment.spoiler = true their own comments
  noImages?: boolean
  noVideoReplies?: boolean
  noSpoilerReplies?: boolean
  noImageReplies?: boolean
  noPolls?: boolean
  noCrossposts?: boolean
  noUpvotes?: boolean
  noDownvotes?: boolean
  noAuthors?: boolean // no authors at all, like 4chan
  anonymousAuthors?: boolean // authors are given anonymous ids inside threads, like 4chan
  noNestedReplies?: boolean // no nested replies, like old school forums and 4chan
  safeForWork?: boolean
  authorFlairs?: boolean // authors can choose their own author flairs (otherwise only mods can)
  requireAuthorFlairs?: boolean // force authors to choose an author flair before posting
  postFlairs?: boolean // authors can choose their own post flairs (otherwise only mods can)
  requirePostFlairs?: boolean // force authors to choose a post flair before posting
  noMarkdownImages?: boolean // don't embed images in text posts markdown
  noMarkdownVideos?: boolean // don't embed videos in text posts markdown
  markdownImageReplies?: boolean
  markdownVideoReplies?: boolean
}

export interface SubplebbitEncryption {
  type: 'ed25519-aes-gcm' // https://github.com/plebbit/plebbit-js/blob/master/docs/encryption.md
  publicKey: string // 32 bytes base64 string
}

export interface SubplebbitRole {
  role: 'owner' | 'admin' | 'moderator'
  // TODO: custom roles with other props
}

// todo there is subplebbit pages
export interface Pages {
  pages: {[key: PostsSortType | RepliesSortType]: SubplebbitPage} // e.g. subplebbit.posts.pages.hot.comments[0].cid = '12D3KooW...'
  pageCids: {[key: PostsSortType | RepliesSortType | ModSortType]: string} // e.g. subplebbit.posts.pageCids.topAll = '12D3KooW...'
}

export type PostsSortType =
  | 'hot'
  | 'new'
  | 'active'
  | 'topHour'
  | 'topDay'
  | 'topWeek'
  | 'topMonth'
  | 'topYear'
  | 'topAll'
  | 'controversialHour'
  | 'controversialDay'
  | 'controversialWeek'
  | 'controversialMonth'
  | 'controversialYear'
  | 'controversialAll'

export type SubplebbitStats = {
  hourActiveUserCount: number
  dayActiveUserCount: number
  weekActiveUserCount: number
  monthActiveUserCount: number
  yearActiveUserCount: number
  allActiveUserCount: number
  hourPostCount: number
  dayPostCount: number
  weekPostCount: number
  monthPostCount: number
  yearPostCount: number
  allPostCount: number
}
type RepliesSortType = 'topAll' | 'new' | 'old' | 'controversialAll'

type ModSortType = 'reports' | 'spam' | 'modqueue' | 'unmoderated' | 'edited'

export type SubplebbitSuggested = {
  // values suggested by the sub owner, the client/user can ignore them without breaking interoperability
  primaryColor?: string
  secondaryColor?: string
  avatarUrl?: string
  bannerUrl?: string
  backgroundUrl?: string
  language?: string
  // TODO: menu links, wiki pages, sidebar widgets
}

export type Notification = {markedAsRead: boolean}
export type Nft = {
  chainTicker: string // ticker of the chain, like eth, avax, sol, etc in lowercase
  timestamp: number // in seconds, needed to mitigate multiple users using the same signature
  address: string // address of the NFT contract
  id: string // tokenId or index of the specific NFT used, must be string type, not number
  signature: Signature // proof that author.address owns the nft
  // how to resolve and verify NFT signatures https://github.com/plebbit/plebbit-js/blob/master/docs/nft.md
}

export type Author = {
  address: string
  shortAddress: string // not part of IPFS files, added to `Author` instance as convenience. Copy address, if address is a hash, remove hash prefix and trim to 12 first chars
  previousCommentCid?: string // linked list of the author's comments
  displayName?: string
  wallets?: {[chainTicker: string]: Wallet}
  avatar?: Nft
  flair?: Flair // (added added by author originally, can be overriden by commentUpdate.subplebbit.author.flair)
  subplebbit?: SubplebbitAuthor // (added by CommentUpdate) up to date author properties specific to the subplebbit it's in
}

export interface SubplebbitAuthor {
  banExpiresAt?: number // (added by moderator only) timestamp in second, if defined the author was banned for this comment
  flair?: Flair // (added by moderator only) for when a mod wants to edit an author's flair
  postScore: number // total post karma in the subplebbit
  replyScore: number // total reply karma in the subplebbit
  lastCommentCid: string // last comment by the author in the subplebbit, can be used with author.previousCommentCid to get a recent author comment history in all subplebbits
  firstCommentTimestamp: number // timestamp of the first comment by the author in the subplebbit, used for account age based challenges
}

export interface Wallet {
  address: string
  timestamp: number // in seconds, allows partial blocking multiple authors using the same wallet
  signature: Signature // type 'eip191' {domainSeparator:"plebbit-author-wallet",authorAddress:"${authorAddress}","{timestamp:${wallet.timestamp}"}
  // ...will add more stuff later, like signer or send/sign or balance
}

/**
 * Subplebbits and comments store
 */
export type Subplebbits = {[subplebbitAddress: string]: Subplebbit}
export type Comments = {[commentCid: string]: Comment}

/**
 * Accounts store
 */
export type Accounts = {[accountId: string]: Account}

export type AccountsMetadata = {
  accountIds: string[] // this array sets the order of the accounts
  activeAccountId: string // the default account to use with all hooks and actions
  accountNamesToAccountIds: {[accountName: string]: string}
}
export type AccountNamesToAccountIds = {[accountName: string]: string}
export interface AccountComment extends Comment {
  index: number
  accountId: string
  upvoteCountMarkedAsRead: number // upvote count the last time the user read it, needed for upvote notifications
}
export type AccountComments = AccountComment[]
export type AccountsComments = {[accountId: string]: AccountComments}
export type CommentCidsToAccountsComments = {
  [commentCid: string]: {accountId: string; accountCommentIndex: number}
}
export interface AccountCommentReply extends Comment {
  markedAsRead: boolean
}
export type AccountCommentsReplies = {[replyCid: string]: AccountCommentReply}
export type AccountsCommentsReplies = {[accountId: string]: AccountCommentsReplies}
export type AccountsNotifications = {[accountId: string]: Notification[]}
export type Role = {
  role: 'owner' | 'admin' | 'moderator'
}
export type AccountSubplebbit = {
  role: Role
  autoStart?: boolean
}
export type AccountsVotes = {[accountId: string]: AccountVotes}
export type AccountVotes = {[commentCid: string]: AccountVote}
export type AccountVote = {
  previousAccountVoteCid: string // needed to scroll to every vote an account has published
  // has all the publish options like commentCid, vote, timestamp, etc
  [publishOption: string]: any
}
export type AccountsEdits = {[accountId: string]: AccountEdits}
export type AccountEdits = {[commentCidOrSubplebbitAddress: string]: AccountEdit[]}
export type AccountEdit = {
  // has all the publish options like commentCid, vote, timestamp, etc (both comment edits and subplebbit edits)
  [publishOption: string]: any
}

/**
 * Feeds store
 */
export type Feed = Comment[]
export type Feeds = {[feedName: string]: Feed}
export type FeedOptions = {
  subplebbitAddresses: string[]
  sortType: string
  accountId: string
  pageNumber: number
  postsPerPage: number
}
export type FeedsOptions = {[feedName: string]: FeedOptions}
export type FeedSubplebbitsPostCounts = {[subplebbitAddress: string]: number}
export type FeedsSubplebbitsPostCounts = {[feedName: string]: FeedSubplebbitsPostCounts}
export type SubplebbitPage = {
  nextCid?: string
  comments: Comment[]
}

export type SubplebbitsPages = {[pageCid: string]: SubplebbitPage}

/**
 * Authors comments store
 */
// authorCommentsName is a string used a key to represent authorAddress + filter + accountId
export type AuthorsComments = {[authorCommentsName: string]: Comment[]}
export type AuthorCommentsOptions = {
  authorAddress: string
  pageNumber: number
  filter?: AuthorCommentsFilter
  accountId: string
}
export type AuthorsCommentsOptions = {[authorCommentsName: string]: FeedOptions}
export type AuthorCommentsFilter = {
  subplebbitAddresses?: string[]
  hasParentCid?: boolean
}

/**
 * Accounts hooks
 */
export type AccountPublicationsFilter = {
  subplebbitAddresses?: string[]
  postCids?: string[]
  commentCids?: string[]
  parentCids?: string[]
  hasParentCid?: boolean
}

/**
 * Other
 */
export type ChainProvider = {
  chainId?: number
  urls?: string[]
}
export type ChainProviders = {[chainTicker: string]: ChainProvider}
