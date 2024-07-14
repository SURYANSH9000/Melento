import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/add-assessment';  // Adjust the path as necessary

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: Product[], searchText: string): Product[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter(item => {
      return item.aName.toLowerCase().includes(searchText);  
    });
  }

}
