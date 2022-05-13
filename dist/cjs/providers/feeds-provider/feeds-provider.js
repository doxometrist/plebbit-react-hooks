"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedsContext = void 0;
const react_1 = __importStar(require("react"));
const accounts_provider_1 = require("../accounts-provider");
const subplebbits_provider_1 = require("../subplebbits-provider");
const feed_sorter_1 = __importDefault(require("./feed-sorter"));
const assert_1 = __importDefault(require("assert"));
const localforage_lru_1 = __importDefault(require("../../lib/localforage-lru"));
const utils_1 = __importDefault(require("../../lib/utils"));
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)('plebbitreacthooks:providers:feedsprovider');
const subplebbitsPagesDatabase = localforage_lru_1.default.createInstance({ name: 'subplebbitsPages', size: 500 });
// reddit loads approximately 25 posts per page
// while infinite scrolling
const postsPerPage = 25;
// keep large buffer because fetching cids is slow
const subplebbitPostsLeftBeforeNextPage = 50;
exports.FeedsContext = react_1.default.createContext(undefined);
function FeedsProvider(props) {
    const [feedsOptions, setFeedsOptions] = (0, react_1.useState)({});
    const [bufferedFeeds, setBufferedFeeds] = (0, react_1.useState)({});
    const [loadedFeeds, setLoadedFeeds] = (0, react_1.useState)({});
    // fetch subplebbits, subplebbits pages and next subplebbit pages whenever bufferedFeeds gets too low
    const subplebbits = useSubplebbits(feedsOptions);
    const subplebbitsPostsInfo = useSubplebbitsPostsInfo(feedsOptions, subplebbits, bufferedFeeds);
    const subplebbitsPages = useSubplebbitsPages(subplebbitsPostsInfo, subplebbits);
    const calculatedBufferedFeeds = useCalculatedBufferedFeeds(feedsOptions, subplebbitsPostsInfo, subplebbitsPages, loadedFeeds);
    const feedsHaveMore = useFeedsHaveMore(feedsOptions, subplebbits, subplebbitsPages, bufferedFeeds);
    // handle buffered feeds
    (0, react_1.useEffect)(() => {
        // don't rerender if there are no feeds
        if (Object.keys(calculatedBufferedFeeds).length === 0) {
            return;
        }
        setBufferedFeeds(calculatedBufferedFeeds);
    }, [calculatedBufferedFeeds]);
    // handle loaded feeds
    (0, react_1.useEffect)(() => {
        const loadedFeedsMissingPosts = {};
        for (const feedName in feedsOptions) {
            const { pageNumber } = feedsOptions[feedName];
            const loadedFeedPostCount = pageNumber * postsPerPage;
            const currentLoadedFeed = loadedFeeds[feedName] || [];
            const missingPostsCount = loadedFeedPostCount - currentLoadedFeed.length;
            // get new posts from buffered feed
            const bufferedFeed = bufferedFeeds[feedName] || [];
            const missingPosts = [...bufferedFeed];
            if (missingPosts.length > missingPostsCount) {
                missingPosts.length = missingPostsCount;
            }
            // the current loaded feed already exist and doesn't need new posts
            if (missingPosts.length === 0 && loadedFeeds[feedName]) {
                continue;
            }
            loadedFeedsMissingPosts[feedName] = missingPosts;
        }
        // don't rerender if there are no missing posts
        if (Object.keys(loadedFeedsMissingPosts).length === 0) {
            return;
        }
        setLoadedFeeds((previousLoadedFeeds) => {
            const newLoadedFeeds = {};
            for (const feedName in loadedFeedsMissingPosts) {
                newLoadedFeeds[feedName] = [...(previousLoadedFeeds[feedName] || []), ...loadedFeedsMissingPosts[feedName]];
            }
            return Object.assign(Object.assign({}, previousLoadedFeeds), newLoadedFeeds);
        });
    }, [bufferedFeeds, feedsOptions]);
    const feedsActions = {};
    feedsActions.addFeedToContext = (feedName, subplebbitAddresses, sortType, account, isBufferedFeed) => {
        // feed is in context already, do nothing
        // if the feed already exist but is at page 1, reset it to page 1
        if (feedsOptions[feedName] && feedsOptions[feedName].pageNumber !== 0) {
            return;
        }
        // to add a buffered feed, add a feed with pageNumber 0
        const feedOptions = { subplebbitAddresses, sortType, account, pageNumber: isBufferedFeed === true ? 0 : 1 };
        debug('feedsActions.addFeedToContext', feedOptions);
        setFeedsOptions((previousFeedsOptions) => {
            // make sure to never overwrite a feed already added
            if (previousFeedsOptions[feedName]) {
                return previousFeedsOptions;
            }
            return Object.assign(Object.assign({}, previousFeedsOptions), { [feedName]: feedOptions });
        });
    };
    feedsActions.incrementFeedPageNumber = (feedName) => {
        (0, assert_1.default)(feedsOptions[feedName], `feedsActions.incrementFeedPageNumber feed name '${feedName}' does not exist in FeedsContext`);
        debug('feedsActions.incrementFeedPageNumber', { feedName });
        setFeedsOptions((previousFeedsOptions) => {
            (0, assert_1.default)(previousFeedsOptions[feedName].pageNumber * postsPerPage <= loadedFeeds[feedName].length, `feedsActions.incrementFeedPageNumber cannot increment feed page number before current page has loaded`);
            const feedOptions = Object.assign(Object.assign({}, previousFeedsOptions[feedName]), { pageNumber: previousFeedsOptions[feedName].pageNumber + 1 });
            return Object.assign(Object.assign({}, previousFeedsOptions), { [feedName]: feedOptions });
        });
    };
    if (!props.children) {
        return null;
    }
    const feedsContext = {
        bufferedFeeds,
        loadedFeeds,
        feedsActions,
        feedsHaveMore,
    };
    // debug util
    const bufferedFeedsLengths = useFeedsLengths(bufferedFeeds);
    const loadedFeedsLengths = useFeedsLengths(loadedFeeds);
    debug({
        feedsOptions,
        feedsHaveMore,
        subplebbitsPostsInfo,
        subplebbitsPages,
        bufferedFeedsLengths,
        loadedFeedsLengths,
    });
    return react_1.default.createElement(exports.FeedsContext.Provider, { value: feedsContext }, props.children);
}
exports.default = FeedsProvider;
/**
 * Debug util
 */
