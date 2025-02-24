// Image Utilities for Games

const UNSPLASH_API_KEY = 'YOUR_UNSPLASH_API_KEY'; // Replace with your actual Unsplash API key

const imageUtils = {
    cache: new Map(),

    async fetchRandomImage(query, width = 300, height = 300) {
        const cacheKey = `${query}-${width}-${height}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(
                `https://api.unsplash.com/photos/random?query=${query}&w=${width}&h=${height}`,
                {
                    headers: {
                        'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch image from Unsplash');
            }

            const data = await response.json();
            const imageUrl = data.urls.regular;
            
            this.cache.set(cacheKey, imageUrl);
            return imageUrl;
        } catch (error) {
            console.error('Error fetching image:', error);
            // Return a fallback image URL or placeholder
            return `https://via.placeholder.com/${width}x${height}`;
        }
    },

    async preloadImages(queries, width = 300, height = 300) {
        const promises = queries.map(query => this.fetchRandomImage(query, width, height));
        return Promise.all(promises);
    },

    clearCache() {
        this.cache.clear();
    }
};

// Export the utilities
window.imageUtils = imageUtils;