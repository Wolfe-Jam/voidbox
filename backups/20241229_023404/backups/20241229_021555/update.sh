#!/bin/bash

# Function to validate version number
validate_version() {
    if [[ ! $1 =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo "❌ Invalid version format. Must be in format v1.1.1"
        return 1
    fi
    return 0
}

# Function to update changelog
update_changelog() {
    local version=$1
    local message=$2
    local date=$(date '+%Y-%m-%d')
    local temp_file=$(mktemp)
    
    # Read existing changelog
    if [ -f CHANGELOG.md ]; then
        cat CHANGELOG.md > "$temp_file"
    else
        echo "# Changelog" > "$temp_file"
        echo "" >> "$temp_file"
        echo "All notable changes to the Voidbox project will be documented in this file." >> "$temp_file"
        echo "" >> "$temp_file"
    fi
    
    # Create new entry
    echo -e "\n## [$version] - $date\n" > CHANGELOG.md
    echo "### Changes" >> CHANGELOG.md
    echo "- ${message#*: }" >> CHANGELOG.md
    echo "" >> CHANGELOG.md
    
    # Append existing content
    cat "$temp_file" >> CHANGELOG.md
    rm "$temp_file"
    
    echo "📝 Updated CHANGELOG.md"
}

# Function to create backup
create_backup() {
    local backup_dir="backups/$(date '+%Y%m%d_%H%M%S')"
    mkdir -p "$backup_dir"
    
    echo "💾 Creating backup in $backup_dir..."
    
    # Copy all tracked files
    git ls-files | while read file; do
        if [ -f "$file" ]; then
            dir=$(dirname "$backup_dir/$file")
            mkdir -p "$dir"
            cp "$file" "$backup_dir/$file"
        fi
    done
    
    echo "✅ Backup complete"
}

# Extract version if present in commit message
version=""
if [[ $1 =~ ^v[0-9]+\.[0-9]+\.[0-9]+: ]]; then
    version=${1%%:*}
    if ! validate_version "$version"; then
        exit 1
    fi
fi

# Get the commit message
if [ -z "$1" ]; then
    COMMIT_MSG="Update $(date '+%Y-%m-%d %H:%M:%S')"
else
    COMMIT_MSG="$1"
fi

echo "🔄 Starting local update process..."

# Create backup
create_backup

# Stage all changes
echo "📦 Staging changes..."
git add .

# Show what's being committed
echo "📋 Changes to be committed:"
git status --short

# Confirm with user
read -p "❓ Proceed with commit? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Update cancelled"
    exit 1
fi

# Update changelog if version is present
if [ ! -z "$version" ]; then
    update_changelog "$version" "$COMMIT_MSG"
    git add CHANGELOG.md
fi

# Commit changes
echo "💾 Committing changes with message: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# Push to local repository
echo "⬆️  Pushing to local repository..."
git push origin main

echo "✅ Update complete!"
