import { Course } from "./course.entity";
import { SubCategory } from "./subCategory.entity";

export class Category {
    constructor(
        public id: number,
        public categoryName: string,
        public categoryDescription?: string,
        public courses?: Course[] | null,
        public subcategories?: SubCategory[] | null,
        public categoryImage?: string
    ) { }

}