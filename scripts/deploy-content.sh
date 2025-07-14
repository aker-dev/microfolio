#!/bin/bash

# Deploy Content Script
# This script copies content from the local content directory to a temporary branch for deployment

set -e

echo "🚀 Deploying content for GitHub Pages..."

# Create a temporary branch for content
TEMP_BRANCH="content-deploy-$(date +%s)"
echo "Creating temporary branch: $TEMP_BRANCH"

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

# Create and switch to temporary branch
git checkout -b "$TEMP_BRANCH"

# Remove content/projects from .gitignore temporarily
sed -i.bak '/content\/projects/d' .gitignore

# Add all content files
echo "Adding content files..."
git add content/

# Commit content
git commit -m "temp: add content for deployment

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push temporary branch
echo "Pushing temporary branch..."
git push origin "$TEMP_BRANCH"

# Switch back to original branch
git checkout "$CURRENT_BRANCH"

# Restore .gitignore
mv .gitignore.bak .gitignore

echo "✅ Content deployed to branch: $TEMP_BRANCH"
echo "Now update the GitHub Actions workflow to use this branch for content."
echo "After deployment, you can delete the temporary branch with:"
echo "git branch -D $TEMP_BRANCH && git push origin --delete $TEMP_BRANCH"