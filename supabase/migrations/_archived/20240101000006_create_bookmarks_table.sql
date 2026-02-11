-- Create bookmarks table for storing user saved posts
CREATE TABLE IF NOT EXISTS bookmarks (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, post_id)
);

-- Enable RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own bookmarks"
ON bookmarks
FOR ALL
USING (auth.uid() = user_id);

-- Grants
GRANT ALL ON TABLE bookmarks TO authenticated;
GRANT ALL ON TABLE bookmarks TO service_role;
