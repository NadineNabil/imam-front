export class SharedPagination {
    constructor(
        public page: number,
        public pageSize: number,
        public totalItems?: number,
        public totalPages?: number,
        public search?: string,
        public sortColumn?: string,
        public sortDirection?: 'asc' | 'desc',
        public status?: string,
        public columnFilters?: { [key: string]: string },
    ) { }
}