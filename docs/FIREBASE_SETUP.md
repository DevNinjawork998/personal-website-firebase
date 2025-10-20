# Firebase Setup Documentation

This document describes the Firebase integration for the personal website project.

## Overview

The project has been migrated from hardcoded project data to a dynamic Firebase Firestore database. This allows for easy management of project information through the Firebase Console.

## Files Created/Modified

### Configuration Files

- `src/config/firebase.ts` - Firebase configuration and initialization
- `firebase/firestore.rules` - Firestore security rules
- `firebase/firestore.indexes.json` - Firestore database indexes
- `firebase.json` - Updated to include Firestore configuration

### Services

- `src/services/projectsService.ts` - Service for fetching projects from Firestore
- `src/hooks/useProjects.ts` - React hook for managing projects state

### Components

- `src/components/ProjectsSection.tsx` - Updated to use Firebase data instead of hardcoded array

## Database Structure

### Projects Collection

Each project document contains:

- `id` (string) - Auto-generated document ID
- `title` (string) - Project title
- `description` (string) - Project description
- `imageSrc` (string) - Image filename (e.g., "photo1.jpg")
- `url` (string) - Project URL
- `tech` (array) - Array of technology strings
- `order` (number) - Display order (ascending)
- `createdAt` (timestamp) - Creation date
- `updatedAt` (timestamp) - Last update date

## Security Rules

The Firestore rules allow:

- **Read access**: Public read access to the projects collection
- **Write access**: Restricted to admin/console only

## Image Handling

Images are handled through a mapping system in `ProjectsSection.tsx`:

- Images are imported at the top level for better performance
- A mapping function converts database image names to actual image imports
- Fallback UI is provided for missing images

## Usage

### Adding New Projects

1. Go to [Firebase Console](https://console.firebase.google.com/project/personal-website-3580d/firestore)
2. Navigate to Firestore Database
3. Click on the "projects" collection
4. Add a new document with the required fields

### Updating Existing Projects

1. Open the project document in Firebase Console
2. Modify the desired fields
3. Changes will automatically reflect on the website

## Development

The project uses Firebase v12.2.1 with the following features:

- Firestore for data storage
- Analytics for usage tracking
- Hosting for deployment

## Troubleshooting

### Images Not Loading

- Check that image files exist in `src/images/`
- Verify image names match exactly in the database
- Check browser console for error messages

### Data Not Loading

- Verify Firebase configuration is correct
- Check Firestore security rules
- Ensure network connectivity
- Check browser console for error messages
