
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const elements = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('input'),
  formContainer: document.querySelector('.gallery'),
  upButton: document.querySelector('.round-button'),
  guardJs: document.querySelector('.for_upButton'),
  loader: document.getElementById('loader'),
};

let query = '';
let page = 1;
const perPage = 40;
let isLoading = false;
const BASE_URL = 'https://pixabay.com/api/';
const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

async function fetchImages(inputValue, page) {
  const params = new URLSearchParams({
    key: '38393469-c3ed0194fa41e0d5130fcf9c2',
    q: inputValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: perPage,
    page,
  });

  try {
    const response = await axios.get(`${BASE_URL}?${params}`);
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}

elements.form.addEventListener('submit', onFormSubmit);
elements.upButton.addEventListener('click', scrollTop);

const options = {
  root: null,
  rootMargin: '300px',
  threshold: 0,
};

const observer = new IntersectionObserver(handlerPagination, options);

async function onFormSubmit(e) {
  e.preventDefault();
  elements.loader.style.display = 'block';
  const inputValue = elements.input.value.trim();

  if (!inputValue) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please, fill the main field',
      position: 'topRight',
      color: 'red',
    });
    elements.loader.style.display = 'none';
    return;
  }

  if (inputValue === query) {
    iziToast.info({
      title: 'Invalid input',
      message: `The previous ${query} request has already been received, please enter a new search parameter`,
      position: 'topRight',
    });
    elements.loader.style.display = 'none';
    return;
  }

  query = inputValue;
  page = 1;
  elements.formContainer.innerHTML = '';
  elements.upButton.style.visibility = 'hidden';
  observer.unobserve(elements.guardJs); 
  await loadImages();
}

async function loadImages() {
  try {
    const { hits, totalHits } = await fetchImages(query, page);

    if (!hits || hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message: 'Sorry, there are no images matching your search query. Please try again.',
        position: 'topRight',
        color: 'red',
      });
      elements.loader.style.display = 'none';
      return;
    }

    elements.formContainer.insertAdjacentHTML('beforeend', createMarkup(hits));
    simpleLightBox.refresh();
    iziToast.success({
      title: 'Success',
      message: `Hooray! We found ${totalHits} images 😍😍😍`,
      position: 'topRight',
      color: 'green',
    });

    const totalPages = Math.ceil(totalHits / perPage);

    if (page >= totalPages) {
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        color: 'blue',
      });
      elements.upButton.style.visibility = 'visible';
      observer.unobserve(elements.guardJs);
    } else {
      observer.observe(elements.guardJs); 
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'bottomCenter',
    });
  } finally {
    elements.loader.style.display = 'none';
    isLoading = false;
  }
}

