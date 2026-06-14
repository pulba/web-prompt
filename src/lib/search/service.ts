import { searchRepository, type SearchParams } from './repository';

export const searchService = {
  async searchPrompts(params: SearchParams) {
    // Basic sanitization for FTS5 query if needed
    if (params.q) {
      // Escape special FTS5 characters if necessary or keep it simple
      params.q = params.q.trim();
    }
    return searchRepository.search(params);
  }
};
