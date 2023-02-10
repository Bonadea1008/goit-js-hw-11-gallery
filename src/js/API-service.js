import axios from 'axios';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.queryPage = 1;
    this.totalHits = 0;
  }

  async fetchImages() {
    const BASE_URL = 'https://pixabay.com/api/';
    const KEY = '33388903-e4d75ee587d4fa8faa2060a30';

    try {
      const response = await axios.get(
        `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.queryPage}`
      );
      this.incrementPage();
      return response.data;
    } catch (error) {
      console.log('ERROR: ' + error);
    }
  }

  incrementPage() {
    this.queryPage += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get hits() {
    return this.totalHits;
  }

  set hits(newTotalHits) {
    this.totalHits = newTotalHits;
  }
}
