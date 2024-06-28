import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as tf from '@tensorflow/tfjs';
import { VideoService } from '../../../services/Stream/video.service';
import { UserService } from '../../../services/profile/user.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-recording',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  providers: [FormData],
  templateUrl: './recording.component.html',
  styleUrl: './recording.component.scss'
})
export class RecordingComponent {
  blur: boolean = false;
  recorder: any;
  mediaRecorder: any;
  mediaStream: any;
  audioStream: any;
  audioContext: any;
  gainNode: any;
  recordedChunks: Blob[] = [];
  bodyPixID: any;
  audio_running: boolean = false;
  screen_running: boolean = false;
  webcam_running: boolean = false;
  ctx: any;
  userData: any;
  screenWidth = window.innerWidth / 1.25;
  screenHeight = window.innerHeight / 1.25;
  resizeListener: any;
  canvasWidth: number = 1280;
  canvasHeight: number = 720;
  @Input() style: any;
  @ViewChild('canvasScreen') canvasScreen?: ElementRef;
  @ViewChild('screenVideo') screenVideo?: ElementRef;
  @ViewChild('webcamVideo') webcamVideo?: ElementRef;
  @ViewChild('webcamCanvas') webcamCanvas?: ElementRef;
  private readonly aspectRatio: number = 16 / 9;
  private readonly referenceResolution: number = 1920;
  private readonly targetWidth: number = 1280;
  private readonly widthRatio: number = this.targetWidth / this.referenceResolution;
  constructor(private video: VideoService, private user: UserService) {
    this.adjustCanvasSize();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.adjustCanvasSize();
  }

  adjustCanvasSize() {
    const screenWidth = window.innerWidth;
    this.canvasWidth = screenWidth * this.widthRatio;
    this.canvasHeight = this.canvasWidth / this.aspectRatio;

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
  }


  async loadScreenStream(screenStream: any) {
    if (this.screenVideo) {
      this.screenVideo.nativeElement.srcObject = screenStream;
      this.screenVideo.nativeElement.onloadedmetadata = () => {
        this.screenVideo!.nativeElement.play();
      };
      this.screen_running = true;
    }
  }

  async loadWebcamStream(webcamStream: any) {
    if (this.webcamVideo) {
      this.webcamVideo.nativeElement.srcObject = webcamStream;
      this.webcamVideo.nativeElement.onloadedmetadata = () => {
        this.webcamVideo!.nativeElement.play();
      };
      this.webcam_running = true;

    }
    this.loadBodyPixAll();
  }

