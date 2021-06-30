import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightText'
})
export class HighlightTextPipe implements PipeTransform {

  private escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  transform(itemString: string, searchText: string, highlightRegexEnabled: boolean = false): string {
    if (!searchText || !itemString) { return itemString; }

    searchText = highlightRegexEnabled ? searchText : this.escapeRegExp(searchText);
    return itemString.replace(new RegExp(searchText, "g"), (match) => `<mark>${match}</mark>`);
  }

}
