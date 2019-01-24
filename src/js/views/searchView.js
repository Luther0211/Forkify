import { elements } from './base'

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = ""
};

export const clearResults = () => {
  elements.searchResList.innerHTML = ""
  elements.searchResPages.innerHTML= ""
};

export const selectedRecipe = id => {
  const resultsArr = Array.from(document.querySelectorAll('.results__link'));

  resultsArr.forEach(el => el.classList.remove('results__link--active'));

  document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
}

export const limitRecipeTitle = (title, limit=17) => {
  const newTitle = []
  if(title.length > limit) {
    title.split(" ").reduce((acc, curr) => {
      if(acc + curr.length <= limit) {
        newTitle.push(curr);
      }
      return acc + curr.length
    }, 0)
    return `${newTitle.join(" ")} ...`;
  }
  return title
}

const renderRecipe = recipe => {
  const markup = `
  <li class="resultsList" title="${recipe.title}">
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
  </li>
  `;
  elements.searchResList.insertAdjacentHTML("beforeend", markup )
};

const createButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
  <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
  <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
  </svg>
</button>
`

const renderButtons = (page, numOfRes, resPerPage) => {
  const totalPages = Math.ceil(numOfRes / resPerPage);
  let button;

  if(page === 1 && totalPages > 1) {
    //nxt btn
    button = createButton(page, 'next');
  } else if(page < totalPages) {
    //both btn
    button = `
    ${createButton(page, 'prev')}
    ${createButton(page, 'next')}
    `
  } else if( page === totalPages && totalPages > 1) {
    //prev btn
    button = createButton(page, 'prev');
  }

  elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage=10) => {
  //render results of current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  
  recipes.slice(start, end).forEach(renderRecipe);

  // render pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};