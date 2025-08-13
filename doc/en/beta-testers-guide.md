# Microfolio Getting Started Guide - Beta Testers Summer 2025

## Welcome!

Welcome to the **microfolio** beta testing program! 🎉

microfolio is a modern static portfolio generator, designed specifically for creatives: designers, architects, photographers, artists, graphic designers, collectives... It allows you to create a professional website to showcase your projects elegantly, without needing deep technical knowledge.

This **first testing phase** focuses on local work (on your computer).

A **second phase** will follow to test publication (build) and online site hosting.

**Thank you** for participating in this testing phase! Your help is precious to improve the tool and make it more accessible to creatives from all backgrounds.

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

## Your Mission as a Beta Tester

As a beta tester, here's your mission:

### ✅ Test the Installation Procedure

- Follow this guide step by step
- Note difficulties encountered
- Verify that all prerequisites are clear

### ✅ Test Local Server Work

- Start the development server
- Navigate the interface
- Test different views (projects, list, map)

### ✅ Add Some Personal Projects

- Create about ten projects with your own creations
- Test adding images, videos and documents
- Verify the display is correct

### ✅ Give Constructive Feedback

Send your feedback to **hello@aker.pro** specifying:

- **Bugs** encountered (with screenshots and details if possible)
- **Feature requests** that would seem useful to you
- **Errors or inaccuracies** in this documentation
- **Interface improvement suggestions**

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

#### Option 2: Manual Installation

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
3. Installation software will open automatically
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

## Essential Basic Commands

### The `cd` (Change Directory) command

Allows you to navigate between folders:

```bash
cd Documents          # Go to Documents folder
cd ..                 # Go up one level
cd /                  # Go to root (Mac/Linux)
cd C:\                # Go to root (Windows)
```

### Git commands

```bash
git clone [url]       # Download a project
git status            # See file status
git add .             # Add all changes
git commit -m "msg"   # Save changes
```

### pnpm commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start development server
pnpm build            # Build site for production
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

### Working Efficiently

- **Real-time changes**: As soon as you modify a file, the browser refreshes automatically
- **Keep terminal open**: Don't close the terminal window while working
- **One server at a time**: You can only have one server running per project

## Adding a New Project

### Step 1: Create the folder

1. Go to the `content/projects/` folder
2. Create a new folder for your project (example: `my-first-project`)
3. The folder name must be lowercase, without spaces or special characters

### Step 2: Copy the basic structure

The easiest way is to copy the `example-project` folder:

```bash
cp -r content/projects/example-project content/projects/my-first-project
```

### Step 3: Modify the index.md file

Open the `content/projects/my-first-project/index.md` file and modify:

```markdown
---
title: 'My project title'
date: '2024-01-15'
location: 'Paris, France'
coordinates: [48.8566, 2.3522] # Optional, for map
description: 'A short description of my project'
type: 'architecture' # or 'design', 'art', 'photography', etc.
tags: ['architecture', 'modern', 'sustainable']
authors:
  - name: 'Your Name'
    role: 'Architect'
featured: true # true to highlight
---

## Description

Here, describe your project in detail...
```

### Step 4: Add your files

- **Thumbnail**: Replace `thumbnail.jpg` with your cover image
- **Images**: Add your images to the `images/` folder
- **Videos**: Add your videos to the `videos/` folder
- **Documents**: Add your PDFs/documents to the `documents/` folder

## File Naming and Preparation Tips

### File Naming

- **No spaces**: `my-image.jpg` ✅ instead of `my image.jpg` ❌
- **Simple characters**: avoid accents, cedillas, special characters
- **Lowercase**: prefer lowercase names
- **Descriptive**: `main-facade.jpg` rather than `IMG_001.jpg`

### Image Preparation

- **Thumbnail**: 800x600 pixels minimum, 4:3 format recommended
- **Gallery images**: 1920px wide maximum
- **Supported formats**: JPG, PNG, WebP, SVG
- **Compression**: Use tools like TinyPNG to reduce size

### Video Preparation

- **Format**: MP4 H.264 for maximum compatibility
- **Size**: Less than 50 MB per video
- **Alternative**: For heavier videos, use YouTube or Vimeo and put the link in the text

### Documents

- **Formats**: PDF, DOC, DOCX, PPT, PPTX
- **Names**: Avoid spaces and special characters
- **Size**: Reasonable for web download

## Introduction to Markdown

Markdown is a simple formatting language you use in your `index.md` files.

### Basic syntax

```markdown
# Main title

## Secondary title

### Tertiary title

**Bold text**
_Italic text_

- Bullet list
- Item 2
- Item 3

1. Numbered list
2. Item 2
3. Item 3

[Link to a site](https://example.com)
![Image](images/my-image.jpg)
```

### Practical examples

```markdown
## Project concept

This project explores the **relationship between space and light** in contemporary architecture.

### Materials used

- Raw concrete
- Thermoformed glass
- Corten steel

### Project stages

1. Site research and analysis
2. Sketching and design
3. Technical development
4. Implementation

![Project overview](images/overview.jpg)

For more details, consult the [technical file](documents/specifications.pdf).
```

### Markdown Tips

- **Line breaks**: Leave a blank line between paragraphs
- **Images**: Place them in the `images/` folder and reference them with `images/image-name.jpg`
- **Links**: Use `[text](url)` for external links
- **Titles**: Use `##` for sections (the main `#` is reserved for the project title)

## Useful Resources

### Recommended Tools

- **Text editor**: VS Code, Sublime Text, or even Notepad++
- **Image compression**: TinyPNG.com, ImageOptim (Mac)
- **Markdown**: Typora, Mark Text for preview
- **Git**: GitHub Desktop for graphical interface

### Useful Links

- **Markdown documentation**: https://www.markdownguide.org/
- **Color palette**: https://coolors.co/
- **Free images**: https://unsplash.com/, https://pixabay.com/
- **Icons**: https://heroicons.com/

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

## Contact and Support

For any questions or problems:

📧 **Email**: hello@aker.pro

In your message, please specify:

- Your operating system (Mac/Windows)
- The problem encountered
- The steps you followed
- A screenshot if possible

---

**Happy testing and thanks for your participation! 🚀**

Adrien for AKER