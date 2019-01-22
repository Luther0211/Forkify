import Search from './models/Search'
import Recipe from './models/Recipe'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import { elements, renderLoader, clearLoader } from './views/base'
import Swal from 'sweetalert2'

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
      if(state.search.result.length === 0) {
        clearLoader()
        Swal(`Recipe for "${query}" not found!`, 'Please try something else!', 'error')
      } else {
        clearLoader();
        searchView.renderResults(state.search.result)
      }

    } catch(error) {
      alert("Recipe not found :(")
      clearLoader();
    }
  } else {
    Swal('You need to type something!', 'Please type something to search for recipes!', 'info')
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
    recipeView.clearRecipe()
    renderLoader(elements.recipe);

    //Highlight selected recipe
    if (state.search) searchView.selectedRecipe(id);

    //create New Recipe Obj
    state.recipe = new Recipe(id)

    try {
      //get recipe data & parse ingredients
      await state.recipe.getRecipe()
      state.recipe.parseIngredients()

      //Calc time & servings
      state.recipe.calcTime();
      state.recipe.calcServings();

      //render recipe
      console.log(state.recipe);
      clearLoader()
      recipeView.renderRecipe(state.recipe)

    } catch (error) {
      alert("Error Prossesing the recipe")
    }
  }
};

// *ADDING SAME EVENTLISTENER TO MULTIPLE EVENTS* 
                                             
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)) 

//Clicking on logo clears results
elements.logo.addEventListener('click', e => {
  e.preventDefault()
  window.location = '/'
})

//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {

  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // decrease button is clicked
    if(state.recipe.servings > 1) {
      state.recipe.updateServings('dec')
      recipeView.updateServingsIngredients(state.recipe)
    }
    
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // increase buttons is clicked
    state.recipe.updateServings('inc')
    recipeView.updateServingsIngredients(state.recipe)


  }
  console.log(state.recipe.ingredients)

});