function createMarkup(arr) {
  return arr
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
       <li class="photo-card">
        <a href="${largeImageURL}">
          <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes</b>${likes}</p>
          <p class="info-item"><b>Views</b>${views}</p>
          <p class="info-item"><b>Comments</b>${comments}</p>
          <p class="info-item"><b>Downloads</b>${downloads}</p>
        </div>
      </li>`
    )
    .join('');
}

function scrollTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
  elements.upButton.style.visibility = 'hidden';
}

async function handlerPagination(entries) {
  for (let entry of entries) {
    if (entry.isIntersecting && !isLoading) {
      isLoading = true;
      page += 1;
      await loadImages();
    }
  }
}





// import axios from 'axios';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
// import iziToast from 'izitoast';
// import 'izitoast/dist/css/iziToast.min.css';

// const elements = {
//   form: document.querySelector('#search-form'),
//   input: document.querySelector('input'),
//   formContainer: document.querySelector('.gallery'),
//   upButton: document.querySelector('.round-button'),
//   guardJs: document.querySelector('.for_upButton'),
//   loader: document.getElementById('loader'),
// };

// let query = '';
// let page = 1;
// let simpleLightBox;
// const perPage = 40;
// let isLoading = false;
// const BASE_URL = 'https://pixabay.com/api/';

// async function fetchImages(inputValue, page) {
//   const params = new URLSearchParams({
//     key: '38393469-c3ed0194fa41e0d5130fcf9c2',
//     q: inputValue,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//     per_page: perPage,
//     page: `${page}`,
//   });

//   try {
//     const response = await axios.get(`${BASE_URL}?${params}`);
//     if (response.status !== 200) {
//       throw new Error(`Error: ${response.status} ${response.statusText}`);
//     }
//     const data = response.data;
//     if (!data.hits || data.hits.length === 0) {
//       throw new Error('No images found');
//     }
//     return data;
//   } catch (error) {
//     console.error('Error fetching images:', error);
//     throw error;
//   }
// }

// elements.form.addEventListener('submit', onFormSubmit);
// simpleLightBox = new SimpleLightbox('.gallery a');

// const options = {
//   root: null,
//   rootMargin: '300px',
//   threshold: 0,
// };

// const observer = new IntersectionObserver(handlerPagination, options);

// elements.upButton.addEventListener('click', scrollTop);

// async function onFormSubmit(e) {
//   e.preventDefault();
//   elements.loader.style.display = 'block';
//   const inputValue = elements.input.value.trim();
//   if (inputValue === query) {
//     iziToast.info({
//       title: 'Invalid input',
//       message: `The previous ${query} request has already been received, please enter a new search parameter`,
//       position: 'topRight',
//     });
//     elements.loader.style.display = 'none';
//     return;
//   }
//   elements.formContainer.innerHTML = '';

//   if (!inputValue) {
//     iziToast.warning({
//       title: 'Warning',
//       message: 'Please, fill the main field',
//       position: 'topRight',
//       color: 'red',
//     });
//     elements.loader.style.display = 'none';
//     return;
//   }

//   query = inputValue;
//   page = 1;
//   elements.formContainer.innerHTML = '';
//   try {
//     observer.observe(elements.guardJs);
//     const { hits, totalHits } = await fetchImages(inputValue, page);
//     if (totalHits === 0) {
//       iziToast.error({
//         title: 'Error',
//         message:
//           'Sorry, there are no images matching your search query. Please try again.',
//         position: 'topRight',
//         color: 'red',
//       });
//       elements.loader.style.display = 'none';
//       return;
//     }

//     elements.formContainer.innerHTML = createMarkup(hits);
//     simpleLightBox.refresh();
//     elements.input.value = '';
//     handlerPagination([{ isIntersecting: true }], observer);
//     iziToast.success({
//       title: 'Success',
//       message: `Hooray! We found ${totalHits} images 😍😍😍`,
//       position: 'topRight',
//       color: 'green',
//     });
//   } catch (error) {
//     console.log(error);
//     // iziToast.error({
//     //   title: 'Error',
//     //   message: 'Something went wrong. Please try again later.',
//     //   position: 'bottomCenter',
//     // });
//   } finally {
//     elements.loader.style.display = 'none';
//   }
// }

// function createMarkup(arr) {
//   return arr
//     .map(
//       ({
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) => `
//        <li class="photo-card">
//         <a href="${largeImageURL}">
//           <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
//         </a>
//         <div class="info">
//           <p class="info-item"><b>Likes</b>${likes}</p>
//           <p class="info-item"><b>Views</b>${views}</p>
//           <p class="info-item"><b>Comments</b>${comments}</p>
//           <p class="info-item"><b>Downloads</b>${downloads}</p>
//         </div>
//       </li>`
//     )
//     .join('');
// }

// function scrollTop() {
//   window.scrollTo({
//     top: 0,
//     behavior: 'smooth',
//   });
//   elements.upButton.style.visibility = 'hidden';
// }

// async function handlerPagination(entries, observer) {
//   if (!isLoading) {
//     for (let entry of entries) {
//       if (entry.isIntersecting) {
//         isLoading = true;
//         try {
//           page += 1;
//           const { hits, totalHits } = await fetchImages(query, page);
//           elements.formContainer.insertAdjacentHTML(
//             'beforeend',
//             createMarkup(hits)
//           );
//           simpleLightBox.refresh();
//           const totalPages = Math.ceil(totalHits / perPage);

//           if (page >= totalPages) {
//             iziToast.info({
//               title: 'Info',
//               message:
//                 "We're sorry, but you've reached the end of search results.",
//               position: 'topRight',
//               color: 'blue',
//             });
//             elements.upButton.style.visibility = 'visible';
//             observer.unobserve(elements.guardJs);
//           }
//         } catch (error) {
//           console.log(error);
//           // elements.upButton.style.visibility = 'visible';
//           // iziToast.error({
//           //   title: 'Error',
//           //   message:
//           //     "We're sorry, but you've reached the end of search results",
//           //   position: 'topRight',
//           // });
//         } finally {
//           elements.loader.style.display = 'none';
//           isLoading = false;
//         }
//       }
//     }
//   }
// }