export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  subcategories: Subcategory[];
}

export type AiTool = 'ChatGPT' | 'Claude' | 'Gemini' | 'Midjourney';

export interface Prompt {
  id: string;
  title: string;
  categoryId: string;
  subcategoryId: string;
  aiTool: AiTool;
  promptText: string;
  description: string;
  useCase: string;
  variables: string[];
  relatedPromptIds: string[];
}
