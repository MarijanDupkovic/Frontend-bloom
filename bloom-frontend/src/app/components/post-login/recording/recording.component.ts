import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as tf from '@tensorflow/tfjs';


@Component({
  selector: 'app-recording',
  standalone: true,
  imports: [CommonModule,FormsModule],
  providers: [  ],
  templateUrl: './recording.component.html',
  styleUrl: './recording.component.scss'
})
export class RecordingComponent {
  blur = false;

  recorder: any;
  mediaRecorder: any;
  mediaStream: any;
  audioContext: any;
  gainNode: any;
  recordedChunks = [];
  bodyPixID: any;

  constructor() { }
  @ViewChild('canvasScreen') canvasScreen?: ElementRef;
  @ViewChild('screenVideo') screenVideo?: ElementRef;
  @ViewChild('webcamVideo') webcamVideo?: ElementRef;
  @ViewChild('webcamCanvas') webcamCanvas?: ElementRef;
  

  ctx: any;




  ngOnInit() {
  }

  startRecordingAll() {
    this.startRecordingDisplayWithAudio();

  }

  startRecordingDisplayWithAudio() {

    this.getScreenStream()
      .then((screenStream) => {
        if (this.screenVideo?.nativeElement) {
          this.screenVideo.nativeElement.srcObject = screenStream;
          this.screenVideo.nativeElement.srcObject.onloadedmetadata = function () {
            this.screenVideo.nativeElement.play();
          };
        }
        this.getAudioStream()
          .then(audioStream => {
            this.getWebcamStream()
              .then(webcamStream => {
                if (this.webcamVideo?.nativeElement) {
                  this.webcamVideo.nativeElement.srcObject = webcamStream;
                  this.webcamVideo.nativeElement.onloadedmetadata = () => {
                    console.log("webcamStream", this.webcamVideo!.nativeElement.srcObject);

                    this.loadBodyPixAll();
                    this.webcamVideo!.nativeElement.play();
                  };
                }
                  this.drawVideosOnCanvas();
                  let stream = this.canvasScreen!.nativeElement.captureStream();
                  
                  // this.startRecording(stream, audioStream);
              })
              .catch(error => {
                console.log("Error getting webcam:", error);
              });
          })
          .catch(error => {
            console.log("Error getting microphone:", error);
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
    if (this.webcamCanvas && this.ctx && this.screenVideo) {
      this.ctx.drawImage(this.screenVideo.nativeElement, 0, 0, 1920, 1080);
      this.ctx.drawImage(this.webcamCanvas.nativeElement, 0, 0, 400, 300); // Draw the webcam video in the top left corner with a size of 100x100
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
          this.webcamCanvas!.nativeElement, this.webcamVideo?.nativeElement, segmentation, backgroundBlurAmount,
          edgeBlurAmount, flipHorizontal);
      }
    }
  }

  loadBodyPixAll() {
    this.blur = true;
    tf.setBackend('webgl').then(() => {
      const options: any = {
        multiplier:0.75,
        outputStride: 16,
        quantBytes: 2,
        resizeMode: "crop-and-scale",
       
        internalResolution: "low",
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
        width: { ideal: 1920 },
        height: { ideal: 1080 },
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
        width: { ideal: 640 },
        height: { ideal: 480 },
        frameRate: { ideal: 30, max: 60 },
        aspectRatio: { ideal: 1.7777777778 },
      }
    });
  }



  

  startRecording(stream: any, audioStream: any) {
    let tracks = [
      ...stream.getTracks(),
      ...audioStream.getTracks()
    ];
    let combinedStream = new MediaStream(tracks);
    this.mediaRecorder = new MediaRecorder(combinedStream);
    this.mediaRecorder.ondataavailable = function (e:any) {
      if (e.data.size > 0) {
        this.recordedChunks.push(e.data);
      }
    };
    this.mediaRecorder.start();
  }
  stopRecordingAll() {
  }

  activateBlur() {
  }

  showPreview() {
    this.startRecordingAll();
  }
}
