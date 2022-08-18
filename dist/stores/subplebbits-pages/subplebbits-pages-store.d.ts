import { Subplebbit, SubplebbitPage, SubplebbitsPages } from '../../types';
export declare const listeners: any;
declare type SubplebbitsPagesState = {
    subplebbitsPages: SubplebbitsPages;
    addNextSubplebbitPageToStore: Function;
};
declare const subplebbitsPagesStore: import("zustand").UseBoundStore<import("zustand").StoreApi<SubplebbitsPagesState>>;
/**
 * Util function to get all pages in the store for a
 * specific subplebbit+sortType using `SubplebbitPage.nextCid`
 */
export declare const getSubplebbitPages: (subplebbit: Subplebbit, sortType: string, subplebbitsPages: SubplebbitsPages) => SubplebbitPage[];
export declare const getSubplebbitFirstPageCid: (subplebbit: Subplebbit, sortType: string) => any;
export declare const resetSubplebbitsPagesStore: () => Promise<void>;
export declare const resetSubplebbitsPagesDatabaseAndStore: () => Promise<void>;
export default subplebbitsPagesStore;