function useFeedsLengths(feeds) {
    return (0, react_1.useMemo)(() => {
        const feedsLengths = {};
        for (const feedName in feeds) {
            if (feeds[feedName]) {
                feedsLengths[feedName] = feeds[feedName].length || 0;
            }
        }
        return feedsLengths;
    }, [feeds]);
}
/**
 * List of which feeds have more posts, i.e. have no reached the final page of all subs
 */
function useFeedsHaveMore(feedsOptions, subplebbits, subplebbitsPages, bufferedFeeds) {
    return (0, react_1.useMemo)(() => {
        var _a, _b, _c;
        const feedsHaveMore = {};
        feedsLoop: for (const feedName in feedsOptions) {
            // if the feed still has buffered posts, then it still has more
            if ((_a = bufferedFeeds[feedName]) === null || _a === void 0 ? void 0 : _a.length) {
                feedsHaveMore[feedName] = true;
                continue;
            }
            const { subplebbitAddresses, sortType } = feedsOptions[feedName];
            for (const subplebbitAddress of subplebbitAddresses) {
                const subplebbit = subplebbits[subplebbitAddress];
                // if at least 1 subplebbit hasn't loaded yet, then the feed still has more
                if (!subplebbit) {
                    feedsHaveMore[feedName] = true;
                    continue feedsLoop;
                }
                const firstPageCid = (_c = (_b = subplebbit.posts) === null || _b === void 0 ? void 0 : _b.pageCids) === null || _c === void 0 ? void 0 : _c[sortType];
                // TODO: if a loaded subplebbit doesn't have a first page, it's unclear what we should do
                // should we try to use another sort type by default, like 'hot', or should we just ignore it?
                // 'continue' to ignore it for now
                if (!firstPageCid) {
                    continue;
                }
                const pages = getSubplebbitPages(firstPageCid, subplebbitsPages);
                // if first page isn't loaded yet, then the feed still has more
                if (!pages.length) {
                    feedsHaveMore[feedName] = true;
                    continue feedsLoop;
                }
                const lastPage = pages[pages.length - 1];
                if (lastPage.nextCid) {
                    feedsHaveMore[feedName] = true;
                    continue feedsLoop;
                }
            }
            // if buffered feeds are empty and no last page of any subplebbit has a next page, then has more is false
            feedsHaveMore[feedName] = false;
        }
        return feedsHaveMore;
    }, [feedsOptions, bufferedFeeds, subplebbits, subplebbitsPages]);
}
/**
 * Calculate the final buffered feeds from all the loaded subplebbit pages, sort them,
 * and remove the posts already loaded in loadedFeeds
 */
