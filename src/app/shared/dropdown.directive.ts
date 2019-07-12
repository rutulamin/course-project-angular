import { Directive, HostBinding, HostListener, ElementRef } from '@angular/core';
@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {
    constructor(private elementRef: ElementRef) {}
    @HostBinding('class.show') isOpen = false;

    @HostListener('document:click', ['$event']) clickout(event){
        if (this.elementRef.nativeElement.contains(event.target) && !this.isOpen) {
            this.elementRef.nativeElement.querySelector(".dropdown-menu").classList.add('show');
            this.isOpen = true;
          } else {
            this.elementRef.nativeElement.querySelector(".dropdown-menu").classList.remove('show');
            this.isOpen = false;
          }
    }
}