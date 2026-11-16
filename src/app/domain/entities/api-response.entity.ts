export interface ApiResponse {
  success: boolean;
  message: string;
  // You can add more fields if your backend returns data, e.g.:
  // data?: any;
}
export interface ErrorApiResponse{
  detail:string
}