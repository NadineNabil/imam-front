import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StudentService } from 'src/app/data/api/student-api.service';
import { Subscription } from 'rxjs';
import { StudentCourseApiResponseDto } from 'src/app/data/dto/response/student-dashboard.response.dto';
import { EChartsOption } from 'echarts';
import { examtypes } from 'src/app/domain/enums/exam-types.enum';

interface CourseExam {
  id: number;
  name: string;
  type: 'Training' | 'Assessment';
  durationMinutes: number;
  scheduledDate: string | null;
  status: string;
  score: number | null;
  passed: boolean | null;
  attempts?: number | null;
  trainingScores?: number[] | null;
}

@Component({
  selector: 'app-student-course-details',
  templateUrl: './student-course-details.component.html',
  styleUrls: ['./student-course-details.component.scss'],
  standalone: false
})
export class StudentCourseDetailsComponent implements OnInit, OnDestroy {
  courseId!: number;
  courseName = '';
  categoryName = '';
  subcategoryName = '';
  isLoading = true;
 collectionId:string=''
  exams: CourseExam[] = [];
  trainingExams: CourseExam[] = [];

  // Metrics
  masteryRate = 0;
  examsTaken = 0;
  totalExams = 0;
  averageScore = 0;

  // Chart state
  hasTrainingAttempts = false;
  public chartOptions!: EChartsOption;

  private routeSub!: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly translate: TranslateService,
    private readonly studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.courseId = +params['id'];
      this.loadCourseDetails();
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  // ─── Data Loading ───────────────────────────────────────────────────────────

  loadCourseDetails(): void {
    this.isLoading = true;

    this.studentService.getStudentCourse(this.courseId).subscribe({
      next: (data) => {
        this.courseName = data.course_name ?? '';
        this.categoryName = data.category_name ?? '';
        this.subcategoryName = data.subcategory_name ?? '';
        this.collectionId = data.collection_id??'';

        this.buildExamList(data);
        this.calculateMetrics(data);
        this.isLoading = false;
      },
      error: () => {
        const isAr = this.translate.currentLang === 'ar';
        this.courseName = isAr ? 'الذكاء الاصطناعي' : 'Artificial Intelligence';

        this.buildExamList(null);
        this.calculateMetrics(null);
        this.isLoading = false;
      }
    });
  }

  buildExamList(data: StudentCourseApiResponseDto | null | undefined): void {
    const apiExams = data?.active_exams ?? [];
    this.exams = apiExams.map((exam) => {
      const rawScore = exam.latest_score;
      const numericScore = rawScore != null && rawScore !== '' ? Number(rawScore) : null;

      return {
        id: exam.exam_id,
        name: exam.exam_name,
        type: exam.exam_type === 'Assessment' ? 'Assessment' : 'Training',
        durationMinutes: Number(exam.timelimit_minutes ?? 0),
        scheduledDate: exam.scheduled_date ?? null,
        status: exam.exam_status ?? (exam.student_taken ? 'Submitted' : 'Not Started'),
        score: numericScore != null && !Number.isNaN(numericScore) ? Math.round(numericScore) : null,
        passed: numericScore != null && !Number.isNaN(numericScore) ? numericScore >= 60 : null,
        attempts: exam.attempts ?? 0
      };
    });

    const apiTrainingExams = data?.training_exams ?? [];
    console.log('API training_exams:', apiTrainingExams);
    this.trainingExams = apiTrainingExams.map((exam) => {
      const rawExam = exam as any;
      console.log('Raw exam object:', rawExam, '| training_scores:', rawExam.training_scores);

      const rawScore = exam.latest_score;
      const numericScore = rawScore != null && rawScore !== '' ? Number(rawScore) : null;

      const rawTrainingScores: string[] | null = rawExam.training_scores ?? null;
      const trainingScores = rawTrainingScores && rawTrainingScores.length > 0
        ? rawTrainingScores.map(s => Math.round(Number(s)))
        : null;

      return {
        id: exam.exam_id,
        name: exam.exam_name,
        type: exam.exam_type === 'Assessment' ? 'Assessment' : 'Training',
        durationMinutes: Number(exam.timelimit_minutes ?? 0),
        scheduledDate: exam.scheduled_date ?? null,
        status: exam.exam_status ?? (exam.student_taken ? 'Submitted' : 'Not Started'),
        score: numericScore != null && !Number.isNaN(numericScore) ? Math.round(numericScore) : null,
        passed: numericScore != null && !Number.isNaN(numericScore) ? numericScore >= 60 : null,
        attempts: exam.attempts ?? 0,
        trainingScores
      };
    });
    console.log('Mapped trainingExams:', this.trainingExams);
  }

