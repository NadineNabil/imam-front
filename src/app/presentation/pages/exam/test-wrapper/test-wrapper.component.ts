import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-test-wrapper',
  templateUrl: './test-wrapper.component.html',
  styleUrl: './test-wrapper.component.scss',
  standalone: false
})
export class TestWrapperComponent implements OnInit {
  verified = false;
  isExamMode = false;
  isAgree:boolean=false
 isTermsAccepted:boolean=false
 examId!: number;



  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
/*     const routePath = this.route.snapshot.routeConfig?.path || '';
    this.isExamMode = routePath.startsWith('exam');
   */
    /*
    this.route.paramMap.subscribe(params => {
  const userId = params.get('userId');

  if (userId) {
    const existing = localStorage.getItem('userData');

    const userData = existing ? JSON.parse(existing) : {};
    userData.id = userId;

    localStorage.setItem('userData', JSON.stringify(userData));
  }
});
*/
  this.examId = Number(this.route.snapshot.paramMap.get('id'));

  }

  onVerificationCompleted(event:boolean){
    this.verified=event;
  }
 start(){
  this.isAgree=true
 }
 
}