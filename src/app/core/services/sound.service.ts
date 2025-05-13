import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private messageSound: HTMLAudioElement;

  constructor() {
    this.messageSound = new Audio('assets/sounds/message.mp3');
    this.messageSound.load();
  }

  playMessageSound(): void {
    this.messageSound.currentTime = 0;
    this.messageSound.play().catch(error => {
      console.error('Erro ao tocar som:', error);
    });
  }
}