import utils from './utils'
import {Account, Author, Role} from '../../types'

describe('accountsStore utils', () => {
  const author: Author = {
    address: 'author address',
    shortAddress: '',
  }
  const adminRole: Role = {role: 'admin'}
  const moderatorRole: Role = {role: 'moderator'}

  describe('getAccountSubplebbits', () => {
    test('empty', async () => {
      const account: Account = {
        author,
        id: '',
        name: '',
        signer: undefined,
        plebbit: new Plebbit(),
        plebbitOptions: undefined,
        subscriptions: [],
        multisubSubscriptions: [],
        authorSubscriptions: [],
        notifyingSubplebbits: {},
        notifyingMultisubs: {},
        notifyingAuthors: {},
        notifyingComments: {},
        blockedAddresses: {},
        blockedCids: {},
        limitedAddresses: {},
        savedComments: [],
        karma: undefined,
        unreadNotificationCount: 0,
        subplebbits: {},
      }
      const subplebbits = {}
      const accountSubplebbits = utils.getAccountSubplebbits(account, subplebbits)
      expect(accountSubplebbits).toEqual({})
    })

    test('previous account subplebbits, no new account subplebbits', async () => {
      const previousAccountSubplebbits = {
        subplebbitAddress1: {
          role: adminRole,
          autoStart: false,
        },
      }
      const account = {author, subplebbits: previousAccountSubplebbits}
      const subplebbits = {}
      const accountSubplebbits = utils.getAccountSubplebbits(account, subplebbits)
      expect(accountSubplebbits).toEqual(previousAccountSubplebbits)
    })

    test('no previous account subplebbits, new account subplebbits', async () => {
      const account = {author}
      const subplebbits = {
        subplebbitAddress1: {
          roles: {
            [author.address]: moderatorRole,
          },
        },
        subplebbitAddress2: {
          roles: {
            [author.address]: adminRole,
          },
        },
      }
      const accountSubplebbits = utils.getAccountSubplebbits(account, subplebbits)
      const expectedAccountSubplebbits = {
        subplebbitAddress1: {
          role: moderatorRole,
        },
        subplebbitAddress2: {
          role: adminRole,
        },
      }
      expect(accountSubplebbits).toEqual(expectedAccountSubplebbits)
    })

    test('previous account subplebbits, new account subplebbits', async () => {
      const previousAccountSubplebbits = {
        subplebbitAddress1: {
          role: adminRole,
          autoStart: false,
        },
      }
      const account = {author, subplebbits: previousAccountSubplebbits}
      const subplebbits = {
        subplebbitAddress2: {
          roles: {
            [author.address]: adminRole,
          },
        },
      }
      const accountSubplebbits = utils.getAccountSubplebbits(account, subplebbits)
      const expectedAccountSubplebbits = {
        subplebbitAddress1: {
          role: adminRole,
          autoStart: false,
        },
        subplebbitAddress2: {
          role: adminRole,
        },
      }
      expect(accountSubplebbits).toEqual(expectedAccountSubplebbits)
    })

    test('previous account subplebbits, new account subplebbit overwrites previous', async () => {
      const previousAccountSubplebbits = {
        subplebbitAddress1: {
          role: adminRole,
          autoStart: false,
        },
      }
      const account = {author, subplebbits: previousAccountSubplebbits}
      const subplebbits = {
        subplebbitAddress1: {
          roles: {
            [author.address]: moderatorRole,
          },
        },
        subplebbitAddress2: {
          roles: {
            [author.address]: adminRole,
          },
        },
      }
      const accountSubplebbits = utils.getAccountSubplebbits(account, subplebbits)
      const expectedAccountSubplebbits = {
        subplebbitAddress1: {
          role: moderatorRole,
          autoStart: false,
        },
        subplebbitAddress2: {
          role: adminRole,
        },
      }
      expect(accountSubplebbits).toEqual(expectedAccountSubplebbits)
    })
  })
})
