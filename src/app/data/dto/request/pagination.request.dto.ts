export interface PaginationRequestDto {
    page_no: number;
    page_size: number;
    search_term:string|undefined;
}