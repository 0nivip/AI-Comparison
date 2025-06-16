import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, User, Bot, Menu, X, LogOut } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { AuthPage } from './AuthPage';
import './App.css';
import './Auth.css';


// User data interface
interface User {
  id: string;
  name: string;
  email: string;
}

// Chat data interface
interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messages: Message[];
}

// Message data interface
interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

function App() {
  // State hooks
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome chat when user logs in
  useEffect(() => {
    if (user) {
      const welcomeChat: Chat = {
        id: '1',
        title: 'Welcome!',
        lastMessage: `Hello, ${user.name}! I'm here to help you...`,
        timestamp: formatTimestamp(new Date()),
        messages: [
          {
            id: 1,
            type: 'assistant',
            content: `Hello, ${user.name}! I'm here to help you. What would you like to talk about?`,
            timestamp: formatTimestamp(new Date())
          }
        ]
      };
      setChats([welcomeChat]);
      setActiveChat('1');
    }
  }, [user]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeChat]);

  const currentChat = chats.find(chat => chat.id === activeChat);
  const messages = currentChat?.messages || [];

  // Format timestamp for messages
  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} h ago`;
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days} d ago`;

    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  };
  

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('.sidebar-container');
      const menuButton = document.querySelector('.mobile-menu-button');
      if (
        sidebarOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [sidebarOpen]);

  // Generate assistant's response based on user message
  const generateAssistantResponse = (userMessage: string): string => {
    const responses = [
      "That's an interesting question! I'm ready to help you with this topic.",
      "I understand your situation. Let's look at some possible solutions.",
      "Great question! This is a demo of a Claude-style interface.",
      "I'm analyzing your request and will provide detailed information.",
      "That's an important topic. Let me share my knowledge on this.",
      "Interesting! I see you're interested in this area. Let's discuss details.",
    ];

    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello, ${user?.name}! How can I help you today?`;
    }
    if (lowerMessage.includes('how are you')) {
      return "I'm doing great! I'm here to help you with any questions.";
    }
    if (lowerMessage.includes('programming') || lowerMessage.includes('code')) {
      return "Programming is a fascinating field! I can help with various languages and technologies. What exactly interests you?";
    }
    if (lowerMessage.includes('help')) {
      return "Of course! I'm ready to help. Please describe what you need assistance with.";
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentChat) return;

    const now = new Date();
    const newMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: formatTimestamp(now)
    };

    const updatedMessages = [...messages, newMessage];

    // Update chat with new user message
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: updatedMessages,
              lastMessage: inputValue,
              timestamp: formatTimestamp(now)
            }
          : chat
      )
    );

    setInputValue('');
    setIsTyping(true);

    // Simulate assistant response with delay
    setTimeout(() => {
      const assistantResponse: Message = {
        id: updatedMessages.length + 1,
        type: 'assistant',
        content: generateAssistantResponse(inputValue),
        timestamp: formatTimestamp(new Date())
      };

      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: [...updatedMessages, assistantResponse],
                lastMessage: assistantResponse.content,
                timestamp: assistantResponse.timestamp
              }
            : chat
        )
      );

      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  // Handle Enter key for sending message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Start a new chat
  const handleNewChat = () => {
    const now = new Date();
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      lastMessage: 'Start a new conversation...',
      timestamp: formatTimestamp(now),
      messages: [
        {
          id: 1,
          type: 'assistant',
          content: `Hello, ${user?.name}! This is a new chat. How can I help?`,
          timestamp: formatTimestamp(now)
        }
      ]
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat.id);
    setSidebarOpen(false);
  };

  // Delete a chat
  const handleDeleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (activeChat === chatId && chats.length > 1) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      if (remainingChats.length > 0) {
        setActiveChat(remainingChats[0].id);
      }
    }
  };

  // Rename a chat
  const handleRenameChat = (chatId: string, newTitle: string) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  };

  // Handle user login
  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  // Handle user logout
  const handleLogout = () => {
    setUser(null);
    setChats([]);
    setActiveChat('');
    setSidebarOpen(false);
  };

  // Toggle sidebar open/close
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show AuthPage if user is not logged in
  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar
          chats={chats}
          activeChat={activeChat}
          onChatSelect={(chatId) => {
            setActiveChat(chatId);
            setSidebarOpen(false);
          }}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
          user={user}
          onLogout={handleLogout}
        />
      </div>

      {/* Main content area */}
      <div className="main-content">
        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <div className="header-left">
              {/* Sidebar toggle button */}
              <button
                className="mobile-menu-button"
                onClick={toggleSidebar}
                aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              {/* Logo and chat title */}
              <div className="logo-section">
                <div className="logo-icon">
                  <img src="Logo.png" alt="Logo" style={{ width: 20, height: 20, verticalAlign: 'middle' }} />
                </div>
                <div className="logo-text">
                  <h1>{currentChat?.title || 'Dragon Assistant'}</h1>
                  <p>AI assistant for {user.name}</p>
                </div>
              </div>
            </div>
            <div className="header-right">
              {/* Online status */}
              <div className="status-section">
                <div className="status-dot"></div>
                <span>Online</span>
              </div>
              {/* Logout button */}
              <button
                className="mobile-menu-button"
                onClick={handleLogout}
                aria-label="Log out"
                style={{ marginLeft: '0.5rem' }}
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Chat container */}
        <div className="chat-container">
          {/* Messages area */}
          <div className="messages-area">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-wrapper ${message.type === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <div className={`avatar ${message.type === 'user' ? 'user-avatar' : 'assistant-avatar'}`}>
                  {message.type === 'user' ? (
                    <User size={16} />
                  ) : (
                    <Bot size={16} />
                  )}
                </div>
                <div className="message-content">
                  <div className={`message-bubble ${message.type === 'user' ? 'user-bubble' : 'assistant-bubble'}`}>
                    <p>{message.content}</p>
                  </div>
                  <div className="message-time">
                    {message.type === 'user' ? user.name : 'Assistant'} • {message.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator for assistant */}
            {isTyping && (
              <div className="message-wrapper assistant-message">
                <div className="avatar assistant-avatar">
                  <Bot size={16} />
                </div>
                <div className="message-content">
                  <div className="message-bubble assistant-bubble">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className="message-time">
                    Assistant is typing...
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="input-area">
            <div className="input-container">
              <div className="input-wrapper">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="message-input"
                  rows={1}
                  disabled={isTyping}
                />
                <div className="input-footer">
                  <div className="input-hint">
                    <div className="hint-dot"></div>
                    <span>Shift + Enter for new line</span>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="send-button"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="app-footer">
          <p>Dragon Assistant • Welcome, {user.name}!</p>
        </footer>
      </div>
    </div>
  );
}

export default App;