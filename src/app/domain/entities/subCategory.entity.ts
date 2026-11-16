import { Course } from "./course.entity";

export class SubCategory {
    constructor(
        public id: number,
        public subCategoryName: string,
        public parentId?: number | null,
        public subCategoryDescription?: string,
        public organizationId?: number,
        public courses?: Course[] | null
    ) { }
}