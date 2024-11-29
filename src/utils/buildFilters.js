/**
 
 
 * @param {Object} filters
 * @param {string} [filters.type]
 * @param {string} [filters.isFavourite] 
 * @returns {Object}
 */
export const buildFilters = (filters) => {
  const filterConditions = {};

  if (filters.type) {
    filterConditions.contactType = filters.type;
  }

  if (filters.isFavourite !== undefined) {
    filterConditions.isFavourite = filters.isFavourite === 'true';
  }

  return filterConditions;
};
