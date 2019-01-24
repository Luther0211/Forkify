export default class Favorites {
  constructor() {
    this.favs = [];
  }

  addFav(id, title, author, image) {
    const fav = {id, title, author, image };
    this.favs.push(fav)
    return fav
  }

  deleteFav(id) {
    const index = this.favs.findIndex(el => el.id === id);
    this.favs.splice(index, 1);
  }

  isFaved(id) {
    return this.favs.findIndex(el => el.id === id) !== -1;
  }

  getNumFavs() {
    return this.favs.length;
  }
}