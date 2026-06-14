import { categoryRepository } from './repository';
import { categorySchema } from './validation';

export const categoryService = {
  async getAllCategories() {
    return categoryRepository.findAll();
  },

  async getCategory(id: number) {
    return categoryRepository.findById(id);
  },

  async createCategory(data: unknown) {
    const validated = categorySchema.parse(data);
    
    const existing = await categoryRepository.findByName(validated.name);
    if (existing) {
      throw new Error('Kategori dengan nama tersebut sudah ada');
    }

    return categoryRepository.create(validated);
  },

  async updateCategory(id: number, data: unknown) {
    const validated = categorySchema.parse(data);
    
    const existing = await categoryRepository.findByName(validated.name);
    if (existing && existing.id !== id) {
      throw new Error('Nama kategori sudah digunakan oleh kategori lain');
    }

    return categoryRepository.update(id, validated);
  },

  async deleteCategory(id: number) {
    return categoryRepository.delete(id);
  }
};
