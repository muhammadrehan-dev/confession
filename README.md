# 🎓 University Confession Website

A decentralized, anonymous confession platform for universities. No backend, no databases - just GitHub as storage!

## 🌟 Features

- ✅ Anonymous confessions
- ✅ No backend costs (uses GitHub as storage)
- ✅ Infinite scroll
- ✅ Latest confessions on top
- ✅ Fully open source
- ✅ Easy to deploy on Vercel

## 📁 Folder Structure

```
confession/
├── index.html              # Main page
├── css/
│   └── style.css          # All styling
├── js/
│   ├── config.js          # Configuration
│   └── app.js             # Main application logic
├── api/
│   └── confessions.js     # Vercel serverless function (GitHub API)
├── data/
│   └── confessions.json   # All confessions stored here
├── vercel.json            # Vercel configuration
├── .gitignore             # Git ignore file
└── README.md              # This file
```

## 🚀 Setup Instructions

### 1. Repository is Ready!

Your repository: `muhammadrehan-dev/confession`

### 2. Add Files to Your Repository

Create the following structure in your repo:

```
confession/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   └── app.js
├── api/
│   └── confessions.js     ← Important: Serverless function!
├── data/
│   └── confessions.json
├── vercel.json
├── .gitignore
└── README.md
```

### 3. Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → **Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Give it a name: `Confession Site Token`
4. Select scopes:
   - ✅ **repo** (Full control of private repositories)
5. Click **"Generate token"**
6. **COPY THE TOKEN** - you won't see it again!

### 4. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository: `muhammadrehan-dev/confession`
4. **Before deploying**, add Environment Variable:
   - Click **"Environment Variables"**
   - Add: `GITHUB_TOKEN` = `your_token_here`
5. Click **"Deploy"**
6. Done! 🎉

### 5. Your Website is Live!

Vercel will give you a URL like: `https://confession-xxxx.vercel.app`

**All confessions are now stored securely on GitHub!**

## 🔧 How It Works

### Architecture:

```
User Browser
    ↓
Vercel Frontend (HTML/CSS/JS)
    ↓
Vercel Serverless Function (/api/confessions)
    ↓
GitHub API
    ↓
data/confessions.json (in your repo)
```

### Flow:

1. **User submits confession** → Frontend sends to `/api/confessions`
2. **Serverless function** → Securely calls GitHub API with token
3. **GitHub API** → Updates `data/confessions.json` in repo
4. **Git commit created** → Changes are tracked
5. **Website refreshes** → Shows new confession instantly

### Security:

- ✅ GitHub token stays on Vercel server (never exposed to client)
- ✅ All GitHub API calls happen server-side
- ✅ Users never see your token
- ✅ Rate limits handled by Vercel

## 🛡️ Moderation

To remove harmful content:
1. Go to your GitHub repository
2. Edit `data/confessions.json`
3. Remove the offensive confession object
4. Commit the change
5. Website will update automatically

## 📝 Future Improvements

- [ ] Add CAPTCHA for spam prevention
- [ ] Rate limiting (prevent same user from spamming)
- [ ] Report button for users
- [ ] Search functionality
- [ ] Dark mode
- [ ] Reactions/likes on confessions

## 🤝 Contributing

This is an open-source project! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use this for your university!

## ⚠️ Important Notes

- ✅ **GitHub token is secure** - stored only in Vercel environment variables
- ✅ **Never exposed to users** - all API calls happen server-side
- ✅ **Fully decentralized** - all data in your GitHub repo
- ✅ **Free to run** - GitHub + Vercel free tiers
- ✅ **Transparent** - anyone can see all confessions in the repo
- ✅ **Easy moderation** - just edit the JSON file on GitHub

## 🆘 Troubleshooting

**Confessions not loading?**
- Check GitHub token is valid
- Check repository name and owner are correct
- Check `data/confessions.json` exists in repo

**Can't submit confession?**
- Check GitHub token has `repo` permissions
- Check browser console for errors
- Verify file SHA is being tracked correctly

**GitHub API rate limit?**
- GitHub allows 5000 requests/hour for authenticated requests
- Cache confessions in localStorage as backup

---

Made with ❤️ for students who need to share their thoughts anonymously