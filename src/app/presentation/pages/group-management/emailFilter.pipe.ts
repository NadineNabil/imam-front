import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emailSearch',
  standalone: true
})
export class emailFilterPipe implements PipeTransform {

  transform(
    items: any[],
    search: string,
    fields: string[] = []
  ): any[] {

    if (!items) return [];
    if (!search) return items;

    search = search.toLowerCase().trim();

    return items.filter(item =>
      fields.some(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        return value?.toString().toLowerCase().includes(search);
      })
    );
  }
}