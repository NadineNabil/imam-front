import { ResponseTypeEnum } from "src/app/domain/enums/response-type.enum";

export interface ResponseTypeUI {
  responseType:ResponseTypeEnum
  selected: boolean;
}
