import axios from 'axios'
import { key } from '../config'

export default class Recipe {
  constructor(id) {
    this.id = id
  }

  async getRecipe() {
    try {
      const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
      this.title = res.data.recipe.title
      this.author = res.data.recipe.publisher
      this.img = res.data.recipe.image_url
      this.url = res.data.recipe.source_url
      this.ingredients = res.data.recipe.ingredients

    } catch (error) {
      console.log(error)
      alert("something went wrong :(")
    }
  }

  calcTime() {
    //rough estimate (15 min for each 3 ingredients)
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.Servings = 4;
  }

  parseIngredients() {
    const unitsLong = ["tablespoons", "tablespoon", "ounces", "ounce", "teaspoons", "teaspoon", "cups", "pounds"]
    const unitsShort = ["tbps", "tbps", "oz", "oz", "tsp", "tsp", "cup", "pound"]


    const newIngredients = this.ingredients.map(el => {
      //1 uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      //2 remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ')

      //3 parse ingredients into count,  unit & ingredient
      

      return ingredient
    });
    this.ingredients = newIngredients;
  }

}