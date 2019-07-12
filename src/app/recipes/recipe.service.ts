import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()

export class RecipeService{
  recipeChanged = new  Subject<Recipe[]>();
    // private recipes: Recipe[] = [
    //     new Recipe('Sample Recipe',
    //       'Nice Recipie',
    //       'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-1.2.1&
    //          ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    //       [
    //         new Ingredient('I1', 10),
    //         new Ingredient('I2', 15)
    //       ]),
    //     new Recipe('Another Sample Recipe',
    //      'Nice Recipie',
    //      'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-1.2.1&
    //        ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    //      [
    //         new Ingredient('I1', 100),
    //         new Ingredient('I2', 150)
    //      ]),
    //   ];

    private recipes: Recipe[] = [];

    constructor(private slService: ShoppingListService) {}
    getRecipe() {
        return this.recipes.slice();
    }
    addIToSL(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }
    getRecipeById(id: number) {
      return this.recipes[id];
    }
    addRecipe(recipe: Recipe) {
      this.recipes.push(recipe);
      this.recipeChanged.next(this.recipes.slice());
    }
    updateRecipe(index: number, newRecipe: Recipe) {
      this.recipes[index] = newRecipe;
      this.recipeChanged.next(this.recipes.slice());
    }
    deleteRecipe(index: number) {
      this.recipes.splice(index, 1);
      this.recipeChanged.next(this.recipes.slice());
    }
    setRecipe(recipe: Recipe[]) {
      this.recipes = recipe;
      this.recipeChanged.next(this.recipes.slice());
    }
}
