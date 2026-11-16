export interface CourseRequestDto {
  id: number,
  name: string,
  description?: string,
  image?: string,
  category_id?: number,
}