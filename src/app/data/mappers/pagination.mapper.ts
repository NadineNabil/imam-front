import { SharedPagination } from "src/app/domain/entities/shared-pagination.entity";
import { PaginationRequestDto } from "../dto/request/pagination.request.dto";
export class PaginationMapper {
    static toRequest(pagination: SharedPagination): PaginationRequestDto {
        return {
            page_no: pagination.page,
            page_size: pagination.pageSize,
            search_term:pagination.search
        };
    }
}