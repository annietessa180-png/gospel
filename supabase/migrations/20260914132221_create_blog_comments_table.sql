/*
# Create blog_comments table

1. New Tables
- `blog_comments`
  - `id` (uuid, primary key)
  - `post_id` (uuid, foreign key to blog_posts.id, ON DELETE CASCADE)
  - `author_name` (text, not null)
  - `author_email` (text, not null)
  - `content` (text, not null)
  - `parent_id` (uuid, nullable, self-reference for threaded replies)
  - `status` (text, default 'pending' — values: pending, approved, rejected, deleted)
  - `admin_note` (text, nullable)
  - `moderated_at` (timestamptz, nullable)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `blog_comments`.
- Public (anon) can INSERT new comments (status defaults to 'pending').
- Public (anon) can SELECT only approved comments.
- Authenticated (admin) can SELECT all non-deleted comments, UPDATE status/note, and soft-delete.
- Indexes on post_id and status for performance.

3. Notes
- Comments are moderated: new comments default to 'pending' and only appear publicly after admin approval.
- Soft-delete: setting status to 'deleted' hides the comment without removing the row.
*/

CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_email text NOT NULL,
  content text NOT NULL,
  parent_id uuid REFERENCES blog_comments(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'deleted')),
  admin_note text,
  moderated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments (post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments (status);

ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Public can read only approved comments
DROP POLICY IF EXISTS "anon_select_approved_comments" ON blog_comments;
CREATE POLICY "anon_select_approved_comments"
  ON blog_comments FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Authenticated (admin) can read all non-deleted comments
DROP POLICY IF EXISTS "admin_select_all_comments" ON blog_comments;
CREATE POLICY "admin_select_all_comments"
  ON blog_comments FOR SELECT
  TO authenticated
  USING (status != 'deleted');

-- Public can insert new comments (pending status enforced by default)
DROP POLICY IF EXISTS "anon_insert_comments" ON blog_comments;
CREATE POLICY "anon_insert_comments"
  ON blog_comments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated (admin) can update comments (moderation)
DROP POLICY IF EXISTS "admin_update_comments" ON blog_comments;
CREATE POLICY "admin_update_comments"
  ON blog_comments FOR UPDATE
  TO authenticated
  USING (status != 'deleted')
  WITH CHECK (status != 'deleted');

-- Only authenticated (admin) can delete comments
DROP POLICY IF EXISTS "admin_delete_comments" ON blog_comments;
CREATE POLICY "admin_delete_comments"
  ON blog_comments FOR DELETE
  TO authenticated
  USING (true);
