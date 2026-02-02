# Let the Agent Push to GitHub

The Agent runs in a sandbox and **cannot use your Windows login** (Credential Manager). You can either let the Agent use Windows credentials (try Cursor settings) or use a **PAT in the remote URL** (always works).

---

## Option A: Let the Agent use Windows credentials (try first)

This makes Git run **outside the sandbox** so it can use your stored Windows credentials. You must have credentials stored first (e.g. push once from your terminal and sign in).

### 1. Add `git` to the Command Allowlist

1. Open **Cursor** → **Settings** (Ctrl+,).
2. Go to **Cursor Settings** → **Agents** → **Auto-Run** (or search for “Command Allowlist”).
3. Under **Command Allowlist**, add: **`git`**.
4. Ensure **Auto-Run Network Access** is **on** (so `git push` can reach GitHub).

Commands on the allowlist run without sandbox restrictions, so `git push` may then have access to Windows Credential Manager.

### 2. Put your GitHub login back in Windows

In **your** terminal (Git Bash or PowerShell):

```bash
cd "c:\Users\Al Hafiz Enterprises\Desktop\Portfolio"
git push origin main
```

Sign in when Windows/Git asks (browser or credential dialog). After that, Credential Manager has your GitHub login.

### 3. Try the Agent again

Ask the Agent to push. If it still fails with `SEC_E_NO_CREDENTIALS`, the Agent process on Windows may not get Credential Manager access—then use **Option B** (PAT in URL).

---

## Option B: PAT in the remote URL (always works)

No Windows credentials needed. Git uses the token from the remote URL.

### 1. Create a GitHub Personal Access Token (PAT)

1. Open: **https://github.com/settings/tokens**
2. Click **“Generate new token”** → **“Generate new token (classic)”**
3. Name it (e.g. `Cursor Agent Push`).
4. Choose an expiration (e.g. 90 days or “No expiration”).
5. Enable scope: **`repo`** (full control of private repositories).
6. Click **“Generate token”** and **copy the token** (starts with `ghp_`). You won’t see it again.

### 2. Set the remote URL to use the token

In **Git Bash** (or any terminal) in your project folder, run **once** (replace `YOUR_PAT` with your token):

```bash
cd "c:\Users\Al Hafiz Enterprises\Desktop\Portfolio"
git remote set-url origin https://Asad1024:YOUR_PAT@github.com/Asad1024/Full-Stack-Portfolio.git
```

Example (fake token):

```bash
git remote set-url origin https://Asad1024:ghp_xxxxxxxxxxxxxxxxxxxx@github.com/Asad1024/Full-Stack-Portfolio.git
```

### 3. Confirm

```bash
git remote -v
```

You should see `origin` with a URL that contains `https://Asad1024:ghp_...@github.com/...`.  
Do **not** commit or push `.git/config`—it stays only on your machine.

---

## After this

- When you run **“push”** from your side, you can keep using your normal login (e.g. Credential Manager) if you prefer; just run the `set-url` command above once so the **default** remote uses the PAT.
- When the **Agent** runs `git push origin main`, Git will use the URL from `.git/config`, which includes the PAT, so the Agent will be able to push without your interactive credentials.

---

## Security

- The token is stored **only** in your local `.git/config` (not in the repo, not on GitHub).
- Use a token with **minimal scope** (`repo` only if you need push).
- If the token leaks or you want to revoke it: GitHub → Settings → Developer settings → Personal access tokens → revoke, then create a new token and run the `git remote set-url` command again.
