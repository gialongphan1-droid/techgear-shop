import NodeCache from "node-cache";

const myCache = new NodeCache({
  stdTTL: 60,
  checkperiod: 120,
});

export function flushPublicProductCache() {
  myCache.flushAll();
}

export default myCache;
