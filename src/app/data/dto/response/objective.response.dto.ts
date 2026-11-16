import { CognitiveStyle } from "src/app/domain/enums/cognitive-style.enum";

export interface ObjectiveResponseDto {
    id: number;
    title: string,
    cognitive_style?:  CognitiveStyle|null;
    file_name:string;
    knowledge_source_id:number
    weight?: number;
}