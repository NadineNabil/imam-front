import { Component } from '@angular/core';
import { CameraService } from '../../services/camera.service';
import { CommonModule } from '@angular/common';
import { CameraCaptureComponentComponent } from '../camera-capture-component/camera-capture-component.component';

@Component({
  selector: 'app-floating-camera-widget',
  standalone: true,
  imports: [CameraCaptureComponentComponent,CommonModule],
  templateUrl: './floating-camera-widget.component.html',
  styleUrl: './floating-camera-widget.component.scss'
})
export class FloatingCameraWidgetComponent {
constructor(public cameraService: CameraService) {}

  isVisible = true;



  toggleSilent() {
    this.cameraService.silentMode = !this.cameraService.silentMode;
  }

  close() {
    this.isVisible = false;
  }


  /*
        Created a camera system in Angular that captures photos at random 1–2 minute intervals
        Each photo is tagged with a timestamp and logged to the console
        Added an option for silent mode or notification (flash + sound)
        Built a floating mini video dialog fixed at the top-right corner
        Split everything into separate parts for clean structure:
        Service → handles logic (timing, logging, notifications)
        Capture component → handles webcam and photo capture
        Widget component → handles UI (floating dialog, buttons)
  */
}
