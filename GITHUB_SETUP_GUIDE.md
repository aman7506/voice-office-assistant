# Voice Office Assistant - GitHub Setup Guide

## Prerequisites

Before proceeding, ensure you have:
- Git installed on your system
- GitHub account created (https://github.com/aman7506)
- Command line access (PowerShell on Windows)

---

## Step 1: Initialize Git Repository

Navigate to your project directory and initialize Git:

```powershell
cd "e:\Aman Project Files\ChatBot"
git init
```

**Why this step?**
Initializes a new Git repository in your project folder, enabling version control.

---

## Step 2: Configure Git User Information

Set your Git identity (one-time setup):

```powershell
git config --global user.name "Aman Mishra"
git config --global user.email "your-email@example.com"
```

**Why this step?**
Associates your commits with your identity for proper attribution.

---

## Step 3: Verify .gitignore is Working

Check that sensitive files are ignored:

```powershell
git status
```

You should NOT see:
- .env file
- node_modules/ folders
- .expo/ folder
- Any .log files

If you see these files, verify .gitignore is in the root directory.

---

## Step 4: Stage All Files for First Commit

Add all project files to staging area:

```powershell
git add .
```

**Why this step?**
Prepares files for the initial commit. Git tracks changes only for staged files.

---

## Step 5: Create Initial Commit

Create the first commit with a professional message:

```powershell
git commit -m "Initial commit: Voice Office Assistant project setup

- Complete backend server with Express.js and Socket.IO
- React Native mobile application with Expo
- OpenAI GPT integration for AI-powered conversations
- Microsoft SQL Server database integration
- Voice processing capabilities (STT/TTS)
- Calendar integration with Google Calendar API
- Task and reminder management system
- Comprehensive project documentation
- Development and production environment configuration

Project Type: Full Stack Voice-Based Office Productivity Application
Tech Stack: Node.js, Express, React Native, Expo, SQL Server, OpenAI
Author: Aman Mishra"
```

**Why this format?**
- First line: Brief summary (imperative mood)
- Blank line separator
- Detailed description with bullet points
- Context and metadata
- Professional and interview-ready

---

## Step 6: Create GitHub Repository

### Option A: Using GitHub Web Interface (Recommended)

1. Go to https://github.com/aman7506
2. Click "New" or "New repository"
3. Enter repository details:
   - **Repository name**: `voice-office-assistant`
   - **Description**: "Full-stack voice-enabled office productivity assistant with AI integration. Built with React Native, Node.js, Express, and Microsoft SQL Server."
   - **Visibility**: Public (for portfolio) or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have them)
4. Click "Create repository"

### Option B: Using GitHub CLI (if installed)

```powershell
gh repo create voice-office-assistant --public --source=. --description="Full-stack voice-enabled office productivity assistant"
```

---

## Step 7: Connect Local Repository to GitHub

After creating the GitHub repository, connect your local code:

```powershell
git remote add origin https://github.com/aman7506/voice-office-assistant.git
```

Verify the remote connection:

```powershell
git remote -v
```

**Expected output:**
```
origin  https://github.com/aman7506/voice-office-assistant.git (fetch)
origin  https://github.com/aman7506/voice-office-assistant.git (push)
```

**Why this step?**
Links your local repository to the GitHub remote repository for pushing and pulling code.

---

## Step 8: Push Code to GitHub

Push your initial commit to the main branch:

```powershell
git branch -M main
git push -u origin main
```

**Why this step?**
- `git branch -M main`: Renames default branch to 'main' (GitHub standard)
- `git push -u origin main`: Pushes code and sets upstream tracking

**If you encounter authentication issues:**

Use GitHub Personal Access Token:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic) with 'repo' scope
3. Use token as password when prompted

Or use SSH (more secure):
```powershell
git remote set-url origin git@github.com:aman7506/voice-office-assistant.git
```

---

## Step 9: Verify Upload

Visit your repository:
```
https://github.com/aman7506/voice-office-assistant
```

You should see:
- All code files (server/, mobile/, docs/)
- README.md displayed on the homepage
- NO .env file
- NO node_modules/ folders
- All documentation files

---

## Commit Message Standards

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code formatting (no logic change)
- **refactor**: Code restructuring
- **test**: Adding tests
- **chore**: Maintenance tasks

### Examples

**Feature Addition:**
```powershell
git commit -m "feat(voice): implement Google Speech-to-Text integration

- Add Google Cloud Speech API client
- Implement real-time audio streaming
- Add error handling for network failures
- Update voice service with production-ready STT

Closes #23"
```

**Bug Fix:**
```powershell
git commit -m "fix(tasks): resolve task deletion error

- Fix SQL query parameter binding
- Add proper error handling for database operations
- Validate task ID before deletion

Fixes #45"
```

**Documentation:**
```powershell
git commit -m "docs(api): update API documentation with new endpoints

- Add calendar sync endpoints
- Update authentication flow diagrams
- Fix typos in database schema docs"
```

---

## Git Workflow for Future Updates

### Daily Development Workflow

1. **Pull latest changes** (if working in a team):
   ```powershell
   git pull origin main
   ```

2. **Create a feature branch** (recommended):
   ```powershell
   git checkout -b feature/voice-improvements
   ```

3. **Make your changes** and test thoroughly

