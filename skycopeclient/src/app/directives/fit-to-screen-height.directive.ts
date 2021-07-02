import { Directive, Input, ElementRef, AfterViewInit, AfterContentInit, OnInit, OnChanges } from '@angular/core';

@Directive({
  selector: '[fitToScreenHeight]'
})
export class FitToScreenHeightDirective implements OnChanges{

  @Input() addHeight: number = 0;
  @Input() public itemsToWatch: Array<any>|any; //any value changes will trigger ngOnChanges (removal/add child)
  public constructor(private el: ElementRef) { }

  ngOnChanges(){
    this.determineScrollHeight();
  }

  determineScrollHeight(){
    let maxHeight =  window.innerHeight - this.el.nativeElement.getBoundingClientRect().top + this.addHeight;
    this.el.nativeElement.style.height = String(maxHeight   ) + 'px';
  }


}
