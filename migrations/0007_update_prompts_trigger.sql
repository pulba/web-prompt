CREATE TRIGGER trg_prompts_updated_at 
AFTER UPDATE ON prompts
BEGIN
  UPDATE prompts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
