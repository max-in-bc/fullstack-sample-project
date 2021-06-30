import { Pipe, PipeTransform } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { filter } from 'rxjs/operators';

@Pipe({
  name: 'filterText'
})
export class FilterTextPipe implements PipeTransform {

  constructor(private _ngxLoader: NgxSpinnerService){

  }

  transform(itemString: string, searchText: string, filterRegexEnabled: boolean = false): string {
    if (!searchText || !itemString) { return itemString; }
    let items = itemString.split('\n');
    var result : string = items.filter(item => {
      if (filterRegexEnabled){
        return item.match(new RegExp(searchText, "g")) != null;
      }
      else{
        return item.includes(searchText);
      }
    }).join('\n');

    this._ngxLoader.hide();
    return result;

  }
}
