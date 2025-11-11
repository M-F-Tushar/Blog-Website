# Database Migration Guide: Settings Table

## Overview
This guide explains how to migrate your Supabase database from the legacy `settings` table to the new `site_settings` table structure.

## Problem
The application was querying a non-existent `settings` table, causing 404 errors in the console:
```
❌ GET /rest/v1/settings?select=*&limit=1 → 404
❌ Could not find the table 'public.settings'
```

## Solution
The featured post functionality now uses the `site_settings` table instead of a separate `settings` table.

## Migration Steps

### For Existing Databases

1. **Log in to your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Navigate to the SQL Editor in the left sidebar

3. **Run the Migration Script**
   - Copy the contents of `supabase/add_featured_post_to_site_settings.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

   The script will:
   - Add a `featured_post_id` column to the `site_settings` table
   - Create an index for better query performance
   - Set up a foreign key relationship with the `posts` table

4. **Verify the Migration**
   - In the Table Editor, select `site_settings`
   - You should see the new `featured_post_id` column
   - The featured post functionality will now work correctly

### For New Installations

If you're setting up a new database:
1. Simply run the complete `supabase/schema.sql` file
2. The `site_settings` table will be created with the `featured_post_id` column included

## Code Changes Made

1. **`src/services/supabaseSettingsService.ts`**
   - Changed `SETTINGS_TABLE` constant from `'settings'` to `'site_settings'`
   - All queries now target the correct table

2. **`supabase/schema.sql`**
   - Added `featured_post_id UUID REFERENCES posts(id)` column to `site_settings`
   - Added index for performance optimization

## Expected Behavior After Migration

- ✅ No more 404 errors for the `settings` table
- ✅ Clean browser console
- ✅ Featured post functionality works correctly
- ✅ Profile photo and bio continue to work as before
- ✅ All site settings are stored in a single table

## Rollback (If Needed)

If you need to revert the migration:
```sql
-- Remove the featured_post_id column
ALTER TABLE site_settings DROP COLUMN IF EXISTS featured_post_id;

-- Remove the index
DROP INDEX IF EXISTS idx_site_settings_featured_post;
```

Note: This will remove any featured post selections you've made.

## Support

If you encounter any issues during migration, please check:
1. Your Supabase project has the `posts` table created
2. You have sufficient permissions to alter tables
3. The `site_settings` table exists in your database
