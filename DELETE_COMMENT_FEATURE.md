# Delete Comment Feature for Admin Users

## Overview
This feature allows admin users to delete comments from any post in the application. The delete button is only visible to users with the 'admin' role.

## Implementation Details

### Backend API
- **Endpoint**: `DELETE /api/comments/:id`
- **Authentication**: Bearer Token required
- **Authorization**: Admin role required
- **Response**: 204 No Content on success

### Frontend Implementation

#### Files Modified:
1. **`src/api/commentService.js`** (New file)
   - Created comment service with delete functionality
   - Handles API calls for comment operations

2. **`src/Pages/Details.jsx`**
   - Added delete comment functionality
   - Added delete button for admin users
   - Integrated with comment service

#### Key Features:
- **Role-based visibility**: Delete button only appears for admin users
- **Confirmation dialog**: Users must confirm before deleting
- **Toast notifications**: Success/error feedback
- **Hover effect**: Delete button appears on hover for better UX
- **Real-time update**: Comments list updates immediately after deletion

#### User Experience:
1. Admin users see a trash icon when hovering over comments
2. Clicking the icon shows a confirmation dialog
3. Upon confirmation, the comment is deleted from the database
4. The comment disappears from the UI immediately
5. A success toast notification is shown

#### Security:
- Frontend checks user role before showing delete button
- Backend validates admin role before allowing deletion
- Proper error handling for unauthorized access

## Usage
1. Log in as an admin user
2. Navigate to any movie/series details page
3. Scroll to the comments section
4. Hover over any comment to see the delete button
5. Click the trash icon to delete the comment

## Technical Notes
- Uses Redux for user state management
- Fallback to localStorage if Redux state is unavailable
- Integrates with existing toast notification system
- Follows existing code patterns and styling
