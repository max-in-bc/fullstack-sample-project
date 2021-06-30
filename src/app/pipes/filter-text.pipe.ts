import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'rxjs/operators';

@Pipe({
  name: 'filterText'
})
export class FilterTextPipe implements PipeTransform {

  // transform(itemString: string, searchText: string): string {
  //   if (!searchText || !itemString) { return itemString; }
  //   let items = itemString.split('\n');
  //   return items.filter(item => {
  //     return item.toLowerCase().includes(searchText.toLowerCase());
  //   }).join('\n');
  // }


  transform(itemString: string, searchText: string, filterRegexEnabled: boolean = false): string {
    if (!searchText || !itemString) { return itemString; }
    let items = itemString.split('\n');
    return items.filter(item => {
      if (filterRegexEnabled){

        return item.match(new RegExp(searchText, "g")) != null;
      }
      else{

        return item.toLowerCase().includes(searchText.toLowerCase());
      }
    }).join('\n');

  }
}
