-- enable extension for uuid if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- action_queue
CREATE TABLE IF NOT EXISTS action_queue (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  action_type TEXT NOT NULL,
  params JSONB,
  status TEXT DEFAULT 'queued',
  result JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- clan & clan_member
CREATE TABLE IF NOT EXISTS clan (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  tag TEXT,
  owner_id TEXT,
  treasury BIGINT DEFAULT 0,
  territory INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clan_member (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  clan_id TEXT REFERENCES clan(id) ON DELETE CASCADE,
  user_id TEXT,
  role TEXT DEFAULT 'member'
);

-- sample seed
INSERT INTO clan (id, name, tag, owner_id, treasury)
VALUES (gen_random_uuid(), 'Cartieru', 'CRT', 'dev-owner', 1000)
ON CONFLICT (name) DO NOTHING;

INSERT INTO action_queue (user_id, action_type, params, status)
VALUES ('dev1', 'fura', '{"target":"chiosc"}', 'queued')
ON CONFLICT DO NOTHING;
