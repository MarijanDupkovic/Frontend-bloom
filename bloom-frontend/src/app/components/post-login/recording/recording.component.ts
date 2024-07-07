import { MediaStreamService } from './../../../services/Stream/media-stream.service';
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
  recordedChunks: Blob[] = [];
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
  isRecording: boolean = false;
  isRecordingLive: boolean = false;
  @Input() style: any;
  @ViewChild('canvasScreen') canvasScreen?: ElementRef;
  @ViewChild('screenVideo') screenVideo?: ElementRef;
  @ViewChild('webcamVideo') webcamVideo?: ElementRef;
  @ViewChild('webcamCanvas') webcamCanvas?: ElementRef;
  isMenuOpen: boolean = true;
  private readonly aspectRatio: number = 16 / 9;
  private readonly referenceResolution: number = 1920;
  private readonly targetWidth: number = 1280;
  private readonly widthRatio: number = this.targetWidth / this.referenceResolution;

  constructor(private video: VideoService, private user: UserService, private mediaStreamService: MediaStreamService) {
    this.adjustCanvasSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.adjustCanvasSize();
  }

  adjustCanvasSize() {
    const screenWidth = window.innerWidth;
    this.canvasWidth = screenWidth * this.widthRatio;
    this.canvasHeight = this.canvasWidth / this.aspectRatio;
  }

  ngOnInit() { }

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
    this.draw();
  }

  setBlur() {
    this.blur = !this.blur;
  }

  draw() {
    this.ctx = this.canvasScreen!.nativeElement.getContext('2d');
    if (this.webcamCanvas && this.webcamCanvas.nativeElement && this.ctx && this.screenVideo && this.screenVideo.nativeElement && this.webcamVideo && this.webcamVideo.nativeElement) {
      this.ctx.drawImage(this.screenVideo.nativeElement, 0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx.drawImage(this.webcamCanvas.nativeElement, 0, 0, 150, 150);
      this.ctx.globalAlpha = 0.01;
      this.ctx.fillRect(0, 0, 1, 1);
      this.ctx.globalAlpha = 1.0;
      requestAnimationFrame(this.draw.bind(this));
    }
  }

  async performAllInputs(net: any) {
    let backgroundBlurAmount = 0;
    let edgeBlurAmount = 0;
    while (this.isRecording) {
      if (this.webcamCanvas && this.webcamVideo) {
        const segmentation = await net.segmentPerson(this.webcamVideo.nativeElement);
        backgroundBlurAmount = this.blur ? 12 : 0;
        edgeBlurAmount = 0;
        const flipHorizontal = false;
        bodyPix.drawBokehEffect(
          this.webcamCanvas.nativeElement, this.webcamVideo.nativeElement, segmentation, backgroundBlurAmount,
          edgeBlurAmount, flipHorizontal);
      }
    }
  }

  loadBodyPixAll() {
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

  stopMediaDevices() {
    this.blur = false;
    this.clearCanvas(this.canvasScreen as ElementRef);
    this.clearCanvas(this.webcamCanvas as ElementRef);
    this.stopVideoStream(this.screenVideo);
    this.stopVideoStream(this.webcamVideo);
    this.isRecording = false;
    this.ctx = null;
  }

  stopVideoStream(videoElement: any) {
    if (videoElement?.nativeElement.srcObject) {
      videoElement.nativeElement.srcObject.getTracks().forEach((track: any) => track.stop());
      videoElement.nativeElement.srcObject = null;
    }
  }

  clearCanvas(canvas: ElementRef) {
    if (canvas && canvas.nativeElement) {
      const ctx = canvas.nativeElement.getContext('2d');
      ctx.clearRect(0, 0, canvas.nativeElement.width, canvas.nativeElement.height);
    }
  }

  async getMediaDevices() {
    try {
      let webcamStream = await this.mediaStreamService.getWebcamStream();
      this.loadWebcamStream(webcamStream);

      let screenStream = await this.mediaStreamService.getScreenStream(this.canvasWidth, this.canvasHeight);
      this.loadScreenStream(screenStream);
      this.draw();
    } catch (error) {
      console.log("Error getting screen:", error);
    }
  }

  async startRecordingLive() {
    this.isRecording = true;
    await this.getMediaDevices();
    this.startRecording();

  }

  async startRecording() {
    try {
      const combinedStream = await this.getCombinedAudioVideoStream();
      this.setupMediaRecorder(combinedStream);
      this.startMediaRecording();
    } catch (error: any) {
      this.handleRecordingError(error);
    }
  }

  startMediaRecording() {
    this.mediaRecorder.start();
    this.isRecordingLive = true;
  }

  setupMediaRecorder(stream: MediaStream) {
    const options = {
      mimeType: 'video/webm; codecs="vp8, opus"',
      videoBitsPerSecond: 5000000,
      audioBitsPerSecond: 256000
    };
    this.mediaRecorder = new MediaRecorder(stream, options);
    this.mediaRecorder.ondataavailable = this.handleDataAvailable;
  }

  async getCombinedAudioVideoStream() {
    const audioStream = await this.mediaStreamService.getAudioStream();
    const videoStream = this.canvasScreen!.nativeElement.captureStream();
    const tracks = [...videoStream.getTracks(), ...audioStream.getTracks()];
    return new MediaStream(tracks);
  }

  handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      this.recordedChunks.push(event.data);
    }
  }

  handleRecordingError(error: any) {
    if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
      alert("Permission to access media devices was denied. Please allow access to use this feature.");
    } else if (error.name === "NotFoundError") {
      alert("No media devices found. Please connect a camera or microphone.");
    } else {
      alert("An error occurred while accessing media devices. Please check your device and browser settings.");
    }
  }

  async getUserData() {
    await this.user.getUserData('/user').then((data: any) => {
      if (data[0].username) this.userData = data[0];
    });
  }

  isMediaRecorderActive() {
    return this.mediaRecorder && this.mediaRecorder.state !== 'inactive';
  }

  async stopRecordingLive(preview: boolean) {
    await this.getUserData();
    if (!this.isMediaRecorderActive()) return;
    await this.stopMediaRecorder();
    this.stopMediaDevices();
    this.resetRecordingState();
  }

  async stopMediaRecorder() {
    const formData = new FormData();
    const stopPromise = new Promise<void>((resolve) => {
      this.mediaRecorder.onstop = async () => {
        const videoBlob = this.createVideoBlob();
        this.appendFormData(formData, videoBlob);
        resolve();
      };
      this.stopRecorderAndTracks();
    });

    await stopPromise;
    await this.video.uploadVideo(formData);
  }

  createVideoBlob() {
    return new Blob(this.recordedChunks, { type: "video/mp4" });
  }

  appendFormData(formData: FormData, videoBlob: Blob) {
    formData.append('video_file', videoBlob, 'video.mp4');
    formData.append('author', this.userData.id);
  }

  stopRecorderAndTracks() {
    this.mediaRecorder.stop();
    this.mediaRecorder.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
  }

  resetRecordingState() {
    this.isRecordingLive = false;
    this.isRecording = false;
    this.blur = false;
    this.recordedChunks = [];
    this.screen_running = false;
    this.webcam_running = false;
    this.ctx = null;
  }

  showPreview() {
    this.startRecordingLive();
  }

  toggleOptionsMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
