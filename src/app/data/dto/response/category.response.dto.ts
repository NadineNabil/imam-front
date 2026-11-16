import { CourseDto } from "./course.response.dto";
import { SubcategoryDto } from "./sub-category.response.dto";

export interface CategoryResponseDto {
    id: number,
  name: string,
}



export interface CategoryDto {
  id: number;
  name: string;
  description:string,
  parent_id: number | null;
  courses: Array<CourseDto | null>;
  subcategories: SubcategoryDto[];
  
}

export interface CreateCategoryResponseDto{
  id: number;
  name: string;
  description:string,
  image:string
}

export interface GetCategoryResponseDto{
  id: number;
  name: string;
  description:string,
  image:string
}