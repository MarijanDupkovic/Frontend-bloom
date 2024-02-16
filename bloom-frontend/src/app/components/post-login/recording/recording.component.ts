import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as tf from '@tensorflow/tfjs';


@Component({
  selector: 'app-recording',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [],
  templateUrl: './recording.component.html',
  styleUrl: './recording.component.scss'
})
export class RecordingComponent {
  blur = false;

  recorder: any;
  mediaRecorder: any;
  mediaStream: any;
  audioStream: any;
  audioContext: any;
  gainNode: any;
  recordedChunks:Blob[] = [];
  bodyPixID: any;

  constructor() { }
  @ViewChild('canvasScreen') canvasScreen?: ElementRef;
  @ViewChild('screenVideo') screenVideo?: ElementRef;
  @ViewChild('webcamVideo') webcamVideo?: ElementRef;
  @ViewChild('webcamCanvas') webcamCanvas?: ElementRef;


  ctx: any;




  ngOnInit() {
  }

  startMediaDevices() {

    this.getScreenStream()
      .then((screenStream) => {
        if (this.screenVideo?.nativeElement) {
          this.screenVideo.nativeElement.srcObject = screenStream;
          this.screenVideo.nativeElement.srcObject.onloadedmetadata = function () {
            this.screenVideo.nativeElement.play();
          };
        }

        this.getWebcamStream()
          .then(webcamStream => {
            if (this.webcamVideo?.nativeElement) {
              this.webcamVideo.nativeElement.srcObject = webcamStream;
              this.webcamVideo.nativeElement.onloadedmetadata = () => {

                this.loadBodyPixAll();
                this.webcamVideo!.nativeElement.play();
              };
            }
            this.drawVideosOnCanvas();

          })
          .catch(error => {
            console.log("Error getting webcam:", error);
          });


      })
      .catch(error => {
        console.log("Error getting screen:", error);
      });
  }

  drawVideosOnCanvas() {

    this.draw();
  }

  draw() {
    this.ctx = this.canvasScreen!.nativeElement.getContext('2d');
    if (this.webcamCanvas && this.webcamCanvas.nativeElement && this.ctx && this.screenVideo && this.screenVideo.nativeElement) {
      this.ctx.drawImage(this.screenVideo.nativeElement, 0, 0, 320, 240);
      this.ctx.drawImage(this.webcamCanvas.nativeElement, 0, 0, 60, 60); // Draw the webcam video in the top left corner with a size of 100x100
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
          this.webcamCanvas!.nativeElement, this.webcamVideo!.nativeElement, segmentation, backgroundBlurAmount,
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
        width: { ideal: 320 },
        height: { ideal: 240 },
        frameRate: { ideal: 60, max: 60 },
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
        width: { ideal: 320 },
        height: { ideal: 240 },
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

  startRecordingLive() {
    this.startMediaDevices();
    this.getAudioStream()
      .then(audioStream => {
        let stream: any;
        if (this.canvasScreen && this.canvasScreen.nativeElement) {
          stream = this.canvasScreen.nativeElement.captureStream();
          this.startRecording(stream, audioStream);
        }
      })
  }


  startRecording(stream: any, audioStream: any) {
    let tracks = [
      ...stream.getTracks(),
      ...audioStream.getTracks()
    ];
    let combinedStream = new MediaStream(tracks);
    this.mediaRecorder = new MediaRecorder(combinedStream);
    this.mediaRecorder.ondataavailable = (e: BlobEvent) => {
      if (e.data.size > 0) {
        this.recordedChunks.push(e.data);
      }
    };
    this.mediaRecorder.start();
  }
  stopRecordingLive() {
    this.mediaRecorder.onstop = () => {
      let blob = new Blob(this.recordedChunks, { type: "video/" });
      let url = URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.download = "video.mp4";
      link.href = url;
      link.click();
   
    }
    this.mediaRecorder.stop();
    this.mediaRecorder.stream.getTracks().forEach((track: any) => track.stop());
    this.recordedChunks = [];
    this.stopMediaDevices();

  }

  activateBlur() {
  }

  showPreview() {
    this.startMediaDevices();
  }
  hidePreview() {
    this.stopMediaDevices();
  }
}
