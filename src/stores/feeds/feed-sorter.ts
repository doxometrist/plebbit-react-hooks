interface Post {
  upvoteCount: number
  timestamp: number
  downvoteCount: number
  subplebbitAddress: string
  cid: string
  lastReplyTimestamp: number
  pinned: boolean
}

/**
 * Sort by top is made using relative score, to encourage small communities to grow
 * and to not incentivize communities to inflate their vote counts
 */
const sortByTop = (feed: Post[]) => {
  const subplebbitScores: {[key: string]: number} = {}
  const postScores: {[key: string]: number} = {}
  const postRelativeScores: {[key: string]: number} = {}
  for (const post of feed) {
    const score = post.upvoteCount - post.downvoteCount || 0
    if (!subplebbitScores[post.subplebbitAddress]) {
      subplebbitScores[post.subplebbitAddress] = 0
    }
    subplebbitScores[post.subplebbitAddress] += score
    postScores[post.cid] = score
  }
  for (const post of feed) {
    // don't use subplebbit scores lower than 1 or it reverses the relative score
    const subplebbitScore = subplebbitScores[post.subplebbitAddress] || 1
    postRelativeScores[post.cid] = postScores[post.cid] / subplebbitScore
  }
  // sort by new and upvoteCount first, for tiebreaker, then relative scores
  return feed
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .sort((a, b) => (b.upvoteCount || 0) - (a.upvoteCount || 0))
    .sort((a, b) => (postRelativeScores[b.cid] || 0) - (postRelativeScores[a.cid] || 0))
}

/**
 * Sort by controversial is made using relative score, to encourage small communities to grow
 * and to not incentivize communities to inflate their vote counts
 */
const sortByControversial = (feed: Post[]) => {
  const subplebbitScores: {[key: string]: number} = {}
  const postScores: {[key: string]: number} = {}
  const postRelativeScores: {[key: string]: number} = {}
  for (const post of feed) {
    const upvoteCount = post.upvoteCount || 0
    const downvoteCount = post.downvoteCount || 0
    const magnitude = upvoteCount + downvoteCount
    const balance = upvoteCount > downvoteCount ? downvoteCount / upvoteCount : upvoteCount / downvoteCount
    const score = Math.pow(magnitude, balance)
    if (!subplebbitScores[post.subplebbitAddress]) {
      subplebbitScores[post.subplebbitAddress] = 0
    }
    subplebbitScores[post.subplebbitAddress] += score
    postScores[post.cid] = score
  }
  for (const post of feed) {
    // don't use subplebbit scores lower than 1 or it reverses the relative score
    const subplebbitScore = subplebbitScores[post.subplebbitAddress] || 1
    postRelativeScores[post.cid] = postScores[post.cid] / subplebbitScore
  }
  // sort by new and upvoteCount first, for tiebreaker, then relative scores
  return feed
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .sort((a, b) => (b.upvoteCount || 0) - (a.upvoteCount || 0))
    .sort((a, b) => (postRelativeScores[b.cid] || 0) - (postRelativeScores[a.cid] || 0))
}
/**
 * Sort by hot is made using relative score, to encourage small communities to grow
 * and to not incentivize communities to inflate their vote counts
 * Note: a sub with not many posts will be given very high priority
 */
const sortByHot = (feed: Post[]) => {
  const subplebbitScores: {[key: string]: number} = {}
  const postScores: {[key: string]: number} = {}
  const postRelativeScores: {[key: string]: number} = {}
  const round = (number: number, decimalPlaces: number) => {
    const factorOfTen = Math.pow(10, decimalPlaces)
    return Math.round(number * factorOfTen) / factorOfTen
  }
  for (const post of feed) {
    const score = (post.upvoteCount || 0) - (post.downvoteCount || 0)
    const order = Math.log10(Math.max(score, 1))
    const sign = score > 0 ? 1 : score < 0 ? -1 : 0
    const seconds = post.timestamp - 1134028003
    const hotScore = round(sign * order + seconds / 45000, 7)
    if (!subplebbitScores[post.subplebbitAddress]) {
      subplebbitScores[post.subplebbitAddress] = 0
    }
    subplebbitScores[post.subplebbitAddress] += hotScore
    postScores[post.cid] = hotScore
  }
  for (const post of feed) {
    // don't use subplebbit scores lower than 1 or it reverses the relative score
    const subplebbitScore = subplebbitScores[post.subplebbitAddress] || 1
    postRelativeScores[post.cid] = postScores[post.cid] / subplebbitScore
  }
  // sort by new and upvoteCount first, for tiebreaker, then relative scores
  return feed
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .sort((a, b) => (b.upvoteCount || 0) - (a.upvoteCount || 0))
    .sort((a, b) => (postRelativeScores[b.cid] || 0) - (postRelativeScores[a.cid] || 0))
}