function useCalculatedBufferedFeeds(feedsOptions, subplebbitsPostsInfo, subplebbitsPages, loadedFeeds) {
    return (0, react_1.useMemo)(() => {
        var _a;
        // contruct a list of posts already loaded to remove them from buffered feeds
        const loadedFeedsPosts = {};
        for (const feedName in loadedFeeds) {
            loadedFeedsPosts[feedName] = new Set();
            for (const post of loadedFeeds[feedName]) {
                loadedFeedsPosts[feedName].add(post.cid);
            }
        }
        // calculate each feed
        let newBufferedFeeds = {};
        for (const feedName in feedsOptions) {
            const { subplebbitAddresses, sortType, account } = feedsOptions[feedName];
            // find all fetched posts
            const bufferedFeedPosts = [];
            // start by finding all pageCids
            for (const subplebbitAddress of subplebbitAddresses) {
                for (const infoName in subplebbitsPostsInfo) {
                    const info = subplebbitsPostsInfo[infoName];
                    if (info.sortType !== sortType) {
                        continue;
                    }
                    if (info.subplebbitAddress !== subplebbitAddress) {
                        continue;
                    }
                    // found an info that matches the sub address and sort type
                    // get all the pages for it from subplebbitsPages
                    const subplebbitPages = getSubplebbitPages(info.firstPageCid, subplebbitsPages);
                    // add each comment from each page, do not filter at this stage, filter after sorting
                    for (const subplebbitPage of subplebbitPages) {
                        if (subplebbitPage === null || subplebbitPage === void 0 ? void 0 : subplebbitPage.comments) {
                            bufferedFeedPosts.push(...subplebbitPage.comments);
                        }
                    }
                }
            }
            // sort the feed before filtering to get more accurate results
            const sortedBufferedFeedPosts = feed_sorter_1.default.sort(sortType, bufferedFeedPosts);
            // filter the feed
            const filteredSortedBufferedFeedPosts = [];
            for (const post of sortedBufferedFeedPosts) {
                // don't add posts already loaded in loaded feeds
                if ((_a = loadedFeedsPosts[feedName]) === null || _a === void 0 ? void 0 : _a.has(post.cid)) {
                    continue;
                }
                // TODO: filter blocked addresses
                // if (account.blockedAddresses[post.subplebbitAddress] || account.blockedAddresses[post.author.address]) {
                //   continue
                // }
                filteredSortedBufferedFeedPosts.push(post);
            }
            newBufferedFeeds[feedName] = filteredSortedBufferedFeedPosts;
        }
        return newBufferedFeeds;
    }, [feedsOptions, subplebbitsPages, loadedFeeds]);
}
/**
 * Use the `SubplebbitPostsInfo` objects to fetch the first page of all subplebbit/sorts
 * if the `SubplebbitPostsInfo.bufferedPostCount` gets too low, start fetching the next page.
 * Once a next page is added, it is never removed.
 */
