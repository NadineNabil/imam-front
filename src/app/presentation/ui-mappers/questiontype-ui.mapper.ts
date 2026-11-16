import { QuestionTypeEnum } from "src/app/domain/enums/question-type.enum";
import { QuestionOptionVM, QuestionVM } from "../models/questions-ui-model";

export const QUESTION_TYPE_MAP: Record<string, QuestionTypeEnum> = {
  'multiple choice': QuestionTypeEnum.multiple_choice,
/*   'multiple response': QuestionTypeEnum.multiple_response,
 */
  'True/False': QuestionTypeEnum.true_false,
  'true/false': QuestionTypeEnum.true_false,

  'short answer': QuestionTypeEnum.short_answer,
  'fill in the blanks': QuestionTypeEnum.fill_blank,

  'essay': QuestionTypeEnum.essay,

/*   'matching': QuestionTypeEnum.Matching,

  'sequence': QuestionTypeEnum.Sequence,

  ',drag and drop': QuestionTypeEnum.DragAndDrop,

  'numeric': QuestionTypeEnum.Numeric,

  'case study': QuestionTypeEnum.CaseStudy,

  'computational': QuestionTypeEnum.Computational,

  'comparative': QuestionTypeEnum.Comparative, */
};
export class QuestiontTypeUiMapper{
    constructor(){}

    static  mapExcelTypeToEnum(excelType: string | null): QuestionTypeEnum | null {

  if (!excelType) return null;

  const normalized = excelType
    .toString()
    .trim()
    .toLowerCase();

  return QUESTION_TYPE_MAP[normalized] ?? null;
}
static  extractOptions(row: any): string[] {
  return Object.keys(row)
    .filter(key => key.toLowerCase().startsWith('option'))
    .map(key => row[key])
    .filter(
      value => value !== null &&
               value !== undefined &&
               value.toString().trim() !== ''
    );
}
static extractLeftSide(row:any):string[]{
      if (!row['left side']) return []; // if missing or null, return empty array
  return row['left side']
    .split(',')        // split the string into an array
    .map((v:any )=> v.trim()) // remove any extra spaces
    .filter((v:any ) => v !== ''); // remove empty strings just in case
}
static extractRightSide(row:any):string[]{
      if (!row['right side']) return []; // if missing or null, return empty array
  return row['right side']
    .split(',')        // split the string into an array
    .map((v:any )=> v.trim()) // remove any extra spaces
    .filter((v:any ) => v !== ''); // remove empty strings just in case
    
}

static mapRowToQuestion(row: any): QuestionVM {
  const typeEnum = this.mapExcelTypeToEnum(row.type);

  if (!typeEnum) {
    throw new Error(`Invalid question type: ${row.type}`);
  }

  // extract the arrays from row
  let optionsRaw: string[] = this.extractOptions(row);
  const leftSide = this.extractLeftSide(row);
  const rightSide = this.extractRightSide(row);

  // === HANDLE TRUE/FALSE DEFAULT OPTIONS ===
  if (typeEnum === QuestionTypeEnum.true_false) {
    optionsRaw = ['true', 'false'];
  }

  // map to QuestionOptionVM if options exist
  let options: QuestionOptionVM[] | undefined;

  if (optionsRaw.length > 0) {
    // Convert correct answer into array safely
    const correctAnswers: string[] = row['correct answer']
      ? row['correct answer']
          .toString()
          .split(',')
          .map((v: string) => v.trim())
      : [];

    options = optionsRaw.map(opt => {
      let isCorrect = false;

      // Multiple choice, multiple response, or True/False
      if (
        typeEnum === QuestionTypeEnum.multiple_choice ||
        typeEnum === QuestionTypeEnum.true_false
      ) {
        // True/False special: check if option matches correctAnswer
        if (typeEnum === QuestionTypeEnum.true_false) {
          isCorrect = correctAnswers.includes(opt.replace('EXAMS.', '').toLowerCase());
          console.log(correctAnswers,"correct answer of true/false")
        } else {
          // multiple choice / response
          isCorrect = correctAnswers.includes(opt.toString().trim());
        }
      }

      return { option: opt, isCorrect };
    });
  }

  return {
    type: typeEnum,
    question: row.question ?? '',
    objectiveId:0,
    correctAnswer: typeEnum === QuestionTypeEnum.multiple_choice ? undefined : row['correct answer'],
    ...(options && options.length > 0 && { options }),
    ...(leftSide.length > 0 && { leftSide }),
    ...(rightSide.length > 0 && { rightSide })
  };
}


//maps an array of rows to an array of QuestionVM objects
  static mapRowsToQuestions(rows: any[]): QuestionVM[] {
    return rows.map(row => this.mapRowToQuestion(row));
  }
}