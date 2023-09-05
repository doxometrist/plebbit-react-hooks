import localForageLru from './localforage-lru'

try {
  // for debugging without caching
  if (process.env.REACT_APP_PLEBBIT_REACT_HOOKS_NO_CACHE) {
    localForageLru.createInstance = <T>() => {
      console.warn('@plebbit/plebbit-react-hooks cache is disabled for testing')
      return {
        getItem: async function (key: string) {},
        setItem: async function (key: string, value: T) {},
        removeItem: async function (key: string) {},
        clear: async function () {},
        keys: async function () {
          return []
        },
      }
    }
  }
} catch (e) {}

export default localForageLru
