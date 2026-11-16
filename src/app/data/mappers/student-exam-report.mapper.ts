import {
  StudentExamReport,
  StudentObjectiveReport,
  StudentQuestionAnswerReport,
  QuestionAnswerStatus
} from 'src/app/domain/entities/student-exam-report.entity';

export class StudentExamReportMapper {
  public static mapToDomain(res: any, targetExamId: number): StudentExamReport {
    if (!res) {
      return this.createEmptyReport(targetExamId);
    }

    const reportList: any[] = Array.isArray(res) ? res : [res];

    if (reportList.length === 0) {
      return this.createEmptyReport(targetExamId);
    }

    const mappedAttempts: StudentExamReport[] = reportList.map((data, index) =>
      this.mapSingleAttempt(data, index + 1, targetExamId)
    );

    const primaryReport = mappedAttempts[0];
    primaryReport.allAttempts = mappedAttempts;
    return primaryReport;
  }

  private static mapSingleAttempt(data: any, attemptNum: number, fallbackExamId: number): StudentExamReport {
    const rawObjectives: any[] = data.studentExamObjectives || data.studentTrainingObjectives || data.objectives || [];
    
    let totalQuestions = data.total_questions ?? data.totalQuestions ?? data.questionsCount ?? 0;
    let correctAnswers = data.correct_answers ?? data.correctAnswers ?? data.correctAnswerCount ?? 0;
    let wrongAnswers = data.incorrect_answers ?? data.wrongAnswers ?? 0;
    let skippedAnswers = data.unanswered_questions ?? data.skippedAnswers ?? 0;

    let computedSkipped = 0;
    let computedWrong = 0;
    let computedCorrect = 0;

    const mappedObjectives: StudentObjectiveReport[] = rawObjectives.map((obj, oIndex) => {
      const objName = obj.ObjectiveName || obj.objectiveName || obj.objective_name || obj.objective || `Objective ${oIndex + 1}`;
      const rawQuestions: any[] = obj.studentQuestionAnswers || obj.student_question_answers || obj.questions || [];

      let objCorrect = 0;
      let objWrong = 0;
      let objSkipped = 0;

      const questions: StudentQuestionAnswerReport[] = rawQuestions.map((q, qIndex) => {
        const questionText = q.QuestionText || q.questionText || q.question || `Question ${qIndex + 1}`;
        const isCorrect = q.IsCorrect ?? q.isCorrect ?? q.is_correct ?? null;
        const userAnswer = q.StudentAnswer ?? q.studentAnswer ?? q.userAnswer ?? q.user_answer ?? null;
        const correctAnswer = q.CorrectAnswer ?? q.correctAnswer ?? q.correctAnswerText ?? q.correct_answer ?? null;
        const explanation = q.explain || q.explanation || null;
        const videoUrl = q.videoUrl || q.video_url || null;

        let status: QuestionAnswerStatus;
        if (isCorrect === true) {
          status = 'correct';
          objCorrect++;
        } else {
          // Check if answered or skipped
          const hasAnswer = userAnswer !== null && userAnswer !== undefined && String(userAnswer).trim() !== '';
          if (hasAnswer) {
            status = 'wrong';
            objWrong++;
          } else {
            status = 'skipped';
            objSkipped++;
          }
        }

        return {
          id: qIndex + 1,
          questionText,
          isCorrect,
          userAnswer,
          correctAnswer,
          explanation,
          videoUrl,
          status
        };
      });

      const objTotal = rawQuestions.length || obj.total_questions || obj.questionsCount || (objCorrect + objWrong + objSkipped);
      const objPercent = objTotal > 0 ? Math.round((objCorrect / objTotal) * 100) : 0;

      computedCorrect += objCorrect;
      computedWrong += objWrong;
      computedSkipped += objSkipped;

      return {
        objectiveName: objName,
        totalQuestions: objTotal,
        correctAnswers: obj.correct_answers ?? objCorrect,
        wrongAnswers: obj.incorrect_answers ?? objWrong,
        skippedAnswers: obj.unanswered_questions ?? objSkipped,
        percent: objPercent,
        color: this.getPercentColor(objPercent),
        questions
      };
    });



    const scorePercent = typeof data.student_score === 'number'
      ? Math.round(data.student_score)
      : (typeof data.score === 'number' ? Math.round(data.score) : (totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0));

    const passPercentage = data.pass_percentage ?? data.passPercentage ?? 50;
    const isPassed = typeof data.is_passed === 'boolean'
      ? data.is_passed
      : (typeof data.isPassed === 'boolean' ? data.isPassed : scorePercent >= passPercentage);

    const rawTime = data.duration_seconds ?? data.durationSeconds ?? data.time_taken ?? data.timeTaken ?? data.durationMinutes;
    const timeTakenFormatted = this.formatTimeTaken(rawTime);

    return {
      examId: data.exam_id || data.examId || fallbackExamId,
      attemptId: data.attempt_id ?? data.exam_attempt_id ?? data.examAttemptId ?? data.student_exam_id ?? null,
      examName: data.exam_name || data.examName || undefined,
      attemptNumber: data.attempt_number || data.attemptNumber || attemptNum,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      skippedAnswers,
      scorePercent,
      isPassed,
      passPercentage,
      durationSeconds: rawTime,
      timeTakenFormatted,
      objectives: mappedObjectives
    };
  }

  private static getPercentColor(percent: number): string {
    if (percent >= 85) return '#5156be'; // primary green/theme
    if (percent >= 50) return '#ffbf53'; // yellow/orange
    return '#fd625e'; // red
  }

  private static formatTimeTaken(timeVal: any): string | undefined {
    if (timeVal === undefined || timeVal === null || timeVal === 'None' || timeVal === '0') return undefined;
    if (typeof timeVal === 'string' && !isNaN(Number(timeVal))) {
      timeVal = Number(timeVal);
    }
    if (typeof timeVal === 'number') {
      const minutes = Math.floor(timeVal / 60);
      const seconds = Math.round(timeVal % 60);
      if (minutes > 0 && seconds > 0) return `${minutes}m ${seconds}s`;
      if (minutes > 0) return `${minutes} mins`;
      return `${seconds}s`;
    }
    if (typeof timeVal === 'string') return timeVal;
    return undefined;
  }

  private static createEmptyReport(examId: number): StudentExamReport {
    return {
      examId,
      attemptNumber: 1,
      totalQuestions: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      skippedAnswers: 0,
      scorePercent: 0,
      isPassed: false,
      passPercentage: 50,
      objectives: [],
      allAttempts: []
    };
  }
}
