import { Objective } from "src/app/domain/entities/objective.entity";
import { CognitiveStyle } from "src/app/domain/enums/cognitive-style.enum";
import { QuestionVM } from "./questions-ui-model";

// presentation/models/objective-ui.model.ts
export interface ObjectiveUI {
  id: number;
  objectiveText: string;
  cognitiveStyle?: CognitiveStyle | null;
  weight?: number | null|string;
   filename:string|null,
     knowledgeSourceId?:number
  selected: boolean;
   questions?: QuestionVM[]; 
}
export interface ObjectivesState {
  data: ObjectiveUI[];
  loading: boolean;
  error: boolean;
} 