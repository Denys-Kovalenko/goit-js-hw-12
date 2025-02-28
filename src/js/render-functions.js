import SimpleLightbox from 'simplelightbox';

export function renderGallery(images, append = false) {
  const gallery = document.querySelector('.gallery');
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
<li class="gallery-item">
    <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
        <p data-label="Likes">${likes}</p>
        <p data-label="Views">${views}</p>
        <p data-label="Comments">${comments}</p>
        <p data-label="Downloads">${downloads}</p>
    </div>
</li>
`
    )
    .join('');

  if (append) {
    gallery.insertAdjacentHTML('beforeend', markup);
  } else {
    gallery.innerHTML = markup;
  }

  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}
