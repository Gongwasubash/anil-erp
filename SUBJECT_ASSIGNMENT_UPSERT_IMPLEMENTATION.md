# Subject Assignment Upsert Implementation

## Problem
When managing subject assignments at `http://localhost:3000/#/masters/subject_masters/manage_subject`, if the same combination of school name, class, section, and batch is added, it was creating duplicate entries instead of updating the existing record.

## Solution
Implemented an upsert (insert or update) functionality that:

1. **Checks for existing records** with the same school_id, batch_id, class_id, and section_id combination
2. **Updates existing records** instead of creating duplicates
3. **Creates new records** only when the combination doesn't exist
4. **Provides appropriate user feedback** indicating whether a record was created or updated

## Changes Made

### 1. Database Schema Update (`add-unique-constraint-subject-assignments.sql`)
- Added unique constraint on `subject_assignments` table
- Constraint: `(school_id, batch_id, class_id, section_id)`
- Removes any existing duplicates before applying constraint
- Ensures database-level prevention of duplicates

### 2. Supabase Service Update (`lib/supabase.ts`)
- Added `upsertSubjectAssignment` method
- Uses Supabase's native upsert functionality
- Handles conflicts based on the unique constraint
- Returns updated/inserted record data

### 3. Frontend Logic Update (`pages/Masters.tsx`)
- Modified `handleCreateSubjectAssignment` function
- Uses upsert instead of separate create/update logic
- Provides user feedback for both create and update operations
- Simplified button text to "SAVE" for better UX

## Key Features

### Automatic Duplicate Prevention
```typescript
// The system automatically detects if a record exists for:
// - Same school
// - Same batch
// - Same class  
// - Same section
// And updates it instead of creating a duplicate
```

### User-Friendly Feedback
- Shows "Subject assignment created successfully!" for new records
- Shows "Subject assignment updated successfully!" for existing records
- Clear error messages if something goes wrong

### Database Integrity
- Unique constraint prevents duplicates at database level
- Automatic cleanup of existing duplicates during migration
- Maintains data consistency across the application

## Usage
1. Navigate to Masters → Subject Masters → Manage Subject
2. Select school, batch, class, and section
3. Choose subjects to assign
4. Click "SAVE"
5. System will automatically create new or update existing assignment

## Benefits
- **No more duplicates**: Same combination can only exist once
- **Better UX**: Clear feedback on create vs update operations
- **Data integrity**: Database-level constraints ensure consistency
- **Simplified workflow**: Single "SAVE" button handles both scenarios
- **Performance**: Reduced database queries and storage

## Migration Required
Run the SQL migration file `add-unique-constraint-subject-assignments.sql` to:
1. Remove existing duplicates
2. Add unique constraint
3. Ensure future duplicate prevention

This implementation ensures that subject assignments are properly managed without creating duplicate entries, providing a cleaner and more reliable system.