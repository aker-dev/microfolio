# Microfolio Installation Guide

## About

microfolio is a modern static portfolio generator, designed specifically for creatives: designers, architects, photographers, artists, graphic designers, collectives... It allows you to create a professional website to showcase your projects elegantly, without needing deep technical knowledge.

## Important note about the terminal / command line

**Don't worry!** This guide uses the terminal (or "command line"), but **no technical knowledge is required**. You'll simply need to type or copy-paste a few simple commands. It's easier than it looks! 😊

### How to open the terminal

**On Mac:**
- Press `Cmd + Space` to open Spotlight
- Type "Terminal" and press Enter
- Or go to Applications > Utilities > Terminal

**On Windows:**
- Press `Windows + R`
- Type "powershell" and press Enter
- Or search for "PowerShell" in the Start menu

## Installing Prerequisites

### For Mac

#### Option 1: Installation via Homebrew (Recommended)

**Homebrew** is a package manager for macOS that greatly simplifies the installation of development software.

1. **Install Homebrew** (if you don't have it already):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install microfolio via Homebrew**:
   ```bash
   brew install aker-dev/tap/microfolio
   ```

3. **Create a new portfolio**:
   ```bash
   microfolio new my-portfolio
   cd my-portfolio
   ```

4. **Start the development server**:
   ```bash
   microfolio dev
   ```

Your site will be accessible at: http://localhost:5173

**Advantages of this method:**
- Automatic installation of all dependencies (Node.js, pnpm, Git)
- Simplified commands: `microfolio new`, `microfolio dev`, `microfolio build`
- Easy updates with `brew upgrade microfolio`

#### Option 2: Manual installation

If you prefer manual installation or encounter problems with Homebrew:

#### 1. Install Node.js

1. Go to https://nodejs.org/
2. Download the LTS version (recommended)
3. Open the downloaded `.pkg` file and follow the wizard
4. **Close and restart Terminal** for the installation to take effect
5. Verify the installation by typing:
   ```bash
   node --version
   ```
   You should see a version number (e.g., v20.11.0)

#### 2. Install Git

1. Open Terminal
2. Type the following command:
   ```bash
   xcode-select --install
   ```
3. An installation software will open automatically
4. Follow the on-screen instructions to install Xcode development tools
5. **Close and restart Terminal** for the installation to take effect
6. Verify the installation once completed:
   ```bash
   git --version
   ```

#### 3. Install pnpm

1. Open Terminal
2. Type the following command:
   ```bash
   curl -fsSL https://get.pnpm.io/install.sh | sh
   ```
3. **Close and restart Terminal** for the installation to take effect (or type `source ~/.zshrc` in the current terminal)
4. Verify the installation:
   ```bash
   pnpm --version
   ```

### For Windows

#### 1. Install Node.js

1. Go to https://nodejs.org/
2. Download the LTS version (recommended)
3. Open the downloaded `.msi` file and follow the wizard
4. **Close and restart PowerShell** for the installation to take effect
5. Verify the installation by typing:
   ```bash
   node --version
   ```

#### 2. Install Git

1. Download Git from https://git-scm.com/download/win
2. Open the `.exe` file and follow the wizard
3. Leave the default options
4. **Close and restart PowerShell** for the installation to take effect
5. Verify the installation:
   ```bash
   git --version
   ```

#### 3. Install pnpm

1. Open PowerShell as administrator
2. Type:
   ```bash
   Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
   ```
3. **Close and restart PowerShell** for the installation to take effect
4. Verify the installation:
   ```bash
   pnpm --version
   ```

## Choosing Your Working Directory

### On Mac

1. Open Terminal
2. Navigate to your Documents folder:
   ```bash
   cd ~/Documents
   ```
3. Or create a dedicated folder:
   ```bash
   mkdir ~/Documents/Web-Projects
   cd ~/Documents/Web-Projects
   ```

### On Windows

1. Open PowerShell
2. Navigate to your Documents:
   ```bash
   cd %USERPROFILE%\Documents
   ```
3. Or create a dedicated folder:
   ```bash
   mkdir %USERPROFILE%\Documents\Web-Projects
   cd %USERPROFILE%\Documents\Web-Projects
   ```

## Downloading microfolio

### If you installed via Homebrew

Use the `microfolio` command directly:

```bash
microfolio new my-portfolio
cd my-portfolio
microfolio dev
```

### If you did the manual installation

Once in your working directory:

```bash
git clone https://github.com/aker-dev/microfolio.git my-portfolio
cd my-portfolio
pnpm install
```

**Explanation:**
- `git clone` downloads the project
- `my-portfolio` is the name of the created folder (you can change it)
- `cd my-portfolio` enters the folder
- `pnpm install` installs all necessary dependencies

## Working on Your Site

### Starting the development server

#### If you installed via Homebrew

Every time you want to work on your site:

1. **Open a terminal**
2. **Navigate to your portfolio folder**:
   ```bash
   cd path/to/my-portfolio
   ```
3. **Start the server**:
   ```bash
   microfolio dev
   ```
4. **Open your browser** and go to http://localhost:5173

#### If you did the manual installation

Every time you want to work on your site:

1. **Open a terminal** (Terminal on Mac, PowerShell on Windows)
2. **Navigate to your microfolio folder**:
   ```bash
   cd path/to/my-portfolio
   ```
3. **Start the server**:
   ```bash
   pnpm dev
   ```
4. **Open your browser** and go to http://localhost:5173

The server remains active as long as the terminal window stays open. To stop it, press `Ctrl+C` in the terminal.

## Common Problems and Solutions

### "Command not found" or "is not recognized"

- Verify that Node.js, Git and pnpm are properly installed
- Restart your terminal
- On Windows, use PowerShell as administrator

### Images not displaying

- Verify that `thumbnail.jpg` exists
- Avoid spaces in file names
- Use supported formats (JPG, PNG, WebP)

### Server won't start

- Verify you're in the right folder (`cd my-portfolio`)
- Verify that `pnpm install` was properly executed
- Close and reopen the terminal

### Changes not visible

- Save your files
- Verify the server is still running
- Refresh the page (F5 or Ctrl+R)

## Next Steps

Now that Microfolio is installed, check out:
- [Configuration guide](02-configuration.md) to customize your site
- [Project addition guide](03-adding-projects.md) to add your own creations
- [Publication guide](04-publication.md) to put your site online

## Contact and Support

For any questions or problems:

📧 **Email**: hello@aker.pro

In your message, please specify:
- Your operating system (Mac/Windows)
- The problem encountered
- The steps you followed
- A screenshot if possible