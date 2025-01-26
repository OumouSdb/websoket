import { Component, OnInit } from '@angular/core';
import { WebSocketService } from './service/WebSocketService.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AppComponent implements OnInit {
  message = '';
  messages: string[] = [];

  constructor(private webSocketService: WebSocketService) { }

  private messagesSubscription: any;

  ngOnInit() {
    let userId = sessionStorage.getItem('userId');
    if (!userId) {
      userId = Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('userId', userId);
    }

    this.webSocketService.connect();
    this.messagesSubscription = this.webSocketService.messages$.subscribe((msg) => {
      this.messages.push(msg);
    });
  }


  ngOnDestroy() {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }


  sendMessage() {
    const userId = sessionStorage.getItem('userId') || 'inconnu';
    const messagePayload = {
      sender: userId,
      content: this.message
    };
    this.webSocketService.sendMessage(messagePayload);
    this.message = '';
  }


}
