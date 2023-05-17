async function getStats(subreddits) {
    const results = new Map()
    for (let subreddit of subreddits) {
        try {
            const response = await fetch(`https://www.reddit.com/r/${subreddit}/about.json`)
            const data = await response.json()
            results.set(subreddit, data.data.subscribers)
        } catch (error) {
            console.log(error)
        }
    }

    return new Map(Array.from(results.entries()).sort((a, b) => b[1] - a[1]))
}

