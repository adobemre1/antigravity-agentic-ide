# Admin Dashboard Guide

This guide explains how to use the Admin Dashboard to manage projects in the Proje Portalı.

## Accessing the Dashboard
1. Log in to the application using Google Sign-In.
2. Ensure your email account is authorized as an admin (Default: emails ending in `@gmail.com`).
3. Click the "Manage in Dashboard" button on a Project Detail page OR navigate directly to `/admin`.

## Features

### 1. Project List
- View all existing projects in a sortable list.
- See project titles and tags/categories at a glance.

### 2. Create New Project
1. Click the **+ New Project** button at the top right.
2. Fill in the required fields:
   - **Title**: The name of the project.
   - **Description**: A short summary of the project.
   - **Image URL**: Link to a project image (can be internal or external).
   - **Categories**: Comma-separated tags (e.g., "Web, AI, Mobile").
3. Click **Save Project**.

### 3. Edit Project
1. Find the project in the list.
2. Click the **Edit** button.
3. Modify the fields as needed.
4. Click **Save Project**.

### 4. Delete Project
1. Find the project you wish to remove.
2. Click the **Delete** button.
3. Confirm the action in the browser popup.
**Warning**: This action is permanent and cannot be undone.

## Troubleshooting
- **"Failed to load projects"**: Check if you are logged in and have internet connectivity.
- **Permission Denied**: Verify your email is in the allowed admin list (check `src/store.ts` logic).
