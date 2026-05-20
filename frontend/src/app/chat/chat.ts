import { Component, OnInit, OnDestroy, ElementRef, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth';
import { ChatService, ChatMessage } from '../services/chat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.html',
  styleUrls: ['./chat.css'],
  standalone: false,
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  
  messages: ChatMessage[] = [];
  newMessage = '';
  private socket!: WebSocket;
  private userId: number | null = null;
  currentUsername: string | null = null;
  
  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.currentUsername = this.authService.getUsername();
    
    console.log('Current username:', this.currentUsername);
    
    this.chatService.getMessages().subscribe({
      next: (data) => {
        this.messages = data;
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
      error: (err) => console.error('Ошибка загрузки истории:', err)
    });
    
    this.connectWebSocket();
  }

  isOwnMessage(username: string): boolean {
    return this.currentUsername === username;
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  private connectWebSocket(): void {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/chat/`;

    this.socket = new WebSocket(wsUrl);
    
    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };
    
    this.socket.onmessage = (event) => {
      this.ngZone.run(() => {
        const message = JSON.parse(event.data);
        this.messages = [...this.messages, message];
        this.cdr.detectChanges();
        this.scrollToBottom();
      });
    };
    
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      setTimeout(() => this.connectWebSocket(), 3000);
    };
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        message: this.newMessage,
        user_id: this.userId
      }));
      this.newMessage = '';
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}