class CategoryService {
  getAll() {
    return axios.get('/api/categories');
  }
}

export default new CategoryService;
