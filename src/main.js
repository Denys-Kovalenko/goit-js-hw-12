import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages } from './js/pixabay-api';
import { renderGallery } from './js/render-functions';
import iziToast from 'izitoast';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loadingMessage = document.querySelector('.loading-message');

let currentPage = 1;
let currentQuery = '';

form.addEventListener('submit', async event => {
  event.preventDefault();
  currentQuery = event.target.elements.searchQuery.value.trim();
  currentPage = 1;
  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';
  loadingMessage.style.display = 'block';

  if (!currentQuery) {
    iziToast.error({
      message: 'Enter a search query!',
      messageColor: '#fafafb',
      color: '#EF4040',
      position: 'topRight',
      maxWidth: '432px',
    });
    loadingMessage.style.display = 'none';
    return;
  }

  try {
    const images = await fetchImages(currentQuery, currentPage);
    loadingMessage.style.display = 'none';

    if (!images.hits.length) {
      iziToast.warning({
        message: 'No images found. Try another search!',
        messageColor: '#fafafb',
        color: '#EF4040',
        position: 'topRight',
        maxWidth: '432px',
      });
      return;
    }

    renderGallery(images.hits);

    if (images.hits.length === 40) {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    iziToast.error({ message: 'Something went wrong!' });
    loadingMessage.style.display = 'none';
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  loadingMessage.style.display = 'block';

  try {
    const images = await fetchImages(currentQuery, currentPage);
    loadingMessage.style.display = 'none';

    if (!images.hits.length) {
      loadMoreBtn.style.display = 'none';
      iziToast.info({ message: "You've reached the end of search results." });
      return;
    }

    renderGallery(images.hits, true);

    if (images.hits.length < 40) {
      loadMoreBtn.style.display = 'none';
      iziToast.info({ message: "You've reached the end of search results." });
    }

    const { height } = document
      .querySelector('.gallery-item')
      .getBoundingClientRect();
    window.scrollBy({ top: height * 2, behavior: 'smooth' });
  } catch (error) {
    iziToast.error({ message: 'Something went wrong!' });
    loadingMessage.style.display = 'none';
  }
});