  draw() {
    this.ctx = this.canvasScreen!.nativeElement.getContext('2d');
    if (this.webcamCanvas && this.webcamCanvas.nativeElement && this.ctx && this.screenVideo && this.screenVideo.nativeElement) {
      this.ctx.drawImage(this.screenVideo.nativeElement, 0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx.drawImage(this.webcamCanvas.nativeElement, 0, 0, 150, 150);
      this.ctx.globalAlpha = 0.01;
      this.ctx.fillRect(0, 0, 1, 1);
      this.ctx.globalAlpha = 1.0;
      requestAnimationFrame(this.draw.bind(this));

    }
  }

  async performAllInputs(net: any) {
    while (this.blur) {
      if (this.webcamCanvas && this.webcamVideo) {
        const segmentation = await net.segmentPerson(this.webcamVideo.nativeElement);
        const backgroundBlurAmount = 12;
        const edgeBlurAmount = 6;
        const flipHorizontal = false;
        bodyPix.drawBokehEffect(
          this.webcamCanvas.nativeElement, this.webcamVideo.nativeElement, segmentation, backgroundBlurAmount,
          edgeBlurAmount, flipHorizontal);
      }
    }
  }

  loadBodyPixAll() {
    this.blur = true;
    tf.setBackend('webgl').then(() => {
      const options: any = {
        multiplier: 0.75,
        outputStride: 16,
        quantBytes: 2,
        resizeMode: "crop-and-scale",

        internalResolution: "high",
        segmentationThreshold: 0.5,
        maxDetections: 1,
        scoreThreshold: 0.3,
        minKeypointScore: 0.3,
        backgroundBlurAmount: 5,
        maskBlurAmount: 0,
        edgeBlurAmount: 3
      };

      bodyPix.load(options).then((net: any) => this.performAllInputs(net)).catch((err: any) => console.log(err));
    });
  }

  getScreenStream() {
    return navigator.mediaDevices.getDisplayMedia({
      video: {
        width: { ideal: this.canvasWidth },
        height: { ideal: this.canvasHeight },
        frameRate: { ideal: 100, max: 120 },
        aspectRatio: { ideal: 1.7777777778 }
      }
    });

  }

  getAudioStream() {
    return navigator.mediaDevices.getUserMedia({ audio: true });
  }

  getWebcamStream() {
    return navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30, max: 60 },
        aspectRatio: { ideal: 1.7777777778 },
      }
    });
  }

  stopMediaDevices() {
    this.blur = false;

    if (this.screenVideo!.nativeElement.srcObject) {
      this.screenVideo!.nativeElement.srcObject.getTracks().forEach((track: any) => track.stop());
      this.screenVideo!.nativeElement.srcObject = null;
    }

    if (this.webcamVideo!.nativeElement.srcObject) {
      this.webcamVideo!.nativeElement.srcObject.getTracks().forEach((track: any) => track.stop());
      this.webcamVideo!.nativeElement.srcObject = null;
    }

    if (this.canvasScreen && this.canvasScreen.nativeElement) {
      let ctx = this.canvasScreen.nativeElement.getContext('2d');
      ctx.clearRect(0, 0, this.canvasScreen.nativeElement.width, this.canvasScreen.nativeElement.height);
    }
    if (this.webcamCanvas && this.webcamCanvas.nativeElement) {
      let ctx = this.webcamCanvas.nativeElement.getContext('2d');
      ctx.clearRect(0, 0, this.webcamCanvas.nativeElement.width, this.webcamCanvas.nativeElement.height);

    }


    this.ctx = null;
    this.bodyPixID = null;
  }

  async getMediaDevices() {
    try {

      let webcamStream = await this.getWebcamStream();
      this.loadWebcamStream(webcamStream);
      let screenStream = await this.getScreenStream();
      this.loadScreenStream(screenStream);
      this.draw();

    } catch (error) {
      console.log("Error getting screen:", error);
    }
  }

  async startRecordingLive() {

    await this.getMediaDevices();

    this.startRecording();
  }


  async startRecording() {
    try {
      let audioStream = await this.getAudioStream();
      let stream = this.canvasScreen!.nativeElement.captureStream();

      let tracks = [
        ...stream.getTracks(),
        ...audioStream.getTracks()
      ];
      let combinedStream = new MediaStream(tracks);

      this.mediaRecorder = new MediaRecorder(combinedStream);
      this.mediaRecorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) this.recordedChunks.push(e.data);
      };
      this.mediaRecorder.start();
    } catch (error: any) {
      console.error("Error accessing media devices: ", error);
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        alert("Permission to access media devices was denied. Please allow access to use this feature.");
      } else {
        alert("An error occurred while accessing media devices. Please check your device and browser settings.");
      }
    }
  }

  async getUserData() {
    await this.user.getUserData('/user').then((data: any) => {
      if (data[0].username) {
        this.userData = data[0];
      }
    });
  }

  async stopRecordingLive() {
    await this.getUserData();

    this.blur = false;
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.onstop = () => {
        let blob = new Blob(this.recordedChunks, { type: "video/mp4" });
        let formData = new FormData();
        formData.append('video_file', blob, 'video.mp4');
        formData.append('author', this.userData.id);

        this.video.uploadVideo(formData);
      }
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach((track: any) => track.stop());
    }
    this.stopMediaDevices();
    this.recordedChunks = [];
    this.screen_running = false;
    this.webcam_running = false;
    this.screenWidth = 10;
    this.screenHeight = 10;
  }

  showPreview() {
    this.startRecordingLive();
  }

  hidePreview() {
    this.stopMediaDevices();
  }
}
