-- Add is_active column to packages table
ALTER TABLE packages ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true NOT NULL;

-- Create index for faster filtering by active status
CREATE INDEX IF NOT EXISTS idx_packages_is_active ON packages(is_active);

-- Set all existing packages to active
UPDATE packages SET is_active = true WHERE is_active IS NULL;
