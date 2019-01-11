import Search from './models/Search'
import * as searchView from './views/searchView'
import { elements } from './views/base'

// Global State Of The App
//*- Search object
//*- Current recipe object
//*- Shopping list object
//*- Liked recipes object
const state = {}

const controlSearch = async () => {
  // 1 Get query from view
  const query = searchView.getInput();

  if(query) {
    //2 New Search obj & add it to state
    state.search = new Search(query);

    //3 Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();

    //4 search for recipes
    await state.search.getResult();

    //5 Render results on UI
    searchView.renderResults(state.search.result)
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});