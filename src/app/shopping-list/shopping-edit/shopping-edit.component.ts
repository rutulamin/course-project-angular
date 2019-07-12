import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit,OnDestroy {
  @ViewChild('f', {static: false}) editForm: NgForm; 
  subscription: Subscription;
  editMode = false;
  editItemIndex: number;
  editIngredient: Ingredient;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.slService.selectedId.subscribe((id: number) => {
      this.editMode = true;
      this.editItemIndex = id;
      this.editIngredient = this.slService.getIngredientById(id);
      this.editForm.setValue({ 
        name: this.editIngredient.name,
        amount: this.editIngredient.amount 
      });
    })
  }
  onAdd(form: NgForm) {
    // console.log(form);
    const newIngredient = new Ingredient(form.value.name, form.value.amount);
    if(this.editMode) {
      this.slService.updateIngredient(this.editItemIndex, newIngredient);
    }else {
      this.slService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }
  onDelete(){
    this.slService.deleteIngredient(this.editItemIndex);
    this.onClear();
  }
  onClear(){
    this.editMode = false;
    this.editForm.reset();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
