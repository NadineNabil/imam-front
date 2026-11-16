import { Objective } from 'src/app/domain/entities/objective.entity';
import { ObjectiveResponseDto } from './../dto/response/objective.response.dto';
export class ObjectiveMapper{
    static fromResponse(Dto:ObjectiveResponseDto):Objective{
       return {
        id:Dto.id,
        objectiveText:Dto.title,
        filename:Dto.file_name,
        knowledgeSourceId:Dto.knowledge_source_id,
        cognitiveStyle:Dto.cognitive_style?? null,
        questions:[]
       }
    }
    static fromResponseList(Dto:ObjectiveResponseDto[]):Objective[]{
        return Dto.map((dto)=>this.fromResponse(dto))
    }
}