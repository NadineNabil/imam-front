import { CognitiveStyle } from "../enums/cognitive-style.enum"
import { Question } from "./question.entity";

export class Objective {
    constructor(
        public id: number,
        public objectiveText: string,
        public cognitiveStyle: CognitiveStyle|null,
        public filename:string|null,
        public weight?: number|null|string,
        public knowledgeSourceId?:number,
        public questions:Question[]= []

    ) {

    }
}