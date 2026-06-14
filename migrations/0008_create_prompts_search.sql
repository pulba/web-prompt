-- Create virtual table for FTS5
CREATE VIRTUAL TABLE prompts_search USING fts5(
    prompt_id UNINDEXED,
    title,
    content,
    category_name,
    tags_list,
    tokenize='porter unicode61'
);

-- Initial data sync
INSERT INTO prompts_search (prompt_id, title, content, category_name, tags_list)
SELECT 
    p.id, 
    p.title, 
    p.content, 
    COALESCE(c.name, ''), 
    COALESCE((SELECT GROUP_CONCAT(t.name, ' ') FROM tags t JOIN prompt_tags pt ON t.id = pt.tag_id WHERE pt.prompt_id = p.id), '')
FROM prompts p
LEFT JOIN categories c ON p.category_id = c.id;

-- Triggers to keep FTS index in sync
CREATE TRIGGER trg_prompts_search_insert AFTER INSERT ON prompts BEGIN
    INSERT INTO prompts_search (prompt_id, title, content, category_name, tags_list)
    VALUES (
        NEW.id, 
        NEW.title, 
        NEW.content, 
        COALESCE((SELECT name FROM categories WHERE id = NEW.category_id), ''),
        ''
    );
END;

CREATE TRIGGER trg_prompts_search_update AFTER UPDATE ON prompts BEGIN
    UPDATE prompts_search SET
        title = NEW.title,
        content = NEW.content,
        category_name = COALESCE((SELECT name FROM categories WHERE id = NEW.category_id), '')
    WHERE prompt_id = NEW.id;
END;

CREATE TRIGGER trg_prompts_search_delete AFTER DELETE ON prompts BEGIN
    DELETE FROM prompts_search WHERE prompt_id = OLD.id;
END;

-- Triggers for tags sync (simplified: rebuild tags_list on any prompt_tags change)
CREATE TRIGGER trg_prompt_tags_sync AFTER INSERT ON prompt_tags BEGIN
    UPDATE prompts_search SET
        tags_list = COALESCE((SELECT GROUP_CONCAT(t.name, ' ') FROM tags t JOIN prompt_tags pt ON t.id = pt.tag_id WHERE pt.prompt_id = NEW.prompt_id), '')
    WHERE prompt_id = NEW.prompt_id;
END;

CREATE TRIGGER trg_prompt_tags_sync_delete AFTER DELETE ON prompt_tags BEGIN
    UPDATE prompts_search SET
        tags_list = COALESCE((SELECT GROUP_CONCAT(t.name, ' ') FROM tags t JOIN prompt_tags pt ON t.id = pt.tag_id WHERE pt.prompt_id = OLD.prompt_id), '')
    WHERE prompt_id = OLD.prompt_id;
END;
