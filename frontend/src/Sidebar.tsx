import React, { useState } from 'react';
import { Plus, Search, MessageSquare, Edit2, Trash2, Check, X } from 'lucide-react';
import { UserDropdown } from './UserDropdown';

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

interface SidebarProps {
  chats: Chat[];
  activeChat: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
  user: User;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChat,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  user,
  onLogout
}) => {
  // State for search query in chat list
  const [searchQuery, setSearchQuery] = useState('');
  // State for editing chat title
  const [editingChat, setEditingChat] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  // State for user dropdown menu
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Filter chats by search query (title or last message)
  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Start editing chat title
  const handleEditStart = (chatId: string, currentTitle: string) => {
    setEditingChat(chatId);
    setEditTitle(currentTitle);
  };

  // Save edited chat title
  const handleEditSave = (chatId: string) => {
    if (editTitle.trim()) {
      onRenameChat(chatId, editTitle.trim());
    }
    setEditingChat(null);
    setEditTitle('');
  };

  // Cancel editing chat title
  const handleEditCancel = () => {
    setEditingChat(null);
    setEditTitle('');
  };

  // Handle Enter/Escape keys for editing chat title
  const handleKeyPress = (e: React.KeyboardEvent, chatId: string) => {
    if (e.key === 'Enter') {
      handleEditSave(chatId);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  // Toggle user dropdown menu
  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  // Close user dropdown menu
  const closeUserDropdown = () => {
    setUserDropdownOpen(false);
  };

  return (
    <div className="sidebar">
      {/* Sidebar header with new chat button */}
      <div className="sidebar-header">
        <button onClick={onNewChat} className="new-chat-button">
          <Plus size={18} />
          New Chat
        </button>
      </div>

      {/* Search bar for chats */}
      <div className="search-container">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="search-input"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="chat-list">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
              onClick={() => !editingChat && onChatSelect(chat.id)}
            >
              <div className="chat-content">
                {editingChat === chat.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, chat.id)}
                    onBlur={() => handleEditSave(chat.id)}
                    className="edit-input"
                    autoFocus
                  />
                ) : (
                  <>
                    <div className="chat-title">{chat.title}</div>
                    <div className="chat-preview">{chat.lastMessage}</div>
                    <div className="chat-timestamp">{chat.timestamp}</div>
                  </>
                )}
              </div>
              
              {/* Chat actions: edit/delete/save/cancel */}
              {!editingChat && (
                <div className="chat-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStart(chat.id, chat.title);
                    }}
                    className="action-button"
                    title="Rename"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className="action-button delete"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
              
              {editingChat === chat.id && (
                <div className="chat-actions">
                  <button
                    onClick={() => handleEditSave(chat.id)}
                    className="action-button"
                    title="Save"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="action-button"
                    title="Cancel"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          // Empty state for no chats or no search results
          <div className="empty-state">
            {searchQuery ? (
              <>
                <Search size={48} className="empty-icon" />
                <p>No results found</p>
                <span>Try changing your search query</span>
              </>
            ) : (
              <>
                <MessageSquare size={48} className="empty-icon" />
                <p>No chats</p>
                <span>Start a new chat to begin</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Sidebar footer with user info and dropdown */}
      <div className="sidebar-footer">
        <UserDropdown
          user={user}
          onLogout={onLogout}
          isOpen={userDropdownOpen}
          onToggle={toggleUserDropdown}
          onClose={closeUserDropdown}
        />
      </div>
    </div>
  );
};