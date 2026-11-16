import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiConfig } from 'src/app/data/config/api.config';
type CameraStatus = 'idle' | 'ok' | 'denied' | 'notfound' | 'error';


@Component({
  selector: 'app-identity-verificationn',
  templateUrl: './identity-verificationn.component.html',
  styleUrl: './identity-verificationn.component.scss',
  standalone: false
})
export class IdentityVerificationnComponent {
@Output() verificationCompleted = new EventEmitter<boolean>();
@ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
currentStep=1;
isVerified = false;

@ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;

  cameraStatus: CameraStatus = 'idle';
  stream: MediaStream | null = null;
  brightnessCheckFailed: boolean=false;
  timer = 5;
  interval: any;
  rightCaptured = false;
  loading: boolean=false;
  verificationStepFailed: boolean=false;
  errMsg: any;

 constructor(private cdr: ChangeDetectorRef,private translate:TranslateService,readonly apiConfig:ApiConfig,
  private http: HttpClient,private router: Router
 ){
     
 
          
/*           if(userData.id == undefined){
 */ /*          
            const uniqueId = crypto.randomUUID  ? crypto.randomUUID() // modern browsers
              : 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9)
                userData.id=uniqueId
              
                localStorage.setItem('userData',JSON.stringify(userData)) */
/*                 this.router.navigate(['/login']);
 */
/*           }
 */

          // don't emit here — wait until the view is initialized where ViewChilds are ready
          

 }

  async ngAfterViewInit() {
    

    this.checkCamera();

    
    // if verified flag exists from a prior run, mark verified and emit after view init


  }

  async checkCamera() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();


           
      const hasCamera = devices.some(d => d.kind === 'videoinput');

      if (!hasCamera) {
        this.cameraStatus = 'notfound';
        
        return;
      }

      await this.requestCamera();
   
    } catch (err) {
      this.cameraStatus = 'error';
    
    }
  }

  async requestCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

        // trigger permission popup first
              await navigator.mediaDevices.getUserMedia({ audio: true });

              
      this.videoRef.nativeElement.srcObject = this.stream;
       await new Promise(resolve => {
      this.videoRef.nativeElement.onloadedmetadata = () => {
        this.videoRef.nativeElement.play();
        resolve(true);
      };
    });

      this.cameraStatus = 'ok';

         this.validateLighting();

    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        this.cameraStatus = 'denied';
      } else {
        this.cameraStatus = 'error';
      }

     
    }
    this.cdr.detectChanges();
  }

  retryCamera() {
    this.requestCamera();
  }


  ngOnDestroy() {
    this.stream?.getTracks().forEach(t => t.stop());
    clearInterval(this.interval);
  }

  captureImage(): string {
    const video = this.videoRef.nativeElement;
    const canvas = this.canvas.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/png'); // 📸 صورة Base64
  }

  checkBrightness(): number {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let totalBrightness = 0;

    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];

      // luminance formula
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      totalBrightness += brightness;
    }

    const avgBrightness = totalBrightness / (imageData.data.length / 4);
    return avgBrightness;
  }

  validateLighting() {
    this.captureImage();
   
    const brightness = this.checkBrightness();

   
    if (brightness < 80) {
      this.brightnessCheckFailed = true;
      return false;
    }
    else {
      this.brightnessCheckFailed = false;
    }

    return true;
  }


 toStep2() {
     
     if (this.cameraStatus !== 'ok') {
        alert(this.translate.instant('identity_verification.camera_required'));
        return;
      }

      this.validateLighting();

      if(!this.brightnessCheckFailed){
      

        this.currentStep = 2;
         this.startTimer();
      //this.requestFullscreen();
      //this.verificationCompleted.emit(true);
  }
    
  }

  getStepLabel(step: number): string {
  return this.currentStep > step ? '✔'  : step.toString();
}


  requestFullscreen() {
  const elem = document.documentElement as any;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}




startTimer() {
   
  this.timer = 5;

  this.interval = setInterval(() => {
    this.timer--;

    if (this.timer <= 0) {
      
      clearInterval(this.interval);
      
       // 🔊 صوت
      this.playBeep();
      // 📸 التقاط صورة
      const image = this.captureImage();
      
      this.onTimerFinished();
    }
  }, 1000);
}

onTimerFinished() {


  // مثال: الانتقال للخطوة التالية
  if(this.currentStep == 2 && !this.rightCaptured){

    this.rightCaptured = true;    
      this.timer = 5;
    this.startTimer();
  }
  else{
    this.currentStep = 3;
  }
}


playBeep() {
  const audio = new Audio('assets/audio/camera.wav'); // ضع الملف في assets
  audio.play();
}


verifyIdentity(){
  
        

  this.loading = true;

       //  صوت
      this.playBeep();
      //  التقاط صورة
      const image = this.captureImage();

      const userId =
         JSON.parse(sessionStorage.getItem('currentUser') || '{}').id ??
         JSON.parse(localStorage.getItem('currentUser') || '{}').id;
     var payload={
      user_id: userId?.toString(),
      image: image
     }
        
     
    this.requestFullscreen();
    this.http.post(this.apiConfig.getAiImageUrl(this.apiConfig.endpoints.exam.enroll), payload).subscribe({
      next: (res) => {
          this.currentStep=4;
          this.verificationStepFailed = false;
          this.loading = false;
          this.isVerified = true;
         
         /*  localStorage.setItem("isVerified", "true"); */
          this.verificationCompleted.emit(true);
       
      },
      error: (err) => {
          if (!this.isOnline()) {
         this.errMsg = this.translate.instant('identity_verification.no_internet');          
        }
        else
          {
  this.errMsg = this.translate.instant('identity_verification.retry_verification');          }
          this.loading = false;
        this.verificationStepFailed = true;
        
      }
    });
}   
      
   
isOnline(): boolean {
  return navigator.onLine;
}


}
