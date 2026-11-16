import { CourseDto } from "./course.response.dto";

export interface SubCategoryRequestDto{
    name: string,
    parent_category_id: number,
    description: string,
    organization_id: number
  

    
}

export interface SubCategoryResponseDto{
    id: number,
    name: string,
    parentId: number
    
}

export interface SubcategoryDto {
  id: number;
  name: string;
  parentId: number;
  courses: Array<CourseDto | null>;
}
