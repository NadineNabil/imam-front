export class Course {
    constructor(
        public id: number,
        public name: string,
        public collectionId?:string,
        public description?: string,
        public image?: string,
        public category_id?: number,
        public parent_category_id?: number,
        public learning_units?: any[]
    ) { }
}