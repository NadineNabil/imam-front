import { of } from 'rxjs';
import { ExamJourneyComponent } from './exam-journey.component';

describe('ExamJourneyComponent', () => {
  it('maps API response into exam journey items', () => {
    const courseBusiness = {
      getCoursesWithLastExam: jasmine.createSpy('getCoursesWithLastExam').and.returnValue(of([]))
    };

    const component = new ExamJourneyComponent(courseBusiness as any);
    const payload = [
      {
        id: 10,
        name: 'Course A',
        description: 'A sample course',
        last_exam: {
          name: 'Exam A',
          duration: 30,
          completed_at: '2026-07-31'
        }
      }
    ];

    const exams = component.mapApiResponseToExams(payload as any);

    expect(exams.length).toBe(1);
    expect(exams[0].name).toBe('Course A');
    expect(exams[0].done).toBeTrue();
    expect(exams[0].completedDate).toContain('2026-07-31');
  });
});
