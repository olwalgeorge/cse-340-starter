-- Migration to add GitHub OAuth support
-- Add GitHub ID field to account table for OAuth linking

ALTER TABLE public.account
ADD COLUMN github_id CHARACTER VARYING UNIQUE;

-- Add index for faster GitHub ID lookups
CREATE INDEX idx_account_github_id ON public.account (github_id);

-- Make account_password nullable for GitHub OAuth users
ALTER TABLE public.account
ALTER COLUMN account_password
DROP NOT NULL;

-- Comment the changes
COMMENT ON COLUMN public.account.github_id IS 'GitHub user ID for OAuth authentication';