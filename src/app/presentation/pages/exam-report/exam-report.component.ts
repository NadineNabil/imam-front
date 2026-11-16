import { Component, Input } from '@angular/core';

export interface MeasuredSkill {
  name: string;
  score: number;
  type?: 'strength' | 'improvement' | 'neutral';
}

export interface RecommendationItem {
  icon: string;
  text: string;
}

export interface ExamReportData {
  score: number;
  summary: string;
  strengthsCount: number;
  improvementsCount: number;
  overallScore: number;
  measuredSkills: MeasuredSkill[];
  strengths: string[];
  improvements: string[];
  recommendations: RecommendationItem[];
}

@Component({
  selector: 'app-exam-report',
  templateUrl: './exam-report.component.html',
  styleUrl: './exam-report.component.scss',
  standalone: false
})
export class ExamReportComponent {

  @Input() report:any;
  
  /* ExamReportData = {
    score: 82,
    summary: 'تحليل ممتاز مع تفكير منطقي قوي وقدرة على التعامل مع الأنماط المعقدة. يُنصح بتطوير مهارات التواصل وتطبيق المعرفة التقنية.',
    strengthsCount: 4,
    improvementsCount: 1,
    overallScore: 82,
    measuredSkills: [
      { name: 'حل المشكلات', score: 79, type: 'strength' },
      { name: 'التفكير التحليلي', score: 84, type: 'strength' },
      { name: 'التعرف على الأنماط', score: 87, type: 'strength' },
      { name: 'التفكير المنطقي', score: 91, type: 'strength' },
      { name: 'التفكير المكاني', score: 54, type: 'improvement' },
      { name: 'التفكير النقدي', score: 68, type: 'neutral' },
      { name: 'الاستدلال الرقمي', score: 72, type: 'neutral' }
    ],
    strengths: ['حل المشكلات', 'التفكير التحليلي', 'التعرف على الأنماط', 'التفكير المنطقي'],
    improvements: ['التفكير المكاني'],
    recommendations: [
      { icon: 'icon1', text: 'خذ اختباراً تجريبياً آخر لتحسين نتيجتك' },
      { icon: 'icon2', text: 'حل ألغاز الأنماط والتسلسلات' },
      { icon: 'icon3', text: 'مارس تمارين الاستدلال المنطقي يومياً' }
    ]
  };



  <div class="report-container" *ngIf="report" dir="rtl">

  <!-- Summary & Score Gauge Header -->
  <div class="summary-card">
    <div class="d-flex align-items-start gap-4 flex-wrap justify-content-center">

      <!-- Right Section (RTL): Donut Gauge -->
      <div class="donut-col flex-shrink-0">
        <div class="score-donut-wrapper">
          <svg class="score-donut" viewBox="0 0 36 36">
            <path
              class="circle-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              class="circle-fill"
              [attr.stroke-dasharray]="report.score + ', 100'"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div class="donut-inner">
            <span class="donut-score">{{ report.score }}%</span>
            <span class="donut-label">النتيجة</span>
          </div>
        </div>
      </div>

      <!-- Left Section (RTL): Title, Description, Stats -->
      <div class="summary-content flex-grow-1">

        <!-- Title Row -->
        <div class="summary-header d-flex align-items-center gap-2 mb-2">
          <i class="pi pi-sparkles summary-icon"></i>
          <h5 class="summary-title m-0">ملخص الأداء</h5>
        </div>

        <!-- Description -->
        <p class="summary-description">{{ report.summary }}</p>

        <!-- Inline Stats: score%, strengths, improvements -->
        <div class="inline-stats d-flex align-items-end gap-4">

          <div class="inline-stat purple">
            <span class="stat-val">{{ report.overallScore }}%</span>
            <span class="stat-lbl">النتيجة الكلية</span>
          </div>

          <div class="inline-stat green">
            <span class="stat-val">{{ report.strengthsCount }}</span>
            <span class="stat-lbl">نقاط قوة</span>
          </div>

          <div class="inline-stat orange">
            <span class="stat-val">{{ report.improvementsCount }}</span>
            <span class="stat-lbl">مجالات تحسين</span>
          </div>

        </div>

      </div>

    </div>
  </div>

  <!-- Measured Skills Section -->
  <div class="report-section mt-4">
    <h6 class="section-heading mb-3">المهارات المقيّسة</h6>

    <div class="skills-pills-wrap d-flex flex-wrap gap-2">
      <div
        *ngFor="let skill of report.measuredSkills"
        class="skill-pill"
        [ngClass]="{
          'strength': skill.type === 'strength',
          'improvement': skill.type === 'improvement',
          'neutral': skill.type === 'neutral'
        }">
        <span class="dot"></span>
        <span class="score-val">{{ skill.score }}%</span>
        <span class="skill-name">{{ skill.name }}</span>
      </div>
    </div>
  </div>

  <!-- Strengths & Improvements Grouped Section -->
  <div class="report-section mt-4">
    <div class="row g-3">

      <!-- Strengths Group -->
      <div class="col-md-7">
        <div class="group-box strengths-box d-flex align-items-center gap-2 flex-wrap">
          <span class="group-pill green-pill">نقاط القوة</span>
          <span *ngFor="let item of report.strengths" class="item-tag green-tag">
            {{ item }}
          </span>
        </div>
      </div>

      <!-- Improvements Group -->
      <div class="col-md-5">
        <div class="group-box improvements-box d-flex align-items-center gap-2 flex-wrap">
          <span class="group-pill yellow-pill">مجالات التحسين</span>
          <span *ngFor="let item of report.improvements" class="item-tag yellow-tag">
            {{ item }}
          </span>
        </div>
      </div>

    </div>
  </div>

  <!-- Customized Recommendations Section -->
  <div class="report-section mt-4">
    <h6 class="section-heading mb-3">توصيات مخصصة</h6>

    <div class="row g-3">
      <div *ngFor="let rec of report.recommendations" class="col-md-4">
        <div class="rec-card d-flex align-items-center gap-2">
          <div class="rec-icon">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_7278_2466)">
<path d="M11.9168 3.79102L7.31266 8.39518L4.60433 5.68685L1.0835 9.20768" stroke="#5B4FCF" stroke-width="1.08333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.6665 3.79102H11.9165V7.04102" stroke="#5B4FCF" stroke-width="1.08333" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_7278_2466">
<rect width="13" height="13" fill="white"/>
</clipPath>
</defs>
</svg>

          </div>
          <span class="rec-text">{{ rec.text }}</span>
        </div>
      </div>
    </div>
  </div>

</div>
-->*/
}
