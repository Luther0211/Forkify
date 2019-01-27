export default class Favorites {
  constructor() {
    this.favs = [];
  }

  addFav(id, title, author, image) {
    const fav = {id, title, author, image };
    this.favs.push(fav);

    //Save data in local storage
    this.saveData()
    return fav
  }
  
  deleteFav(id) {
    const index = this.favs.findIndex(el => el.id === id);
    this.favs.splice(index, 1);
    
    //Save data in local storage
    this.saveData()

  }

  isFaved(id) {
    return this.favs.findIndex(el => el.id === id) !== -1;
  }

  getNumFavs() {
    return this.favs.length;
  }

  saveData() {
    localStorage.setItem('favorites', JSON.stringify(this.favs));
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem('favorites'));

    // Restore favs from local storage
    if(storage) this.favs = storage;
  }
}