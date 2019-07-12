import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()

export class DataStoredService {
    constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {}

    saveData() {
        const recipes: Recipe[] = this.recipeService.getRecipe();
        this.http.put('https://ng-course-recipe-book-5e888.firebaseio.com/recipe.json',
            recipes)
            .subscribe((response) => {
                console.log(response);
            });
    }

    fetchData() {
        return this.http.get<Recipe[]>(
            'https://ng-course-recipe-book-5e888.firebaseio.com/recipe.json',
            ).pipe(map(recipe => {
                return recipe.map((r) => {
                    return {
                        ...r,
                        ingredients: r.ingredients ? r.ingredients : []
                    };
                });
            }),
            tap(recipes => {
                this.recipeService.setRecipe(recipes);
            }));
    }
}
