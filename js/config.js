// Configuration for Confession Website
const CONFIG = {
    // Use Vercel serverless functions instead of direct GitHub API
    // This keeps your GitHub token secure on the server
    API_ENDPOINT: '/api/confessions',
    
    // Number of confessions to load per page
    CONFESSIONS_PER_PAGE: 10,
    
    // GitHub repository info (public, no token needed here)
    GITHUB_OWNER: 'muhammadrehan-dev',
    GITHUB_REPO: 'confession'
};

// Make config available globally
window.CONFIG = CONFIG;