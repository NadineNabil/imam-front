import { TemplateRef } from "@angular/core";

export interface StepItem {
  labelIcon: string;
  content: TemplateRef<any>;
  optional?: boolean;
  nextDisabled?: boolean;
  hideNext?: boolean;
  hidePrevious?: boolean;
}