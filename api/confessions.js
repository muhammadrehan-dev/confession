// Vercel Serverless Function for Confession API
// This handles all GitHub API calls securely on the server

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = 'muhammadrehan-dev';
const GITHUB_REPO = 'confession';
const CONFESSIONS_FILE = 'data/confessions.json';
const BRANCH = 'main';

// Enable CORS
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).json({});
    }

    // GET - Fetch all confessions
    if (req.method === 'GET') {
        try {
            const confessions = await getConfessions();
            return res.status(200).json({ confessions });
        } catch (error) {
            console.error('Error fetching confessions:', error);
            return res.status(500).json({ 
                error: 'Failed to fetch confessions',
                message: error.message 
            });
        }
    }

    // POST - Add new confession
    if (req.method === 'POST') {
        try {
            const { name, text } = req.body;

            if (!text || text.trim().length === 0) {
                return res.status(400).json({ error: 'Confession text is required' });
            }

            const newConfession = {
                id: Date.now(),
                name: name?.trim() || 'Anonymous',
                text: text.trim(),
                timestamp: new Date().toISOString()
            };

            await addConfession(newConfession);

            return res.status(201).json({ 
                success: true,
                confession: newConfession,
                message: 'Confession added successfully' 
            });
        } catch (error) {
            console.error('Error adding confession:', error);
            return res.status(500).json({ 
                error: 'Failed to add confession',
                message: error.message 
            });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

// Fetch confessions from GitHub
async function getConfessions() {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONFESSIONS_FILE}?ref=${BRANCH}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Confession-Website'
        }
    });

    if (response.status === 404) {
        // File doesn't exist yet
        return [];
    }

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Decode base64 content
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    const confessions = JSON.parse(content);

    return confessions;
}

// Add confession to GitHub
async function addConfession(newConfession) {
    // First, get current confessions and file SHA
    let currentConfessions = [];
    let fileSha = null;

    try {
        const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONFESSIONS_FILE}?ref=${BRANCH}`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Confession-Website'
            }
        });

        if (response.ok) {
            const data = await response.json();
            fileSha = data.sha;
            const content = Buffer.from(data.content, 'base64').toString('utf-8');
            currentConfessions = JSON.parse(content);
        }
    } catch (error) {
        console.log('File might not exist yet, creating new one');
    }

    // Add new confession to the beginning
    currentConfessions.unshift(newConfession);

    // Convert to base64
    const content = JSON.stringify(currentConfessions, null, 2);
    const encodedContent = Buffer.from(content).toString('base64');

    // Update file on GitHub
    const updateUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONFESSIONS_FILE}`;
    
    const payload = {
        message: `Add confession from ${newConfession.name}`,
        content: encodedContent,
        branch: BRANCH
    };

    if (fileSha) {
        payload.sha = fileSha;
    }

    const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Confession-Website'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update GitHub');
    }

    return true;
}