import NodeCache from "node-cache";

const myCache = new NodeCache({
  stdTTL: 5,
  checkperiod: 120,
});

export function flushPublicProductCache() {
  myCache.flushAll();
}

export default myCache;
