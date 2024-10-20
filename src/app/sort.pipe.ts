import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sort",
  standalone: true,
})
export class SortPipe implements PipeTransform {
  transform(array: any[], sortColumn: string, sortDirection: boolean): any[] {
    if (!array || !sortColumn) {
      return array;
    }
    return array.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      return sortDirection
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    });
  }
}
