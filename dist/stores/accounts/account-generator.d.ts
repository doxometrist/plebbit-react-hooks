import { AccountSubplebbit } from '../../types';
export declare const getDefaultPlebbitOptions: () => any;
export declare const generateDefaultAccount: () => Promise<{
    id: string;
    name: string;
    author: {
        address: any;
    };
    signer: any;
    plebbitOptions: any;
    plebbit: any;
    subscriptions: never[];
    blockedAddresses: {};
    blockedCids: {};
    subplebbits: {
        [subplebbitAddress: string]: AccountSubplebbit;
    };
}>;
declare const accountGenerator: {
    generateDefaultAccount: () => Promise<{
        id: string;
        name: string;
        author: {
            address: any;
        };
        signer: any;
        plebbitOptions: any;
        plebbit: any;
        subscriptions: never[];
        blockedAddresses: {};
        blockedCids: {};
        subplebbits: {
            [subplebbitAddress: string]: AccountSubplebbit;
        };
    }>;
    getDefaultPlebbitOptions: () => any;
};
export default accountGenerator;
