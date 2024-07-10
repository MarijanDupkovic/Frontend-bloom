import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MediaStreamService {

  constructor() { }


  async getScreenStream(canvasWidth: number, canvasHeight: number) {
    try {
      return navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: canvasWidth },
          height: { ideal: canvasHeight },
          frameRate: { ideal: 30, max: 60 },
          aspectRatio: { ideal: 1.7777777778 }
        }
      });
    } catch (error) {
      return new MediaStream();

    }
  }

  async getWebcamStream() {
    try {;
      return await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30, max: 60 },
          aspectRatio: { ideal: 1.7777777778 },
        }
      });
    } catch (error) {
      return new MediaStream();
    }
  }

  async getAudioStream() {
    try {
      return await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      return new MediaStream();
    }
  }
}
