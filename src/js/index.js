import Search from './models/Search'
import Recipe from './models/Recipe'
import * as searchView from './views/searchView'
import { elements, renderLoader, clearLoader } from './views/base'

// Global State Of The App
//*- Search object
//*- Current recipe object
//*- Shopping list object
//*- Liked recipes object
const state = {}

/* SEARCH CONTROLLER */
const controlSearch = async () => {
  // 1 Get query from view
  const query = searchView.getInput();

  if(query) {
    //2 New Search obj & add it to state
    state.search = new Search(query);

    //3 Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes)
    
    try {
      //4 search for recipes
      await state.search.getResult();
  
      //5 Render results on UI
      clearLoader();
      searchView.renderResults(state.search.result)

    } catch(error) {
      alert("Recipe not found :(")
      clearLoader();
    }
  }
}


elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
  var btn = e.target.closest(".btn-inline")
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage)

  }
})

/* RECIPE CONTROLLER */

const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');
  
  if(id) {
    //prepare UI for update

    //create New Recipe Obj
    state.recipe = new Recipe(id)

    try {
      //get recipe data
      await state.recipe.getRecipe()

      //Calc time & servings
      state.recipe.calcTime();
      state.recipe.calcServings();

      //render recipe
      console.log(state.recipe);
      } catch (error) {
        alert("Error Prossesing the recipe")
      }

  }



};

// *ADDING SAME EVENTLISTENER TO MULTIPLE EVENTS* 
                                             
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)) 
                                    