import { Component, EventEmitter, Input, OnInit, Output, Signal, WritableSignal, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Category } from 'src/app/domain/entities/category.entity';
import { Course } from 'src/app/domain/entities/course.entity';
import { LearningUnits } from 'src/app/domain/entities/learningUnits.entity';
import { SubCategory } from 'src/app/domain/entities/subCategory.entity';
import { ComplexityLevel } from 'src/app/domain/enums/complexity-levels.enum';
import { ExamSourceEnum } from 'src/app/domain/enums/exam-source.enum';
import { examtypes } from 'src/app/domain/enums/exam-types.enum';

@Component({
  selector: 'app-exam-basic-info',
  templateUrl: './exam-basic-info.component.html',
  styleUrl: './exam-basic-info.component.scss',
  standalone: false,
  

})
export class ExamBasicInfoComponent implements OnInit{
public ExamSourceEnum = ExamSourceEnum;
@Input() examForm!: FormGroup;
@Input() categories!:Signal<Category[]>; // <- signal from parent
@Input() courses!: Signal<Course[]>;
@Input() learningUnits!: Signal<LearningUnits[]>; // <- signal from parent
@Input() subCategories!: Signal<SubCategory[]>; // <- signal from parent
complexityLevels: { id: ComplexityLevel; complexityLevelName: string }[]=[];
examTypes:{id:examtypes}[]
@Output() categoryChanged = new EventEmitter<number>();
@Output()  subCategoryChanged= new EventEmitter<number>();
@Output()  CourseChanged= new EventEmitter<number>();
@Output()  learningUnitsChanged= new EventEmitter<number[]>();


constructor(private translate:TranslateService){
  this.complexityLevels = Object.values(ComplexityLevel).map(level => ({
  id: level,
  complexityLevelName: level
}));
  this.examTypes = Object.values(examtypes).map(type => ({
  id: type,
}));
}
ngOnInit() {
  this.examForm.get('learningUnit')?.valueChanges.subscribe((value: number[]) => {
    if (!value) return;

    if (value.includes(-1) && value.length > 1) {
      this.examForm.get('learningUnit')?.setValue([-1], { emitEvent: false });
    }
  });
}
  onCategoryChange(category: Category) {
   this.examForm.get('learningUnit')?.setValue([]);
   this.categoryChanged.emit(category?.id);
  }
    onSubCategoryChange(subCategory: SubCategory) {
   this.subCategoryChanged.emit(subCategory?.id);
  }
  onCourseChange(course:Course){
     this.examForm.get('learningUnit')?.setValue([]);
    this.CourseChanged.emit(course?.id)
  }
    onUnitsChanges(learningUnits: LearningUnits[]){
      console.log(learningUnits,'learninunit')
        const arr = learningUnits.map(x => x.id);
    this.learningUnitsChanged.emit(arr) 
 

  }
  get examNameControl() {
  return this.examForm.get('examName');
}
onGeneratedSelected(): void {
(this.examForm.get('questions') as FormArray).clear();
 const objectives = this.examForm.get('objectives') as FormArray;

  const firstObjective = objectives.at(0);

  const hasFile = !!firstObjective?.get('filename')?.value;

  if (!hasFile) {
    this.examForm.patchValue({
      aiQuestionRatio: 100,
      sourceMaterialRatio: 0,
      hasKnoledgeSource: false
    });

    this.examForm.get('aiQuestionRatio')?.disable({ emitEvent: false });
    this.examForm.get('sourceMaterialRatio')?.disable({ emitEvent: false });
  } else {
    this.examForm.patchValue({
      aiQuestionRatio: 0,
      sourceMaterialRatio: 100,
      hasKnoledgeSource: true
    });

    this.examForm.get('aiQuestionRatio')?.enable({ emitEvent: false });
    this.examForm.get('sourceMaterialRatio')?.enable({ emitEvent: false });
  }
}
onManualSelected(): void {
  const objectives = this.examForm.get('objectives') as FormArray;

  objectives.controls.forEach(control => {
    const weight = control.get('weight');

    weight?.clearValidators();
    weight?.updateValueAndValidity();
  });
}
}