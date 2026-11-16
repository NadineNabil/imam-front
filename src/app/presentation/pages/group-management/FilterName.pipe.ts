import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ItemSearch',
   standalone: true
})
export class ItemSearchPipe implements PipeTransform {

  transform(items: any[], search: string): any[] {

    if (!items) return [];
    if (!search) return items;

    search = search.toLowerCase().trim();

    return items.filter(item =>{

    console.log('Filtering items with search term:', item);

      item.name.toLowerCase().includes(search)
    }

    );
  }

}