4. **Stage changes**:
   ```powershell
   git add .
   ```
   Or stage specific files:
   ```powershell
   git add server/routes/tasks.js
   git add mobile/screens/ChatScreen.js
   ```

5. **Commit changes**:
   ```powershell
   git commit -m "feat(tasks): add priority filtering to task list"
   ```

6. **Push to GitHub**:
   ```powershell
   git push origin feature/voice-improvements
   ```

7. **Create Pull Request** on GitHub for code review

8. **Merge to main** after review and testing

### Hotfix Workflow (Production Bugs)

```powershell
git checkout main
git checkout -b hotfix/critical-auth-fix
# Make urgent fix
git add .
git commit -m "fix(auth): resolve JWT token expiration issue"
git push origin hotfix/critical-auth-fix
# Create pull request and merge immediately
```

---

## Folder and File Naming Conventions

### Backend (server/)
- **Files**: camelCase (e.g., `userController.js`, `authMiddleware.js`)
- **Folders**: lowercase (e.g., `routes/`, `services/`, `middleware/`)
- **Configuration**: camelCase or kebab-case (e.g., `database.js`, `app-config.js`)

### Frontend (mobile/)
- **Components**: PascalCase (e.g., `ChatScreen.js`, `TaskItem.js`)
- **Services**: camelCase (e.g., `apiService.js`, `socketService.js`)
- **Folders**: lowercase (e.g., `screens/`, `services/`, `components/`)

### Documentation (docs/)
- **Files**: UPPERCASE with underscores (e.g., `API_DOCUMENTATION.md`, `DEPLOYMENT_GUIDE.md`)
- **Exception**: README.md (standard convention)

### General Rules
- Use descriptive names
- Avoid abbreviations unless standard (API, HTTP, SQL)
- Be consistent within each section of the codebase
- No spaces in file names (use kebab-case or camelCase)

---

## Common Git Commands Reference

```powershell
# Check repository status
git status

# View commit history
git log --oneline --graph --all

# View uncommitted changes
git diff

# Discard changes in a file
git checkout -- filename

# Unstage a file
git reset HEAD filename

# Create and switch to new branch
git checkout -b branch-name

# Switch branches
git checkout main

# Delete local branch
git branch -d branch-name

# View all branches
git branch -a

# Pull latest changes
git pull origin main

# Push current branch
git push origin branch-name

# View remote repositories
git remote -v

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

---

## GitHub Repository Best Practices

### 1. Repository Structure
- Keep root directory clean
- Use folders for organization (server/, mobile/, docs/)
- Include comprehensive README.md

### 2. Branch Protection
- Enable branch protection on 'main'
- Require pull request reviews
- Require status checks to pass

### 3. Issues and Project Management
- Use GitHub Issues for bug tracking
- Create meaningful labels (bug, enhancement, documentation)
- Link commits to issues using keywords (Fixes #N, Closes #N)

### 4. Security
- Never commit .env files
- Use GitHub Secrets for sensitive data in CI/CD
- Enable Dependabot for security alerts
- Add SECURITY.md with vulnerability reporting process

### 5. Documentation
- Keep README.md updated
- Document all breaking changes
- Maintain CHANGELOG.md
- Include code examples in documentation

---

## Troubleshooting Common Issues

### Issue: "fatal: not a git repository"
**Solution:**
```powershell
git init
```

### Issue: "remote origin already exists"
**Solution:**
```powershell
git remote remove origin
git remote add origin https://github.com/aman7506/voice-office-assistant.git
```

### Issue: "rejected - non-fast-forward"
**Solution:**
```powershell
git pull origin main --rebase
git push origin main
```

### Issue: Accidentally committed .env file
**Solution:**
```powershell
git rm --cached .env
git commit -m "Remove .env file from tracking"
git push origin main
```

Then add .env to .gitignore if not already there.

### Issue: Need to change last commit message
**Solution:**
```powershell
git commit --amend -m "New commit message"
git push origin main --force
```

**Warning:** Only use --force on branches you own, never on shared branches.

---

## GitHub Profile Enhancement

### Add a Professional README to Your Profile

Create a repository named `aman7506` (same as your username) and add a README.md:

```markdown
# Hi, I'm Aman Mishra

Full Stack Developer specializing in:
- Voice-enabled applications
- AI integration (OpenAI GPT)
- React Native mobile development
- Node.js backend systems
- SQL Server database design

## Featured Project
- Voice Office Assistant - AI-powered productivity tool

## Tech Stack
JavaScript, TypeScript, Node.js, React Native, Express.js, SQL Server, OpenAI API

## Contact
- GitHub: https://github.com/aman7506
- Email: your.email@example.com
```

---

## Next Steps After GitHub Upload

1. Add repository topics on GitHub (react-native, nodejs, ai, voice-assistant)
2. Enable GitHub Pages for documentation hosting
3. Set up GitHub Actions for CI/CD (automated testing)
4. Add badges to README.md (build status, license, version)
5. Create releases and tags for version milestones

---

**Completed Steps:**
- Git repository initialized
- Files committed with professional message
- Connected to GitHub remote
- Code pushed to GitHub
- Repository visible at https://github.com/aman7506/voice-office-assistant

**Result:** Your code is now version-controlled and backed up on GitHub!
