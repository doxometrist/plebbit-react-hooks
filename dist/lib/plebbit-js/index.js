// NOTE: don't import plebbit-js directly to be able to mock it for unit tests
function Plebbit(plebbitOptions) { } // should import from plebbit-js npm module later instead
const PlebbitJs = {
    Plebbit: Plebbit
};
// mock the plebbit-js module for unit tests
export function mockPlebbitJs(_Plebbit) {
    PlebbitJs.Plebbit = _Plebbit;
}
export default PlebbitJs;
