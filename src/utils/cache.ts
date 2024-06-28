const cache = new Map<string, any>();

export const getCacheEntry = <T>(key: string): T | undefined => {
	return cache.get(key);
}

export const setCacheEntry = (key: string, data: any): void => {
	cache.set(key, data);
}
