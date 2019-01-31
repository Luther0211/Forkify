import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import Favorites from './models/Favorites';
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as favoritesView from './views/favoritesView'
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
      Swal(`Recipe not found :(`, '', 'error')
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
      // console.log(state.recipe);
      clearLoader()
      recipeView.renderRecipe(state.recipe, state.favs.isFaved(id))

    } catch (error) {
      console.log(error)
      Swal(`Error Prossesing the recipe`, '', 'error')

    }
  }
};

// *ADDING SAME EVENTLISTENER TO MULTIPLE EVENTS* 
                                             
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)) 

/* LIST CONTROLLER */
const controlList = () => {
  //Create new list if there is none yet
  if(!state.list) state.list = new List()

  //Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.quantity, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}


// Handle delete and update item events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  //Handle the delete button event
  if(e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state
    state.list.deleteItem(id)

    // Delete from UI
    listView.deleteItem(id)

    //Handle the count update
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value);
    state.list.updateQuantity(id, val);
  }

});


//Clicking on logo clears results
elements.logo.addEventListener('click', e => {
  e.preventDefault()
  window.location = '/'
});



/* FAVORITES CONTROLLER */
const controlFav = () => {
  if(!state.favs) state.favs = new Favorites();
  const currentID = state.recipe.id

  //User has not yet favd current recipe
  if (!state.favs.isFaved(currentID)) {
    //add fav to data
    const newFav = state.favs.addFav(currentID, state.recipe.title, state.recipe.author, state.recipe.img)

    //toggle fav btn
    favoritesView.toggleFavBtn(true);
    
    //add fav to UI list
    favoritesView.renderFav(newFav);
    console.log(state.favs)
    
    // User HAS favd current recipe
  } else {
    //remove fav from data
    state.favs.deleteFav(currentID)
    
    //toggle fav btn
    favoritesView.toggleFavBtn(false);
  
  
  //remove fav from UI list
  favoritesView.deleteFav(currentID)
  console.log(state.favs)
  }
  favoritesView.toggleFavMenu(state.favs.getNumFavs());
}

//Restore favs on page load
window.addEventListener('load', () => {
  state.favs = new Favorites();

  // Restore favs
  state.favs.readStorage();

  //Toggle fav button
  favoritesView.toggleFavMenu(state.favs.getNumFavs());

  // render favs
  console.log(state)
  state.favs.favs.forEach(fav => favoritesView.renderFav(fav));
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
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    //Add ingredients to shopping list
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    // Fav controller
    controlFav();
  }

  // console.log(state.recipe.ingredients)
});