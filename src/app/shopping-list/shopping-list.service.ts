import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

export class ShoppingListService{
    ingredientsChanged = new Subject<Ingredient[]>();
    selectedId = new Subject<number>();

    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('mangoes', 15)
      ];

    getIngredientById(id: number) {
        return this.ingredients[id];
    }
    getIngredient(){
        return this.ingredients.slice();
    }
    addIngredient(ingredient: Ingredient){
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());
    }
    addIngredients(ingredients: Ingredient[]){
        // for(let i of ingredients){
        //     this.addIngredient(i);
        // }
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next(this.ingredients.slice());
    }
    updateIngredient(id: number, ingredient: Ingredient) {
        this.ingredients[id] = ingredient;
        this.ingredientsChanged.next(this.ingredients.slice());
    }
    deleteIngredient(id: number){
        this.ingredients.splice(id, 1);
        this.ingredientsChanged.next(this.ingredients.slice());
    }
}