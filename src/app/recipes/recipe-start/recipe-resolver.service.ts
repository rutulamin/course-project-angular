import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from '../recipe.model';
import { DataStoredService } from 'src/app/shared/data-stored.service';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipe.service';

@Injectable()

export class RecipeResolverService implements Resolve<Recipe[]> {
    constructor(private dsService: DataStoredService, private recipeService: RecipeService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const recipes = this.recipeService.getRecipe();

        if (recipes.length === 0) {
            return this.dsService.fetchData();
        } else {
            return recipes;
        }
    }
}
