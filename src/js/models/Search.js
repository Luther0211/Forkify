import axios from 'axios'

export default class Search {
  constructor(query) {
    this.query = query
  }

  // http request with axios
  async getResult(){ // async METHOD
    const key = "b9cc1ecc4f3fd0a765e79e0343dc57da";
    try{
        const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this. query}`)
        this.result = res.data.recipes
        //console.log(this.result);
    } catch(error) {
        alert(error)
    }
  }
}