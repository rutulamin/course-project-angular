import { NgModule } from '@angular/core';
import { ShoppingListService } from './shopping-list/shopping-list.service';
import { RecipeService } from './recipes/recipe.service';
import { DataStoredService } from './shared/data-stored.service';
import { RecipeResolverService } from './recipes/recipe-start/recipe-resolver.service';
import { AuthService } from './auth/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AuthGuardService } from './auth/auth-guard.service';

@NgModule({
    providers: [
        ShoppingListService,
        RecipeService,
        DataStoredService,
        RecipeResolverService,
        AuthService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true
        },
        AuthGuardService
      ],
})

export class CoreModule {}
