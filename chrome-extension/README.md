# Job Application Tracker Chrome Extension

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select this extension folder

## Usage

1. Navigate to any job posting (LinkedIn, Indeed, Glassdoor, etc.)
2. Click the Job Tracker extension icon
3. Review the auto-filled information
4. Add any additional notes
5. Click "Save Job Application"

## Features

- Auto-extracts job information from popular job boards
- Works with LinkedIn, Indeed, Glassdoor, and generic job postings
- Saves directly to your Job Application Tracker database
- Requires the backend server to be running on localhost:5000

## Authentication

The extension requires you to be logged into the Job Application Tracker. 
Your authentication token is stored in Chrome's local storage.

## Troubleshooting

- Make sure the backend server is running on localhost:5000
- Ensure you're logged into the Job Application Tracker web app
- Check that the extension has necessary permissions
