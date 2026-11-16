import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CameraService } from '../../services/camera.service';



@Component({
  selector: 'app-camera-capture-component',
  standalone: true,
  imports: [],
  templateUrl: './camera-capture-component.component.html',
  styleUrl: './camera-capture-component.component.scss'
})
export class CameraCaptureComponentComponent implements AfterViewInit, OnDestroy {
  private faceMonitorHandle: any = null;
  private modelsLoaded = false;
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(private cameraService: CameraService) {}

  async ngAfterViewInit() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.cameraService.setCameraStream(stream);
    this.videoRef.nativeElement.srcObject = stream;

    // wait until the video element has loaded metadata and started playing
    await new Promise<void>(resolve => {
      const videoEl: HTMLVideoElement = this.videoRef.nativeElement;
      const onLoaded = () => {
        videoEl.play().finally(() => resolve());
      };
      if (videoEl.readyState >= 1) {
        videoEl.play().finally(() => resolve());
      } else {
        videoEl.onloadedmetadata = onLoaded;
      }
    });

    this.cameraService.examActive = true;
    // initial capture once video stream is ready
    setTimeout(() => this.capture(), 2000);
    this.cameraService.initCameraSecurity(stream);
  }

  ngOnDestroy(): void {
    this.cameraService.stopCamera();
   }




/*
  private captureAndLog(reason: string) {
    try {
      const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
      const video = this.videoRef.nativeElement as HTMLVideoElement;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const data = canvas.toDataURL('image/png');
      this.cameraService.logPhoto(new Date().toISOString() + '|' + reason, data);
      this.cameraService.notify();
    } catch (e) {
      console.error('Failed to capture evidence', e);
    }
  }
   */ 

  capture() {
    // stop capturing if exam isn't active
    try {
      if (!this.cameraService.examActive) return;
    } catch (e) {}

    if (!this.videoRef?.nativeElement) return;

    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    const timestamp = new Date().toISOString();
    const data = canvas.toDataURL('image/png');


 
      this.cameraService.logPhoto(timestamp, data);
      this.cameraService.notify();
      // schedule next only if exam still active
      if (this.cameraService.examActive) this.scheduleNext();
    
  }

  scheduleNext() {
    // if exam becomes inactive before timeout, capture() will early-return
    setTimeout(() => this.capture(), this.cameraService.getRandomInterval());
  }

}