function useSubplebbitsPages(subplebbitsPostsInfo, subplebbits) {
    const accountsContext = (0, react_1.useContext)(accounts_provider_1.AccountsContext);
    const [subplebbitsPages, setSubplebbitsPages] = (0, react_1.useState)({});
    // set the info necessary to fetch each page recursively
    // if bufferedPostCount is less than subplebbitPostsLeftBeforeNextPage
    const subplebbitsPagesInfo = (0, react_1.useMemo)(() => {
        var _a, _b, _c;
        const newSubplebbitsPagesInfo = {};
        for (const infoName in subplebbitsPostsInfo) {
            const { firstPageCid, account, subplebbitAddress, sortType, bufferedPostCount } = subplebbitsPostsInfo[infoName];
            // add first page
            const subplebbitFirstPageInfo = {
                pageCid: firstPageCid,
                account,
                subplebbitAddress,
                sortType,
                // add preloaded subplebbit page if any
                page: (_c = (_b = (_a = subplebbits === null || subplebbits === void 0 ? void 0 : subplebbits[subplebbitAddress]) === null || _a === void 0 ? void 0 : _a.posts) === null || _b === void 0 ? void 0 : _b.pages) === null || _c === void 0 ? void 0 : _c[sortType],
            };
            newSubplebbitsPagesInfo[firstPageCid + infoName] = subplebbitFirstPageInfo;
            // add all next pages if needed and if available
            if (bufferedPostCount <= subplebbitPostsLeftBeforeNextPage) {
                const subplebbitPages = getSubplebbitPages(firstPageCid, subplebbitsPages);
                for (const page of subplebbitPages) {
                    if (page.nextCid) {
                        const subplebbitNextPageInfo = {
                            pageCid: page.nextCid,
                            account,
                            subplebbitAddress,
                            sortType,
                        };
                        newSubplebbitsPagesInfo[page.nextCid + infoName] = subplebbitNextPageInfo;
                    }
                }
            }
        }
        return newSubplebbitsPagesInfo;
    }, [subplebbitsPostsInfo, subplebbitsPages]);
    // fetch subplebbit pages if needed
    // once a page is added, it's never removed
    (0, react_1.useEffect)(() => {
        for (const infoName in subplebbitsPagesInfo) {
            const { pageCid, account, subplebbitAddress, page } = subplebbitsPagesInfo[infoName];
            // page already fetched or fetching
            if (subplebbitsPages[pageCid] || getSubplebbitPagePending[account.id + pageCid]) {
                continue;
            }
            // the subplebbit page was already preloaded in the subplebbit IPNS record
            if (page) {
                setSubplebbitsPages((previousSubplebbitsPages) => (Object.assign(Object.assign({}, previousSubplebbitsPages), { [pageCid]: page })));
                continue;
            }
            ;
            (() => __awaiter(this, void 0, void 0, function* () {
                // subplebbit page is cached
                const cachedSubplebbitPage = yield subplebbitsPagesDatabase.getItem(pageCid);
                if (cachedSubplebbitPage) {
                    setSubplebbitsPages((previousSubplebbitsPages) => (Object.assign(Object.assign({}, previousSubplebbitsPages), { [pageCid]: cachedSubplebbitPage })));
                    return;
                }
                getSubplebbitPagePending[account.id + pageCid] = true;
                const subplebbit = yield account.plebbit.createSubplebbit({ address: subplebbitAddress });
                const fetchedSubplebbitPage = yield subplebbit.posts.getPage(pageCid);
                yield subplebbitsPagesDatabase.setItem(pageCid, fetchedSubplebbitPage);
                debug('FeedsProvider useSubplebbitsPages subplebbit.posts.getPage', {
                    pageCid,
                    infoName,
                    subplebbitPage: {
                        nextCid: fetchedSubplebbitPage.nextCid,
                        commentsLength: fetchedSubplebbitPage.comments.length,
                        subplebbitsPostsInfo,
                    },
                });
                setSubplebbitsPages((previousSubplebbitsPages) => (Object.assign(Object.assign({}, previousSubplebbitsPages), { [pageCid]: fetchedSubplebbitPage })));
                getSubplebbitPagePending[account.id + pageCid] = false;
                // when publishing a comment, you don't yet know its CID
                // so when a new comment is fetched, check to see if it's your own
                // comment, and if yes, add the CID to your account comments database
                if (accountsContext === null || accountsContext === void 0 ? void 0 : accountsContext.addCidToAccountComment) {
                    const flattenedReplies = utils_1.default.flattenCommentsPages(fetchedSubplebbitPage);
                    for (const comment of flattenedReplies) {
                        accountsContext.addCidToAccountComment(comment);
                    }
                }
            }))();
        }
    }, [subplebbitsPagesInfo]);
    return subplebbitsPages;
}
const getSubplebbitPagePending = {};
/**
 * Util function to gather in an array all loaded `SubplebbitPage` pages of a subplebbit/sort
 * using `SubplebbitPage.nextCid`
 */
const getSubplebbitPages = (firstPageCid, subplebbitsPages) => {
    var _a;
    const pages = [];
    const firstPage = subplebbitsPages[firstPageCid];
    if (!firstPage) {
        return pages;
    }
    pages.push(firstPage);
    while (true) {
        const nextCid = (_a = pages[pages.length - 1]) === null || _a === void 0 ? void 0 : _a.nextCid;
        const subplebbitPage = subplebbitsPages[nextCid];
        if (!subplebbitPage) {
            return pages;
        }
        pages.push(subplebbitPage);
    }
};
/**
 * Generate a list of `SubplebbitPostsInfo` objects which contain the information required
 * to initiate fetching the pages of each subplebbit/sort/account/feed
 */
