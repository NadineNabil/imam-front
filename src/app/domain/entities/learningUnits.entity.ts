export class LearningUnits {
    constructor(
        public id: number,
        public learningUnitName: string,
         public courseId: number,
        public learningUnitDescription?: string,
        public learningUnitImage?: string,
       public createdAt?: string,
    public updatedAt?: string,
    public knowledgeSources?: any[] ){}
}
        

