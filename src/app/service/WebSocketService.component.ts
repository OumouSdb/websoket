import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WebSocketService {
    private websocket: WebSocket | undefined;
    private messagesSubject = new Subject<string>();
    messages$ = this.messagesSubject.asObservable();

    connect() {
        this.websocket = new WebSocket('ws://localhost:8080/ws');
        this.websocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.messagesSubject.next(`${data.sender}: ${data.content}`);
            } catch (error) {
                console.error('Erreur lors de la réception de message:', error);
            }
        };

        this.websocket.onerror = (error) => {
            console.error('Erreur WebSocket:', error);
        };

        this.websocket.onclose = (event) => {
            console.log('Connexion WebSocket fermée:', event);
        };
    }


    sendMessage(message: any) {
        this.websocket?.send(JSON.stringify(message));
    }
}