function useSubplebbitsPostsInfo(feedsOptions, subplebbits, bufferedFeeds) {
    const bufferedFeedsSubplebbitsPostCounts = useBufferedFeedsSubplebbitsPostCounts(feedsOptions, bufferedFeeds);
    return (0, react_1.useMemo)(() => {
        var _a, _b, _c;
        const subplebbitsPostsInfo = {};
        for (const feedName in feedsOptions) {
            const { subplebbitAddresses, sortType, account } = feedsOptions[feedName];
            for (const subplebbitAddress of subplebbitAddresses) {
                const subplebbit = subplebbits[subplebbitAddress];
                const pageCid = (_b = (_a = subplebbit === null || subplebbit === void 0 ? void 0 : subplebbit.posts) === null || _a === void 0 ? void 0 : _a.pageCids) === null || _b === void 0 ? void 0 : _b[sortType];
                if (!pageCid) {
                    continue;
                }
                const subplebbitPostsInfo = {
                    firstPageCid: pageCid,
                    account,
                    subplebbitAddress,
                    sortType,
                    bufferedPostCount: ((_c = bufferedFeedsSubplebbitsPostCounts[feedName]) === null || _c === void 0 ? void 0 : _c[subplebbitAddress]) || 0,
                };
                subplebbitsPostsInfo[account.id + subplebbitAddress + sortType] = subplebbitPostsInfo;
            }
        }
        return subplebbitsPostsInfo;
        // don't use bufferedFeeds to rerender, only rerender on feedOptions.pageNumber change, or subplebbit.posts.pageCids change
    }, [feedsOptions, subplebbits]);
}
/**
 * This convoluted hook is required to keep track of how many posts are left buffered in each subplebbit,
 * each sort, and each feed. If the amount gets too low, a new page can be fetched in advance.
 */
function useBufferedFeedsSubplebbitsPostCounts(feedsOptions, bufferedFeeds) {
    return (0, react_1.useMemo)(() => {
        const feedsSubplebbitsPostCounts = {};
        for (const feedName in feedsOptions) {
            feedsSubplebbitsPostCounts[feedName] = {};
            for (const subplebbitAddress of feedsOptions[feedName].subplebbitAddresses) {
                feedsSubplebbitsPostCounts[feedName][subplebbitAddress] = 0;
            }
            for (const comment of bufferedFeeds[feedName]) {
                feedsSubplebbitsPostCounts[feedName][comment.subplebbitAddress]++;
            }
        }
        return feedsSubplebbitsPostCounts;
    }, [bufferedFeeds]);
}
/**
 * Add subplebbits to SubplebbitsContext as they are needed, and return them as an object
 */
function useSubplebbits(feedsOptions) {
    const subplebbitAddressesAndAccounts = useUniqueSortedSubplebbitAddressesAndAccounts(feedsOptions);
    const subplebbitsContext = (0, react_1.useContext)(subplebbits_provider_1.SubplebbitsContext);
    const subplebbits = {};
    for (const [subplebbitAddress] of subplebbitAddressesAndAccounts) {
        subplebbits[subplebbitAddress] = subplebbitsContext.subplebbits[subplebbitAddress];
    }
    (0, react_1.useEffect)(() => {
        for (const [subplebbitAddress, account] of subplebbitAddressesAndAccounts) {
            // if subplebbit isn't already in context, add it
            if (!subplebbitsContext.subplebbits[subplebbitAddress]) {
                subplebbitsContext.subplebbitsActions.addSubplebbitToContext(subplebbitAddress, account);
            }
        }
    }, [subplebbitAddressesAndAccounts]);
    debug('FeedsProvider useSubplebbits', { subplebbitsContext: subplebbitsContext.subplebbits });
    return subplebbits;
}
/**
 * Util function of useSubplebbits to not rerender unnecessarily
 */
function useUniqueSortedSubplebbitAddressesAndAccounts(feedsOptions) {
    return (0, react_1.useMemo)(() => {
        const accounts = {};
        const subplebbitAddressesAndAccountsStrings = [];
        for (const feedName in feedsOptions) {
            const feedOptions = feedsOptions[feedName];
            accounts[feedOptions.account.id] = feedOptions.account;
            for (const subplebbitAddress of feedOptions.subplebbitAddresses) {
                subplebbitAddressesAndAccountsStrings.push(JSON.stringify([subplebbitAddress, feedOptions.account.id]));
            }
        }
        const uniqueSortedStrings = [...new Set(subplebbitAddressesAndAccountsStrings.sort())];
        const uniqueSorted = uniqueSortedStrings.map((string) => JSON.parse(string));
        return uniqueSorted.map(([subplebbitAddress, accountId]) => [subplebbitAddress, accounts[accountId]]);
    }, [feedsOptions]);
}
