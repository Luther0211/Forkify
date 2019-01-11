import Search from './models/Search'

// Global State Of The App
//*- Search object
//*- Current recipe object
//*- Shopping list object
//*- Liked recipes object
const state = {
  
}

const controlSearch = async () => {
  // 1 Get query from view
  const query = "pizza" //TO-DO

  if(query) {
    //2 New Search obj & add it to state
    state.search = new Search(query);

    //3 Prepare UI for results


    //4 search for recipes
    await state.search.getResult();

    //5 Render results on UI
    console.log(state.search.result)
  }
}

document.querySelector('.search').addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});
