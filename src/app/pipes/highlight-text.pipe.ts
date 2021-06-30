import { NgxSpinnerService } from 'ngx-spinner';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightText'
})
export class HighlightTextPipe implements PipeTransform {

  constructor(private _ngxLoader: NgxSpinnerService){

  }
  private escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  transform(itemString: string, searchText: string, highlightRegexEnabled: boolean = false): string {
    if (!searchText || !itemString) { return itemString; }

    searchText = highlightRegexEnabled ? searchText : this.escapeRegExp(searchText);
    var result: string =  itemString.replace(new RegExp(searchText, "g") , (match) => `<mark>${match}</mark>`);
    this._ngxLoader.hide();
    return result;
  }

}
