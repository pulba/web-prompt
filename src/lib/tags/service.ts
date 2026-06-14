import { tagRepository } from './repository';
import { tagSchema } from './validation';

export const tagService = {
  async getAllTags() {
    return tagRepository.findAllWithCount();
  },

  async getTag(id: number) {
    return tagRepository.findById(id);
  },

  async createTag(data: unknown) {
    const validated = tagSchema.parse(data);
    
    const existing = await tagRepository.findByName(validated.name);
    if (existing) {
      throw new Error('Tag dengan nama tersebut sudah ada');
    }

    return tagRepository.create(validated);
  },

  async updateTag(id: number, data: unknown) {
    const validated = tagSchema.parse(data);
    
    const existing = await tagRepository.findByName(validated.name);
    if (existing && existing.id !== id) {
      throw new Error('Nama tag sudah digunakan oleh tag lain');
    }

    return tagRepository.update(id, validated);
  },

  async deleteTag(id: number) {
    return tagRepository.delete(id);
  }
};
