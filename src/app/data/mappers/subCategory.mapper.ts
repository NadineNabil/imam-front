import { Category } from "src/app/domain/entities/category.entity";
import { SubcategoryDto, SubCategoryRequestDto, SubCategoryResponseDto } from "../dto/response/sub-category.response.dto";
import { SubCategory } from "src/app/domain/entities/subCategory.entity";
import { CourseMapper } from "./course.mapper";

export class SubCategoryMapper {
  // API → Entity
  static fromResponseDto(dto: SubCategoryResponseDto): SubCategory {
    return new SubCategory(
      dto.id,
      dto.name,
      dto.parentId
    );
  }
  static fromResponseDtoList(dtos: SubCategoryResponseDto[]): SubCategory[] {
    return dtos.map(dto => this.fromResponseDto(dto));
  }
    // Entity → API (for create/update)
  static toRequestDto(subCategory: SubCategory) : SubCategoryRequestDto{

    return {
      name: subCategory.subCategoryName,
      parent_category_id: subCategory.parentId ?? 0,
      description: subCategory.subCategoryDescription??'',
      organization_id: subCategory.organizationId ?? 0
    };
  }
  static mapSubcategories(
    subcategories: SubcategoryDto[] | undefined
  ): SubCategory[] {
    if (!subcategories) {
      return [];
    }
    return subcategories.map((subcategory) =>
      this.fromSubcategoryDto(subcategory)
    );
  }
  static fromSubcategoryDto(
    dto: SubcategoryDto
  ): SubCategory {
    return new SubCategory(
      dto.id,
      dto.name,
      dto.parentId,
      "",
      0,
      CourseMapper.mapCourses(dto.courses),
   
    );
  }
}