/**
 * Sort by new is made using relative timestamp score, to encourage small communities to grow
 * and to not incentivize communities to inflate their timestamp
 */
const sortByNew = (feed: Post[]) => {
  const subplebbitScores: {[key: string]: number} = {}
  const postScores: {[key: string]: number} = {}
  const postRelativeScores: {[key: string]: number} = {}
  for (const post of feed) {
    const score = post.timestamp || 0
    if (!subplebbitScores[post.subplebbitAddress]) {
      subplebbitScores[post.subplebbitAddress] = 0
    }
    subplebbitScores[post.subplebbitAddress] += score
    postScores[post.cid] = score
  }
  for (const post of feed) {
    // don't use subplebbit scores lower than 1 or it reverses the relative score
    const subplebbitScore = subplebbitScores[post.subplebbitAddress] || 1
    postRelativeScores[post.cid] = postScores[post.cid] / subplebbitScore
  }
  // sort by new and upvoteCount first, for tiebreaker, then relative scores
  return feed
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .sort((a, b) => (b.upvoteCount || 0) - (a.upvoteCount || 0))
    .sort((a, b) => (postRelativeScores[b.cid] || 0) - (postRelativeScores[a.cid] || 0))
}

/**
 * Sort by active is made using relative lastReplyTimestamp score, to encourage small communities to grow
 * and to not incentivize communities to inflate their lastReplyTimestamp
 */
const sortByActive = (feed: Post[]) => {
  const subplebbitScores: {[key: string]: number} = {}
  const postScores: {[key: string]: number} = {}
  const postRelativeScores: {[key: string]: number} = {}
  for (const post of feed) {
    const score = post.lastReplyTimestamp || post.timestamp || 0
    if (!subplebbitScores[post.subplebbitAddress]) {
      subplebbitScores[post.subplebbitAddress] = 0
    }
    subplebbitScores[post.subplebbitAddress] += score
    postScores[post.cid] = score
  }
  for (const post of feed) {
    // don't use subplebbit scores lower than 1 or it reverses the relative score
    const subplebbitScore = subplebbitScores[post.subplebbitAddress] || 1
    postRelativeScores[post.cid] = postScores[post.cid] / subplebbitScore
  }
  // sort by new and upvoteCount first, for tiebreaker, then relative scores
  return feed
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .sort((a, b) => (b.upvoteCount || 0) - (a.upvoteCount || 0))
    .sort((a, b) => (postRelativeScores[b.cid] || 0) - (postRelativeScores[a.cid] || 0))
}

export const sort = (sortType: string, feed: Post[]) => {
  // pinned posts are not sorted, maybe in a future version we can sort them based on something
  const pinnedPosts = feed.filter((post) => post.pinned)

  feed = feed.filter((post) => !post.pinned)
  if (sortType === 'new') {
    return [...pinnedPosts, ...sortByNew(feed)]
  }
  if (sortType === 'hot') {
    return [...pinnedPosts, ...sortByHot(feed)]
  }
  if (sortType.match('top')) {
    return [...pinnedPosts, ...sortByTop(feed)]
  }
  if (sortType.match('controversial')) {
    return [...pinnedPosts, ...sortByControversial(feed)]
  }
  if (sortType.match('active')) {
    return [...pinnedPosts, ...sortByActive(feed)]
  }
  throw Error(`feedsStore feedSorter sort type '${sortType}' doesn't exist`)
}

export default {sort}
