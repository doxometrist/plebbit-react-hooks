export declare const flattenCommentsPages: (pageInstanceOrPagesInstance: any) => any[];
export declare const memo: (functionToMemo: Function, memoOptions: any) => (...args: any) => Promise<any>;
export declare const memoSync: (functionToMemo: Function, memoOptions: any) => (...args: any) => any;
export declare const clientsOnStateChange: (clients: any, onStateChange: Function) => void;
declare const utils: {
    merge: (...args: any) => any;
    clone: (obj: any) => any;
    flattenCommentsPages: (pageInstanceOrPagesInstance: any) => any[];
    memo: (functionToMemo: Function, memoOptions: any) => (...args: any) => Promise<any>;
    memoSync: (functionToMemo: Function, memoOptions: any) => (...args: any) => any;
    retryInfinity: (f: any, o?: any) => any;
    retryInfinityMinTimeout: number;
    retryInfinityMaxTimeout: number;
    clientsOnStateChange: (clients: any, onStateChange: Function) => void;
};
export declare const retryInfinity: (functionToRetry: any, options?: any) => Promise<any>;
export default utils;
