import { Student } from "./student.entity";

export interface Group{
    id:number;
    name:string;
    description?:string
    studentsCount?:number,
    CreatedDate?:Date|string,
     students?:Student[]
    createdBy?:string,
    pendingStudentsCount?:number,
    activeStudentsCount?:number,
}