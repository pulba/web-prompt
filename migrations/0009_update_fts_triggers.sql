-- Trigger for category name change
CREATE TRIGGER trg_categories_update_fts AFTER UPDATE ON categories BEGIN
    UPDATE prompts_search SET
        category_name = NEW.name
    WHERE prompt_id IN (SELECT id FROM prompts WHERE category_id = NEW.id);
END;

-- Trigger for tag name change
CREATE TRIGGER trg_tags_update_fts AFTER UPDATE ON tags BEGIN
    UPDATE prompts_search SET
        tags_list = (
            SELECT GROUP_CONCAT(t.name, ' ') 
            FROM tags t 
            JOIN prompt_tags pt ON t.id = pt.tag_id 
            WHERE pt.prompt_id = prompts_search.prompt_id
        )
    WHERE prompt_id IN (SELECT prompt_id FROM prompt_tags WHERE tag_id = NEW.id);
END;
