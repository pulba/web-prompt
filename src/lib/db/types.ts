export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Prompt {
  id: number;
  title: string;
  content: string;
  category_id: number | null;
  source: string | null;
  favorite: number;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface PromptTag {
  prompt_id: number;
  tag_id: number;
}
