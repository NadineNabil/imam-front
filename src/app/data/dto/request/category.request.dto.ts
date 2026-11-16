export interface CategoryRequestDto {
    id: number,
  categoryName: string,
}

export interface CreateCategoryRequestDto {
  name: string,
  description: string,
  image?: string
}

export interface EditCategoryDto{
  id: number,
  name: string,
  description: string,
  image?: string
}