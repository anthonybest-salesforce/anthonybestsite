-- anthonybestsite chief-of-staff admin portal — D1 schema
-- Ported pattern from sccgc-site's worker/schema.sql (Worker + D1 + Access harness).
-- Every "product" table below follows the same shape: TEXT id (uuid), status/lifecycle
-- column, created_at/updated_at TEXT (ISO 8601), booleans stored as INTEGER 0/1.

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'open',        -- open | in_progress | done
  priority TEXT NOT NULL DEFAULT 'medium',    -- low | medium | high
  area TEXT,                                   -- freeform tag: music, golf, business, home...
  due_date TEXT,                                -- ISO date, nullable
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  starts_at TEXT NOT NULL,                      -- ISO datetime
  ends_at TEXT,
  location TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed',     -- confirmed | tentative | cancelled
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  title TEXT,
  body TEXT NOT NULL,
  tags TEXT,                                     -- comma-separated
  pinned INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  relationship TEXT,                             -- friend | family | business | collaborator...
  email TEXT,
  phone TEXT,
  company TEXT,
  notes TEXT,
  last_contacted_at TEXT,
  follow_up_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS research_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,                              -- maps to /projects/<slug>
  summary TEXT,
  status TEXT NOT NULL DEFAULT 'draft',          -- draft | published | archived
  deck_url TEXT,                                  -- path to the HTML deck, e.g. /projects/putter-advisory
  doc_url TEXT,                                   -- path to companion research doc
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS gear_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'guitar',       -- guitar | amp | pedal | accessory
  brand TEXT,
  model TEXT,
  serial_number TEXT,
  acquired_date TEXT,
  purchase_price REAL,
  current_value REAL,
  condition TEXT,
  notes TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'owned',          -- owned | sold | wishlist
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS content_items (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,                         -- youtube | instagram | linkedin | tiktok
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'video',             -- video | short | post | story
  status TEXT NOT NULL DEFAULT 'idea',            -- idea | scripting | filming | editing | scheduled | published
  scheduled_at TEXT,
  published_at TEXT,
  url TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
