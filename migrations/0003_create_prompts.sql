CREATE TABLE prompts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  source TEXT,
  favorite INTEGER DEFAULT 0 CHECK (favorite IN (0, 1)),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prompts_category_id ON prompts(category_id);
CREATE INDEX idx_prompts_favorite ON prompts(favorite);
CREATE INDEX idx_prompts_title ON prompts(title);
