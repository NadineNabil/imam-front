import { QuestionTypeEnum } from "src/app/domain/enums/question-type.enum";

/**
 * Maps each QuestionTypeEnum to its default icon/image.
 * This is purely a UI concern (presentation layer).
 */
export const QUESTION_TYPE_IMAGES: Partial<Record<QuestionTypeEnum, string>> = {
  [QuestionTypeEnum.multiple_choice]: 'assets/images/testing 1.svg',
/*   [QuestionTypeEnum.multiple_response]: 'assets/images/test 11.svg',
 */  [QuestionTypeEnum.true_false]: 'assets/images/multiple-choice 11.svg',
  [QuestionTypeEnum.short_answer]: 'assets/images/Frame 1984077529.svg',
  [QuestionTypeEnum.essay]: 'assets/images/exam 1.svg',
  [QuestionTypeEnum.fill_blank]: 'assets/images/3209366_caution_dot_more_square_wait_icon 1.svg',
/*   [QuestionTypeEnum.Matching]: 'assets/images/5574604_football_match_soccer_sport_sports_icon 1.svg',
  [QuestionTypeEnum.Sequence]: 'assets/images/6351910_ascnding_conversion_descending_filter_funnel_icon 1.svg',
  [QuestionTypeEnum.Hotspot]: 'assets/images/6125232_location_map_marker_navigation_pin_icon 1.svg', // optional
  [QuestionTypeEnum.DragAndDrop]: 'assets/images/drag-and-drop 1.png',
  [QuestionTypeEnum.Numeric]: 'assets/images/number 1.png',
  [QuestionTypeEnum.CaseStudy]: 'assets/images/file-case 1.png',
  [QuestionTypeEnum.Computational]: 'assets/images/analysis 1.png',
  [QuestionTypeEnum.Comparative]: 'assets/images/benchmarking 1.png' */
};
interface QuestionTypeConfig {
  hasOptions?: boolean;
  minOptions?: number;
  hasSides?: boolean;
  selectionStrategy?:string
  requiresCorrectAnswer?: boolean;
}

export const QUESTION_TYPE_CONFIG: Partial<Record<QuestionTypeEnum, QuestionTypeConfig>> = {
  [QuestionTypeEnum.multiple_choice]: {
    hasOptions: true,
    minOptions: 2,
    selectionStrategy: 'single',
    requiresCorrectAnswer: true
  },

/*   [QuestionTypeEnum.multiple_response]: {
    hasOptions: true,
    minOptions: 2,
    selectionStrategy: 'multi',
    requiresCorrectAnswer: true
  }, */

  [QuestionTypeEnum.true_false]: {
     hasOptions: true,
      minOptions: 2,
    requiresCorrectAnswer: true, 
     selectionStrategy: 'single',

  },

  [QuestionTypeEnum.short_answer]: {
    requiresCorrectAnswer: true
  },

  [QuestionTypeEnum.essay]: {},

  [QuestionTypeEnum.fill_blank]: {
    requiresCorrectAnswer: true
  },

/*   [QuestionTypeEnum.Matching]: {
    hasSides: true
  },

  [QuestionTypeEnum.DragAndDrop]: {
    hasSides: true
  },

  [QuestionTypeEnum.Numeric]: {
    requiresCorrectAnswer: true
  } */
};

