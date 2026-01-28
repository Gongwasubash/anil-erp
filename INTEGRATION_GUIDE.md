# Integration Guide - New School Setup

## How to integrate the new school setup functionality

### 1. Database Setup

First, run the database fix script:

```sql
-- Add missing school_id columns
ALTER TABLE batches ADD COLUMN IF NOT EXISTS school_id UUID;
ALTER TABLE classes ADD COLUMN IF NOT EXISTS school_id UUID;
ALTER TABLE sections ADD COLUMN IF NOT EXISTS school_id UUID;
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS school_id UUID;
ALTER TABLE departments ADD COLUMN IF NOT EXISTS school_id UUID;
ALTER TABLE designations ADD COLUMN IF NOT EXISTS school_id UUID;
ALTER TABLE manage_section ADD COLUMN IF NOT EXISTS school_id UUID;
```

Then create the setup function:

```sql
-- Run the setup-new-school.sql script
```

### 2. Component Integration

#### Option A: Replace existing Masters component for Super Admin

In your main App.tsx or routing file:

```tsx
import NewSchoolSetup from './pages/NewSchoolSetup';

// In your routing logic
{user.role === 'Super Admin' && !hasSchools && (
  <Route path="/masters" element={<NewSchoolSetup />} />
)}
```

#### Option B: Add as a separate route

```tsx
import NewSchoolSetup from './pages/NewSchoolSetup';

// Add new route
<Route path="/setup-school" element={<NewSchoolSetup />} />
```

#### Option C: Conditional rendering in Masters

Update your Masters component:

```tsx
import NewSchoolSetup from './NewSchoolSetup';

const Masters = ({ user }) => {
  const [hasSchools, setHasSchools] = useState(true);
  
  useEffect(() => {
    checkSchoolExists();
  }, []);
  
  const checkSchoolExists = async () => {
    const { data } = await supabaseService.supabase
      .from('schools')
      .select('id')
      .limit(1);
    setHasSchools(data && data.length > 0);
  };
  
  if (user.role === 'Super Admin' && !hasSchools) {
    return <NewSchoolSetup />;
  }
  
  // Existing Masters component logic
  return (
    // ... existing component
  );
};
```

### 3. Sidebar Integration

The Layout component has been updated to:

- ✅ Listen for `schoolCreated` events
- ✅ Refresh school data automatically
- ✅ Show school logo and name when available
- ✅ Show generic branding when no school exists

### 4. User Flow

1. **Super Admin logs in** → No schools exist
2. **Redirected to NewSchoolSetup** → Fills basic info
3. **School created** → Sidebar updates with school name/logo
4. **Auto-refresh** → Layout shows new school information

### 5. What happens when school is created:

#### Database:
- ✅ School record with login credentials
- ✅ Current batch (2024-2025)
- ✅ Classes 1-5 with sections A, B, C
- ✅ Basic subjects (English, Nepali, Math, Science)
- ✅ Admin and Academic departments

#### UI:
- ✅ Sidebar shows school name and logo
- ✅ Success message with login credentials
- ✅ Option to continue to dashboard

### 6. Customization

You can customize the default data created by modifying the `setup_new_school` function:

```sql
-- Add more classes
INSERT INTO classes (class_name, short_name, school_id)
VALUES 
  ('Class 6', '6', v_school_id),
  ('Class 7', '7', v_school_id),
  -- ... more classes

-- Add more subjects
INSERT INTO subjects (subject_code, subject_name, sort_name, order_no, school_id)
VALUES 
  ('SS', 'Social Studies', 'SS', 5, v_school_id),
  ('ART', 'Art & Craft', 'ART', 6, v_school_id);
  -- ... more subjects
```

### 7. Error Handling

The components handle common errors:

- Missing database columns → Clear error message
- Invalid input → Form validation
- Database connection issues → User-friendly error
- Duplicate school names → Handled by database constraints

### 8. Testing

To test the functionality:

1. Clear existing schools: `DELETE FROM schools;`
2. Login as Super Admin
3. Navigate to Masters or setup route
4. Fill in school information
5. Verify school appears in sidebar
6. Check database for created records

This integration provides a seamless experience for new users to set up their school management system from scratch.