  // ─── Metrics & Chart ────────────────────────────────────────────────────────

  calculateMetrics(data: StudentCourseApiResponseDto | null | undefined): void {
    const parsedMastery = data?.assessment_average_percentage != null && data.assessment_average_percentage !== ''
      ? Number(data.assessment_average_percentage)
      : 0;

    // this.examsTaken = this.exams.filter((exam) => exam.score != null || exam.status === 'Submitted' || exam.status === 'Active').length;
    this.totalExams = this.exams.length;
    this.masteryRate = Number.isFinite(parsedMastery) ? Math.round(parsedMastery) : 0;
    this.averageScore = this.exams.length > 0
      ? Math.round(this.exams.reduce((sum, exam) => sum + (exam.score ?? 0), 0) / this.exams.length)
      : 0;

    this.initChart();
  }

  initChart(): void {
    const isAr = this.translate.currentLang === 'ar';
    const flatAttempts: { name: string; score: number; attemptNumber: number }[] = [];

    for (const exam of this.trainingExams) {
      if (exam.trainingScores && exam.trainingScores.length > 0) {
        exam.trainingScores.forEach((score, index) => {
          flatAttempts.push({
            name: exam.name,
            score: score,
            attemptNumber: index + 1
          });
        });
      } else if (exam.score != null) {
        flatAttempts.push({
          name: exam.name,
          score: exam.score,
          attemptNumber: exam.attempts || 1
        });
      }
    }

    this.hasTrainingAttempts = flatAttempts.length > 0;

    console.log('flatAttempts inside initChart:', flatAttempts);

    if (!this.hasTrainingAttempts) {
      return; // No data — template will show the empty-state image
    }

    const categories = flatAttempts.map((att, index) => {
      // Show the exam name only for the first attempt of each exam
      if (index === 0 || flatAttempts[index - 1].name !== att.name) {
        return att.name.length > 15 ? att.name.substring(0, 12) + '...' : att.name;
      }
      return '';
    });

    const scoreData = flatAttempts.map((att) => att.score);

    this.chartOptions = {
      grid: {
        zlevel: 0,
        left: 50,
        right: 25,
        top: 50,
        bottom: 30,
        borderWidth: 0,
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(0,0,0,0)',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        },
        formatter: (params: any) => {
          if (!Array.isArray(params) || params.length === 0) {
            return '';
          }
          const p = params[0];
          const index = p.dataIndex;
          const attempt = flatAttempts[index];
          if (!attempt) return '';
          
          const attemptText = isAr ? `المحاولة ${attempt.attemptNumber}` : `Attempt ${attempt.attemptNumber}`;
          return `
            <div style="font-weight: bold; margin-bottom: 4px;">${attempt.name}</div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #5156be;"></span>
              <span>${attemptText}: <b>${p.value}%</b></span>
            </div>
          `;
        }
      },
      // legend: {
      //   data: [
      //     isAr ? 'الدرجة الأخيرة' : 'Latest Score'
      //   ],
      //   textStyle: { color: '#858d98' }
      // },
      color: ['#5156be'],
      xAxis: [
        {
          type: 'category',
          data: categories,
          axisLine: {
            lineStyle: {
              color: '#858d98'
            }
          },
          axisLabel: {
            color: '#858d98',
            fontSize: 11,
            interval: 0
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: isAr ? 'الدرجة (%)' : 'Score (%)',
          min: 0,
          max: 100,
          interval: 20,
          axisLine: {
            lineStyle: {
              color: '#858d98'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(133, 141, 152, 0.1)'
            }
          },
          axisLabel: {
            formatter: '{value}%',
            color: '#858d98',
            fontSize: 11
          }
        }
      ],
      series: [
        {
          name: isAr ? 'الدرجة الأخيرة' : 'Latest Score',
          type: 'line',
          data: scoreData,
          smooth: true,
          lineStyle: {
            width: 3
          },
          symbolSize: 6
        }
      ]
    };
  }

  // ─── Mastery helpers ────────────────────────────────────────────────────────

  getMasteryColorClass(): string {
    return 'text-success';
  }

  getMasteryStrokeColor(): string {
    return '#2ab57d'; // Theme green
  }

  getMasteryLabel(): string {
    const ar = this.translate.currentLang === 'ar';
    return ar ? 'متقن' : 'Mastered';
  }
  StartTrainingOrExam(examType:string,examId:number){
    if(examType===examtypes.Assessment){
  this.router.navigate(['exam', examId]);
    }else{
      this.router.navigate([`/training/${examId}`])
    }
  }
  StartChat(){
this.router.navigate([
  'chat',
  this.collectionId,
  this.courseName
]);  }
}
