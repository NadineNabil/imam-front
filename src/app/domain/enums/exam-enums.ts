export enum ResponseTypeEnum {
  SINGLE_CHOICE  =1,
    MULTIPLE_CHOICE =2 ,
    VOICE_ANSWER =3,
    WRITING_ANSWER=4 ,
    VIDEO_ANSWER=5
    // VIDEO_ANSWER = 'videoAnswer' // Optional: remove if not needed
}

export enum QuestionTypeEnum {
    multiple_choice = 1,
  multiple_response = 2,
  true_false = 3,
  short_answer = 4,
  essay = 5,
  fill_blank = 6,
   Matching = 7,
  Sequence = 8,
/*   Hotspot = 9, */
  DragAndDrop = 10,
  Numeric = 11,
  CaseStudy = 12,
  Computational = 13,
  Comparative = 14, 
}
export enum CognitiveStyle {
  Create = 0,
  Evaluate = 1,
  Analyze = 2,
  Apply = 3,
  Understand = 4,
  Remember = 5
}
export enum complexityLevels{
  Easy =0,
  Medium =1 ,
  Hard =2
}
export  enum examtypes{
      Training=1,
      Assessment=2,
}