
export  class BaseOptionsSettings {
    constructor(
        public examId: number,
        public totalHours: number,
        public totalMinutes: number,
        public perQuestionMinutes: number|null,
        public perQuestionTimerActive: boolean,
        public disableCopy: boolean,
        public randomizeQuestionOrder: boolean,
        public randomizeAnswerChoices: boolean,
        public enableSpellCheck: boolean,
        public missingAnswerReminder: boolean,
         public limitedAttempts: boolean,
    public attemptsNumber: number|null|string
    ) { }

}