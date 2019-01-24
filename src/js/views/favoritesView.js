import { elements } from './base';
import { limitRecipeTitle } from './searchView'

export const toggleFavBtn = isFaved => {
  const iconStr = isFaved ? 'icon-heart' : 'icon-heart-outlined';
  document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconStr}`);
  
}

export const toggleFavMenu = numFavs => {
  elements.favMenu.style.visibility = numFavs > 0 ? 'visible' : 'hidden'
}

export const renderFav = fav => {
  const markup = `
  <li>
      <a class="likes__link" href="#${fav.id}">
          <figure class="likes__fig">
              <img src="${fav.image}" alt="${fav.title}">
          </figure>

          <div class="likes__data">
              <h4 class="likes__name" title="${fav.title}">${limitRecipeTitle(fav.title)}</h4>
              <p class="likes__author">${fav.author}</p>
          </div>
      </a>
  </li>
  `;

  elements.favList.insertAdjacentHTML('beforeend', markup);
};

export const deleteFav = id => {
  const el = document.querySelector(` .likes__link[href="#${id}"] `).parentElement;
  if (el) el.parentElement.removeChild(el);
}