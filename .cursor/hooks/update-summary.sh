#!/bin/bash
# Checks for uncommitted or recently committed changes and emits a followup_message
# asking the agent to update SUMMARY.md if src/ or config files were touched.

input=$(cat)

# Collect changed files: staged, unstaged, and untracked (excluding SUMMARY.md itself)
changed=$(git -C "$(dirname "$0")/../.." diff --name-only HEAD 2>/dev/null)
staged=$(git -C "$(dirname "$0")/../.." diff --name-only --cached 2>/dev/null)
untracked=$(git -C "$(dirname "$0")/../.." ls-files --others --exclude-standard 2>/dev/null)

all_changed=$(printf '%s\n%s\n%s\n' "$changed" "$staged" "$untracked" | grep -v '^\s*$' | grep -v '^SUMMARY\.md$' | sort -u)

if [ -z "$all_changed" ]; then
  # Nothing changed — no followup needed
  exit 0
fi

file_list=$(echo "$all_changed" | head -30 | sed 's/^/  - /')

cat <<EOF
{
  "followup_message": "Files were changed in this session:\n$file_list\n\nPlease update SUMMARY.md now to reflect any new features, pages, or structural changes introduced by these edits. Keep the existing sections intact and append or update the relevant parts only. Use today's date where applicable."
}
EOF
