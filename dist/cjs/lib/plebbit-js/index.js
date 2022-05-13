"use strict";
// NOTE: don't import plebbit-js directly to be able to mock it for unit tests
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockPlebbitJs = void 0;
const plebbit_js_mock_content_1 = __importDefault(require("./plebbit-js-mock-content"));
// @ts-ignore
// import Plebbit from "@plebbit/plebbit-js"
const Plebbit = (options) => ({});
const PlebbitJs = {
    Plebbit: Plebbit,
};
// mock the plebbit-js module for unit tests
function mockPlebbitJs(_Plebbit) {
    PlebbitJs.Plebbit = _Plebbit;
}
exports.mockPlebbitJs = mockPlebbitJs;
try {
    // mock content for front-end dev with this env var
    if (process.env.REACT_APP_PLEBBIT_REACT_HOOKS_MOCK_CONTENT) {
        mockPlebbitJs(plebbit_js_mock_content_1.default);
    }
}
catch (e) { }
exports.default = PlebbitJs;
