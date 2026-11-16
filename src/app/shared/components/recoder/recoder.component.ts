import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.js';

@Component({
  selector: 'app-recoder',
  templateUrl: './recoder.component.html',
  styleUrl: './recoder.component.scss',
  imports: [CommonModule]
})
export class RecoderComponent {
  @ViewChild('waveform', { static: false }) waveformRef!: ElementRef;
  @Output() recordingCompleted = new EventEmitter<{ audioUrl: string, audioFile: File }>();
  @Output() recordingDeleted = new EventEmitter<void>();

  audioChunks: Blob[] = [];
  audioUrl: string | null = null;
  isRecording = false;
  isPlaying = false;
  waveSurfer: any;
  recordPlugin: any;
  audioFile: File | undefined;
  thereIsRecord = false;
  startRecordFlag = false;
  recordingDuration = 0;
  formattedRecordingTime = '0:00';

  async startRecording(): Promise<void> {
    this.startRecordFlag = true;
    this.thereIsRecord = true;

    this.prepareSound();

    this.recordingDuration = 0;
    this.updateFormattedTime();

    try {
      await this.recordPlugin.startRecording();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not start audio recording.");
      this.startRecordFlag = false;
      this.thereIsRecord = false;
    }
  }

  stopRecording() {
    if (this.recordPlugin && this.recordPlugin.isRecording()) {
      this.recordPlugin.stopRecording();
      this.startRecordFlag = false;
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.waveSurfer.pause();
    } else {
      this.waveSurfer.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  deleteRecording() {
    // Stop active recording if still running
    if (this.recordPlugin && this.recordPlugin.isRecording()) {
      try { this.recordPlugin.stopRecording(); } catch {}
    }

    // Reset duration display
    this.recordingDuration = 0;
    this.updateFormattedTime();

    // Revoke previous object URL and clear buffers/state
    if (this.audioUrl) {
      try { URL.revokeObjectURL(this.audioUrl); } catch {}
    }
    this.audioUrl = null;
    this.audioChunks = [];
    this.audioFile = undefined;
    this.isPlaying = false;
    this.startRecordFlag = false;
    this.thereIsRecord = false;

    if (this.waveSurfer) {
      try { this.waveSurfer.empty(); } catch {}
    }

    this.recordingDeleted.emit();
  }

  prepareSound() {
    const isDarkTheme =
      document.body.getAttribute('data-bs-theme') === 'dark';
    if (this.waveSurfer) return;

    this.waveSurfer = WaveSurfer.create({
      container: this.waveformRef.nativeElement,
      waveColor: isDarkTheme ? '#FFFFFF' : '#999999',
      progressColor: isDarkTheme ? '#FFFFFF' : '#000000',
      barWidth: 1,
      interact: false,
      barGap: 3,
      barRadius: 3,
      height: 30,
      responsive: true,
      barMinHeight: 1,
      cursorWidth: 0
    });

    this.recordPlugin = this.waveSurfer.registerPlugin(
      RecordPlugin.create({
        scrollingWaveform: true,
        renderRecordedAudio: true,
      })
    );

    this.recordPlugin.on('record-progress', (time: number) => {
      this.recordingDuration = Math.floor(time / 1000);
      this.updateFormattedTime();
    });

    this.recordPlugin.on('record-end', (blob: Blob) => {
      this.audioUrl = URL.createObjectURL(blob);
      this.audioFile = new File([blob], 'recording.webm', { type: 'audio/webm' });
      this.recordingCompleted.emit({ audioUrl: this.audioUrl, audioFile: this.audioFile });
    });

    this.waveSurfer.on('audioprocess', (time: number) => {
      this.formattedRecordingTime = this.formatTime(time);
    });

    this.waveSurfer.on('finish', () => {
      this.isPlaying = false;
    });
  }

  updateFormattedTime(): void {
    const mins = Math.floor(this.recordingDuration / 60);
    const secs = this.recordingDuration % 60;
    this.formattedRecordingTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  ngOnDestroy() {
    // Stop any ongoing recording
    if (this.recordPlugin && this.recordPlugin.isRecording()) {
      try { this.recordPlugin.stopRecording(); } catch {}
    }

    // Revoke any object URL
    if (this.audioUrl) {
      try { URL.revokeObjectURL(this.audioUrl); } catch {}
      this.audioUrl = null;
    }

    if (this.waveSurfer) {
      this.waveSurfer.destroy();
    }
  }
}