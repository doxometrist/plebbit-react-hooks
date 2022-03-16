"use strict";
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
const feed_sorter_1 = __importDefault(require("./feed-sorter"));
const timestamp = 1600000000000;
const approximateDay = 100000;
const day = (day) => timestamp + approximateDay * day;
const feed = [
    { timestamp: day(0), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub1' },
    { timestamp: day(0), upvoteCount: 1000, downvoteCount: 1, subplebbitAddress: 'sub1' },
    { timestamp: day(0), upvoteCount: 10001, downvoteCount: 1000, subplebbitAddress: 'sub1' },
    { timestamp: day(0), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub1' },
    { timestamp: day(3), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub1' },
    { timestamp: day(2), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub1' },
    { timestamp: day(1), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub1' },
    { timestamp: day(0), upvoteCount: 100, downvoteCount: 100, subplebbitAddress: 'sub1' },
    { timestamp: day(0), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub2' },
    { timestamp: day(0), upvoteCount: 1000, downvoteCount: 1, subplebbitAddress: 'sub2' },
    { timestamp: day(0), upvoteCount: 10000, downvoteCount: 1000, subplebbitAddress: 'sub2' },
    { timestamp: day(0), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub2' },
    { timestamp: day(3), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub2' },
    { timestamp: day(2), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub3' },
    { timestamp: day(1), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub3' },
    { timestamp: day(0), upvoteCount: 100, downvoteCount: 100, subplebbitAddress: 'sub3' },
];
for (const i in feed) {
    feed[i].cid = i;
}
describe('feedSorter', () => {
    test('sort by top', () => __awaiter(void 0, void 0, void 0, function* () {
        const sorted = feed_sorter_1.default.sort('top', feed);
        expect(sorted).toEqual([
            { timestamp: day(0), upvoteCount: 10000, downvoteCount: 1000, subplebbitAddress: 'sub2', cid: '10' },
            { timestamp: day(0), upvoteCount: 10001, downvoteCount: 1000, subplebbitAddress: 'sub1', cid: '2' },
            { timestamp: day(2), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub3', cid: '13' },
            { timestamp: day(1), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub3', cid: '14' },
            { timestamp: day(0), upvoteCount: 1000, downvoteCount: 1, subplebbitAddress: 'sub2', cid: '9' },
            { timestamp: day(0), upvoteCount: 1000, downvoteCount: 1, subplebbitAddress: 'sub1', cid: '1' },
            { timestamp: day(3), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub2', cid: '12' },
            { timestamp: day(0), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub2', cid: '8' },
            { timestamp: day(0), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub2', cid: '11' },
            { timestamp: day(3), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub1', cid: '4' },
            { timestamp: day(2), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub1', cid: '5' },
            { timestamp: day(1), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub1', cid: '6' },
            { timestamp: day(0), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub1', cid: '0' },
            { timestamp: day(0), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub1', cid: '3' },
            { timestamp: day(0), upvoteCount: 100, downvoteCount: 100, subplebbitAddress: 'sub1', cid: '7' },
            { timestamp: day(0), upvoteCount: 100, downvoteCount: 100, subplebbitAddress: 'sub3', cid: '15' }
        ]);
    }));
    test('sort by controversial', () => __awaiter(void 0, void 0, void 0, function* () {
        const sorted = feed_sorter_1.default.sort('controversial', feed);
        expect(sorted).toEqual([
            { timestamp: day(0), upvoteCount: 100, downvoteCount: 100, subplebbitAddress: 'sub3', cid: '15' },
            { timestamp: day(0), upvoteCount: 100, downvoteCount: 100, subplebbitAddress: 'sub1', cid: '7' },
            { timestamp: day(0), upvoteCount: 10000, downvoteCount: 1000, subplebbitAddress: 'sub2', cid: '10' },
            { timestamp: day(3), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub2', cid: '12' },
            { timestamp: day(0), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub2', cid: '8' },
            { timestamp: day(0), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub2', cid: '11' },
            { timestamp: day(0), upvoteCount: 1000, downvoteCount: 1, subplebbitAddress: 'sub2', cid: '9' },
            { timestamp: day(0), upvoteCount: 10001, downvoteCount: 1000, subplebbitAddress: 'sub1', cid: '2' },
            { timestamp: day(2), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub3', cid: '13' },
            { timestamp: day(1), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub3', cid: '14' },
            { timestamp: day(3), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub1', cid: '4' },
            { timestamp: day(2), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub1', cid: '5' },
            { timestamp: day(1), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub1', cid: '6' },
            { timestamp: day(0), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub1', cid: '0' },
            { timestamp: day(0), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub1', cid: '3' },
            { timestamp: day(0), upvoteCount: 1000, downvoteCount: 1, subplebbitAddress: 'sub1', cid: '1' }
        ]);
    }));
    test('sort by hot', () => __awaiter(void 0, void 0, void 0, function* () {
        const sorted = feed_sorter_1.default.sort('hot', feed);
        expect(sorted).toEqual([
            { timestamp: day(2), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub3', cid: '13' },
            { timestamp: day(1), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub3', cid: '14' },
            { timestamp: day(0), upvoteCount: 100, downvoteCount: 100, subplebbitAddress: 'sub3', cid: '15' },
            { timestamp: day(3), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub2', cid: '12' },
            { timestamp: day(0), upvoteCount: 10000, downvoteCount: 1000, subplebbitAddress: 'sub2', cid: '10' },
            { timestamp: day(0), upvoteCount: 1000, downvoteCount: 1, subplebbitAddress: 'sub2', cid: '9' },
            { timestamp: day(0), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub2', cid: '8' },
            { timestamp: day(0), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub2', cid: '11' },
            { timestamp: day(3), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub1', cid: '4' },
            { timestamp: day(2), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub1', cid: '5' },
            { timestamp: day(1), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub1', cid: '6' },
            { timestamp: day(0), upvoteCount: 10001, downvoteCount: 1000, subplebbitAddress: 'sub1', cid: '2' },
            { timestamp: day(0), upvoteCount: 1000, downvoteCount: 1, subplebbitAddress: 'sub1', cid: '1' },
            { timestamp: day(0), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub1', cid: '0' },
            { timestamp: day(0), upvoteCount: 100, downvoteCount: 10, subplebbitAddress: 'sub1', cid: '3' },
            { timestamp: day(0), upvoteCount: 100, downvoteCount: 100, subplebbitAddress: 'sub1', cid: '7' }
        ]);
    }));
});
