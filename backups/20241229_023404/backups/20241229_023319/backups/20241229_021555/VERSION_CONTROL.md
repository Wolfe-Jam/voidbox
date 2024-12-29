# Voidbox Version Control Procedures

## Working Directory
- Primary: `/Users/wolfejam/CascadeProjects/voidbox_backup_2024_01_17_recovered`
- Local Testing: `http://localhost:3002`

## Version Numbering
```
MAJOR.MINOR.PATCH-stage.number
Example: 0.1.0-beta.1 (current)

MAJOR: Breaking changes
MINOR: New features
PATCH: Bug fixes
stage: beta, rc (release candidate), etc.
number: Increment within stage
```

## Save Procedures

### 1. Daily Development
```bash
# Before starting work
npm run stop                    # Stop any running servers
git status                     # Check what files have changed

# After making changes
npm run dev                    # Test locally on 3002
git status                     # Review changes
git add [specific files]       # Stage specific files (NO blind git add .)
git commit -m "type: message"  # Commit with semantic message
```

### 2. Version Updates
```bash
# When ready for version update
1. Update package.json version
2. Update CHANGELOG.md
3. Create git tag
4. Push to GitHub with tags
```

### 3. Backup Procedures
```bash
# Weekly Backups (Every Friday)
1. Stop server: npm run stop
2. Create timestamped backup:
   cp -r voidbox_backup_2024_01_17_recovered voidbox_backup_$(date +%Y_%m_%d)
3. Update RECOVERY_NOTE.md with backup details
```

## Commit Message Format
```
type: description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

Example:
feat: add image download button
fix: correct webhook URL path
```

## Documentation Updates
Every version change must update:
1. CHANGELOG.md - What changed
2. VERSION_CONTROL.md - If procedures changed
3. RECOVERY_NOTE.md - Current state
4. README.md - If user-facing changes

## Local Testing
1. Always develop on port 3002
2. Use `npm run dev` for auto-reload
3. Test all features before commit
4. Document any test cases

## Pre-Deployment Checklist
1. All tests pass
2. Documentation updated
3. Version numbers consistent
4. CHANGELOG.md updated
5. Git tag created
6. Backup created

## Emergency Procedures
If something goes wrong:
1. Stop all servers: `npm run stop`
2. Check RECOVERY_NOTE.md
3. Revert to last known good version:
   `git checkout [last-good-tag]`
4. Create new backup before proceeding
