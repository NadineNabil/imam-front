import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiConfig } from 'src/app/data/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  silentMode = false;
  // whether the exam is currently active; components should respect this flag
  examActive: boolean = true;
  videoRef: any;
  private currentStream: MediaStream | null = null;
  private cameraMonitorHandle: any = null;
 // violation event
  private SamePersonViolation = new Subject<any>();

  // observable for components to listen to
  violation$ = this.SamePersonViolation.asObservable();

 
  constructor(private http: HttpClient,readonly apiConfig:ApiConfig,) {}
  
  getRandomInterval(): number {
    //return (60 + Math.random() * 60) * 1000;
    return 60 * 1000;
  }

  setCameraStream(stream: MediaStream | null) {
    this.currentStream = stream;
    if (!stream) {
      this.activeCameraId = null;
      return;
    }

    this.examActive = true;
    const track = stream.getVideoTracks()[0];
    this.activeCameraId = track?.getSettings().deviceId || null;
  }

  stopCamera() {
    this.examActive = false;

    if (this.cameraMonitorHandle) {
      clearInterval(this.cameraMonitorHandle);
      this.cameraMonitorHandle = null;
    }

    if (this.currentStream) {
      this.currentStream.getTracks().forEach(track => track.stop());
      this.currentStream = null;
    }

    this.activeCameraId = null;
  }

  logPhoto(timestamp: string, data: string) {
    if (!this.examActive) return;

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const localUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = (currentUser?.id ?? currentUser?.user_id ?? localUser?.id ?? localUser?.user_id)?.toString() || '';

    if (!userId) return;

    const payload = {
      user_id: userId,
      image: data
    };

    //verify in api
    this.http.post(this.apiConfig.getAiUrl(this.apiConfig.endpoints.exam.verify), payload).subscribe({
      next: (res: any) => {

        if (!res['same_person']) {
          //send violation to test_my_self_page 
          // emit event
          this.SamePersonViolation.next({
            timestamp,
            response: false,
            err: 'not_same_person'
          });
        }

      },
      error: (err) => {
        //No face detected in the image
        this.SamePersonViolation.next({
          timestamp,
          response: false,
          err: 'No face detected in the image'
        });
      }
    });
  }

  notify() {

    if (this.silentMode) return;

    document.body.style.backgroundColor = 'white';
    setTimeout(() => (document.body.style.backgroundColor = ''), 100);

    const audio = new Audio('assets/audio/camera.wav');
    audio.play();
  }


  /************* check Multiple Camera *************** */
   initCameraSecurity(videoRef: any) {

   
      this.checkMultipleCameras();
      this.monitorCamera(videoRef);
  // this.blockSwitch(); // optional
}

async getCameras(): Promise<MediaDeviceInfo[]> {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter(d => d.kind === 'videoinput');
}

async checkMultipleCameras() {
  const cameras = await this.getCameras();

  console.log('Available cameras:', cameras);

  if (cameras.length > 1) {
    console.warn('⚠ Multiple cameras detected');
  }

  return cameras;
}


activeCameraId: string | null = null;

async startCamera(deviceId?: string) {
  const constraints: any = {
    video: deviceId ? { deviceId: { exact: deviceId } } : true
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  const track = stream.getVideoTracks()[0];
  this.activeCameraId = track.getSettings().deviceId || null;

  console.log('🎥 Active camera:', this.activeCameraId);

  this.videoRef.nativeElement.srcObject = stream;
}

monitorCamera(videoRef: any) {
  if (this.cameraMonitorHandle) {
    clearInterval(this.cameraMonitorHandle);
  }

  this.cameraMonitorHandle = setInterval(() => {
    if (!this.examActive) {
      clearInterval(this.cameraMonitorHandle);
      this.cameraMonitorHandle = null;
      return;
    }

    const stream = this.currentStream || videoRef;
    if (!stream) return;

    const track = stream.getVideoTracks?.()[0];
    if (!track) return;

    const currentId = track.getSettings().deviceId;

    if (this.activeCameraId && currentId !== this.activeCameraId) {
      console.warn('🚨 Camera switched!');
      this.logSwitch(this.activeCameraId, currentId);
    }
  }, 2000);
}

logSwitch(oldId: string, newId: any) {
  const timestamp = new Date().toISOString();

  console.log('Camera switch detected:', {
    from: oldId,
    to: newId,
    time: timestamp
  });
}

//optional 
blockSwitch() {
  setInterval(() => {
    const video = this.videoRef.nativeElement;
    const stream = video.srcObject as MediaStream;

    if (!stream) return;

    const track = stream.getVideoTracks()[0];
    const currentId = track.getSettings().deviceId;

    if (this.activeCameraId && currentId !== this.activeCameraId) {
      console.warn('⛔ Switching blocked, reverting...');

      this.startCamera(this.activeCameraId);
    }
  }, 2000);
}


}
