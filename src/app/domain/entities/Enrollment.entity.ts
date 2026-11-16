import { Course } from "./course.entity";
import {studentCourseStatus} from "./../enums/studentCourseStatus"

export class Enrollment {
  constructor(
    public course: Course,
    public enrolledAt?: Date | string,
    public studentCourseStatus?:studentCourseStatus|string
  ) {}
}