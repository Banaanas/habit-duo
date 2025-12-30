-- Automatically link auth.users to users table when a new auth user is created
-- This eliminates the manual step of updating auth_user_id

-- Create function to handle new auth users
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger AS $$
BEGIN
  -- Automatically link auth account to app user if email matches
  UPDATE public.users
  SET auth_user_id = NEW.id
  WHERE email = NEW.email
    AND auth_user_id IS NULL; -- Only update if not already linked

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires when new auth user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- Note: This trigger automatically links auth accounts to app users
-- when they first sign in with magic link, based on matching email addresses
