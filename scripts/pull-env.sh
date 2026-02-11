#!/bin/bash

# Script to pull environment variables from GitHub Actions workflow
# This script triggers the export-env workflow and downloads the .env file

set -e

echo "🚀 Pulling environment variables from GitHub..."

# Trigger the workflow
echo "📤 Triggering GitHub Actions workflow..."
gh workflow run export-env.yml

# Wait for workflow to complete
echo "⏳ Waiting for workflow to complete..."
sleep 5

# Get the latest run ID
RUN_ID=$(gh run list --workflow=export-env.yml --limit 1 --json databaseId --jq '.[0].databaseId')

if [ "$RUN_ID" = "null" ] || [ -z "$RUN_ID" ]; then
    echo "❌ Failed to get workflow run ID"
    exit 1
fi

echo "📥 Waiting for workflow run $RUN_ID to complete..."
gh run watch $RUN_ID

# Download the artifact
echo "📦 Downloading .env file..."
gh run download $RUN_ID -n env-file

# Move .env to project root
if [ -f .env ]; then
    mv .env ../.env
    echo "✅ Successfully pulled .env file to project root!"
else
    echo "❌ Failed to download .env file"
    exit 1
fi
