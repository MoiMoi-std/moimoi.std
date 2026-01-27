-- Fix RLS policies for package_templates table
-- Allow insert/delete operations needed for template-package associations

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow all to insert package_templates" ON package_templates;
DROP POLICY IF EXISTS "Allow all to delete package_templates" ON package_templates;
DROP POLICY IF EXISTS "Allow all to select package_templates" ON package_templates;

-- Create permissive policies for demo/development
CREATE POLICY "Allow all to select package_templates"
  ON package_templates FOR SELECT
  USING (true);

CREATE POLICY "Allow all to insert package_templates"
  ON package_templates FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all to delete package_templates"
  ON package_templates FOR DELETE
  USING (true);

-- Ensure RLS is enabled
ALTER TABLE package_templates ENABLE ROW LEVEL SECURITY;
