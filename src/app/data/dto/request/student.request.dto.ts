export interface StudentRequestDto {
  imageUrl?: string;
  phoneNumber?: string;
  countryCode?: string;
}
export interface UpdateStudentRequestDto {
country_code: string,
phone_number: string,
preferred_language: string
}
export interface UpdateStudentImageDto {
image: string,
}