function findCachedQueryKey(cache, query) {
    for (key of cache.keys()) {
        if (key.startsWith(query) && key.length >= query.length) {
            return key;
        }
    }    
    return null
}

function queryIsStable(query) {
    const queryTokens = query.split(' ')
    return (
        queryTokens.length >= 2 &&
        queryTokens.every(w => w.length > 3)
    )
}

function removeShorterCacheKeys(keyword, cache) {
    for (let key of cache.keys()) {
        if (keyword.startsWith(key) && keyword.length >= key.length) {
            cache.delete(key)
        }
    }
}

module.exports = { findCachedQueryKey, queryIsStable, removeShorterCacheKeys }