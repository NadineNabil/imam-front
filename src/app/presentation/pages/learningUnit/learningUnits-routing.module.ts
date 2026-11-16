import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditlearningUnitComponent } from './edit-learningUnit/edit-learningUnit.component';
import { AddlearningUnitComponent } from './add-learningUnit/add-learningUnit.component';
import { ViewLearningUnitsComponent } from './view-learningUnits/view-learningUnits.component';

const routes: Routes = [
  { path: 'AlllearningUnits/:id', component: ViewLearningUnitsComponent },
  { path: 'addlearningUnit/:courseId', component: AddlearningUnitComponent },
  { path: 'learningUnit-details/:id' ,component:EditlearningUnitComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class learningUnitsRoutingModule { }
