import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './js/refs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ApiService from './js/API-service';

const perPage = 40;
const apiService = new ApiService();
const lightbox = new SimpleLightbox('.gallery_container a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
  enableKeyboard: true,
});

refs.loadMoreBtn.classList.add('is-hidden');

refs.searchForm.addEventListener('submit', onSearchQuery);
refs.loadMoreBtn.addEventListener('click', onLoadMoreSearch);

function onSearchQuery(e) {
  e.preventDefault();
  refs.galleryContainer.innerHTML = '';

  apiService.query = e.currentTarget.elements.searchQuery.value;

  // if (apiService.query === '') {
  //   refs.loadMoreBtn.classList.add('is-hidden');
  //   return;
  // }

  apiService.resetPage();
  apiService.fetchImages().then(data => {
    let totalPages = Math.ceil(data.totalHits / perPage);
    apiService.hits = data.totalHits;

    if (data.hits.length === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    renderCards(data.hits);
    refs.loadMoreBtn.classList.remove('is-hidden');

    if (apiService.queryPage >= totalPages) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  });
}

function onLoadMoreSearch(e) {
  apiService.fetchImages().then(data => {
    let totalPages = Math.ceil(data.totalHits / perPage);
    apiService.incrementPage();
    renderCards(data.hits);

    if (apiService.queryPage >= totalPages) {
      refs.loadMoreBtn.classList.add('is-hidden');
      return Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

function renderCards(data) {
  const markup = data
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="gallery__item" href="${largeImageURL}">
                  <div class="photo-card">
                      <img src="${webformatURL}" alt="${tags}" loading="lazy" width=300 height=200 />
                      <div class="info">
                        <p class="info-item"><b>Likes</b> ${likes}</p>
                        <p class="info-item"><b>Views</b> ${views}</p>
                        <p class="info-item"><b>Comments</b> ${comments}</p>
                        <p class="info-item"><b>Downloads</b> ${downloads}</p>
                      </div>
                    </div>
                 </a>`;
      }
    )
    .join('');

  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}
