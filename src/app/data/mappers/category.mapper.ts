import { Course } from "src/app/domain/entities/course.entity";
import { CategoryDto, CategoryResponseDto, CreateCategoryResponseDto, GetCategoryResponseDto } from "../dto/response/category.response.dto";
import { Category } from "src/app/domain/entities/category.entity";
import { CourseMapper } from "./course.mapper";
import { SubCategoryMapper } from "./subCategory.mapper";
import { CreateCategoryRequestDto, EditCategoryDto } from "../dto/request/category.request.dto";

export class CategoryMapper {
  // API → Entity
  static fromResponseDto(dto: CategoryResponseDto): Category {
    return {
      id: dto.id,
      categoryName: dto.name,
      courses: null,
      subcategories: null,
    };
  }
  static fromResponseDtoList(dtos: CategoryResponseDto[]): Category[] {
    return dtos.map(dto => this.fromResponseDto(dto));
  }
    // Entity → API (for create/update)
  static toRequestDto(category: Category) : CategoryResponseDto{
    return {
      id: category.id,
      name: category.categoryName,
    };
  }
    /**
   * Map category response DTO to Category entity
   */
  static fromCategoryDTO(dto: CategoryDto): Category {
    return new Category(
      dto.id,
      dto.name,
      dto.description,
      CourseMapper.mapCourses(dto.courses),
      SubCategoryMapper.mapSubcategories(dto.subcategories)
    );
  }

    static fromEditCategoryDto(dto: EditCategoryDto): Category {
    return new Category(
      dto.id,
      dto.name,
      dto.description,
      null,
      null,
      dto.image
    );
  }
  static toEditCategoryDto(dto: Category): EditCategoryDto {
      return {
      id:dto.id,
      name: dto.categoryName,
      description:dto.categoryDescription??'',
      image:dto.categoryImage,
    };
  }
  static toCategoryDto(category: Category): CategoryDto {
    return {
      id: category.id,
      name: category.categoryName,
      description: category.categoryDescription??'',
      parent_id: null,
      courses: [],
      subcategories: [],
    };
  }
  static toCreateCategoryRequestDto(category: Category): CreateCategoryRequestDto {
    return {
      name: category.categoryName,
      description:category.categoryDescription??'',
      image:category.categoryImage
    };
  } 
  static fromCreateCategoryResponseDto(dto:CreateCategoryResponseDto):Category
    {
      return new Category(
        dto.id,
        dto.name,
        dto.description,
        null,
        null,
        dto.image
      );
    } 
    static fromGetCategoryResponseDto(dto:GetCategoryResponseDto):Category
    {
      return new Category(
        dto.id,
        dto.name,
        dto.description,
        null,
        null,
        dto.image
      );
    }
}
  
