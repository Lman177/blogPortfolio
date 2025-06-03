// --- FAKE DATA GENERATION ---

const fakeAuthors = [
    {
        personal_info: {
            username: 'techguru101',
            fullname: 'Alice Wonderland',
            profile_img: 'https://i.pravatar.cc/150?u=techguru101'
        }
    },
    {
        personal_info: {
            username: 'animefan_22',
            fullname: 'Bob The Otaku',
            profile_img: 'https://i.pravatar.cc/150?u=animefan_22'
        }
    },
    {
        personal_info: {
            username: 'foodiequeen',
            fullname: 'Charlie Chef',
            profile_img: 'https://i.pravatar.cc/150?u=foodiequeen'
        }
    },
    {
        personal_info: {
            username: 'travelbug',
            fullname: 'Diana Explorer',
            profile_img: 'https://i.pravatar.cc/150?u=travelbug'
        }
    },
    {
        personal_info: {
            username: 'financewiz',
            fullname: 'Edward Moneybags',
            profile_img: 'https://i.pravatar.cc/150?u=financewiz'
        }
    }
];

const allPossibleTags = ["programming", "anime", "finance", "Travel", "Social media", "Cooking", "Tech", "Bollywood", "React", "Nodejs", "AI", "SciFi", "Investment", "WorldTour", "Lifestyle", "Recipes", "Gadgets", "Movies"];

const generateFakeBlog = (id, customData = {}) => {
    const randomAuthor = fakeAuthors[Math.floor(Math.random() * fakeAuthors.length)];
    const numTags = Math.floor(Math.random() * 3) + 1; // 1 to 3 tags
    const tags = [];
    const usedTags = new Set();

    // Ensure categoryFilter is included if provided
    if (customData.categoryFilter && allPossibleTags.includes(customData.categoryFilter)) {
        tags.push(customData.categoryFilter);
        usedTags.add(customData.categoryFilter);
    }

    while (tags.length < numTags) {
        const randomTag = allPossibleTags[Math.floor(Math.random() * allPossibleTags.length)];
        if (!usedTags.has(randomTag)) {
            tags.push(randomTag);
            usedTags.add(randomTag);
        }
        if (usedTags.size === allPossibleTags.length) break; // Avoid infinite loop if numTags > allPossibleTags
    }

    return {
        blog_id: `fake-blog-${id}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
        title: `Exploring ${tags[0]}: A Deep Dive (Blog ${id})`,
        banner: `https://picsum.photos/seed/${id}_banner/800/300?random=${Math.random()}`, // Add random to try and avoid caching for different blogs
        des: `This is a compelling short description for fake blog ${id}. It delves into the fascinating world of ${tags.join(', ')}. Join us as we uncover secrets and share insights. Perfect for enthusiasts and beginners alike.`,
        content: [{ type: "paragraph", data: { text: `Full content of blog ${id} goes here. It would be much longer and formatted with Editor.js blocks.` } }],
        tags: [...new Set(tags)],
        author: randomAuthor,
        publishedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(), // Random date within the last 30 days
        activity: {
            total_reads: Math.floor(Math.random() * 5000) + 200,
            total_likes: Math.floor(Math.random() * 1000) + 50,
            ...customData.activity // Allow overriding activity
        },
        ...customData
    };
};

// --- ALL BLOGS POOL (for filtering by category) ---
export const allFakeBlogsPool = [];
const initialCategoriesForPool = ["programming", "anime", "finance", "Travel", "Social media", "Cooking", "Tech", "Bollywood"];
initialCategoriesForPool.forEach(category => {
    for (let i = 1; i <= 3; i++) { // 3 blogs per initial category
        allFakeBlogsPool.push(generateFakeBlog(`${category.substring(0,3)}${i}`, { categoryFilter: category }));
    }
});
// Add some more generic blogs
for (let i = 1; i <= 5; i++) {
    allFakeBlogsPool.push(generateFakeBlog(`gen${i}`));
}


// --- TRENDING BLOGS ---
export const fakeTrendingBlogsData = [];
for (let i = 1; i <= 5; i++) {
    const trendingBlog = generateFakeBlog(200 + i, {
        activity: {
            total_reads: Math.floor(Math.random() * 10000) + 7000, // Higher reads
            total_likes: Math.floor(Math.random() * 2000) + 800   // Higher likes
        }
    });
    fakeTrendingBlogsData.push(trendingBlog);
}
fakeTrendingBlogsData.sort((a, b) => b.activity.total_reads - a.activity.total_reads);


// --- LATEST BLOGS (can be a subset of allFakeBlogsPool or newly generated) ---
// For simplicity, let's take the first few from the pool and sort by date
export const fakeLatestBlogsData = [...allFakeBlogsPool]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 10); // Take 10 latest

