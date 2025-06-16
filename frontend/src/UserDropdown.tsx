import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, HelpCircle, CreditCard, BookOpen, LogOut, ChevronRight } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserDropdownProps {
  user: User;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({
  user,
  onLogout,
  isOpen,
  onToggle,
  onClose
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Get user initials for avatar
  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle menu item actions
  const handleMenuItemClick = (action: string) => {
    switch (action) {
      case 'logout':
        onLogout();
        break;
      case 'settings':
        // Add settings logic here if needed
        break;
      case 'help':
        // Add help logic here if needed
        break;
      case 'upgrade':
        // Add upgrade logic here if needed
        break;
      case 'learn':
        // Add learn more logic here if needed
        break;
      default:
        break;
    }
    onClose();
  };

  return (
    <div className="user-dropdown-container" ref={dropdownRef}>
      {/* User button to open dropdown */}
      <button 
        className="user-info-button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="user-avatar">
          {getUserInitials(user.name)}
        </div>
        <div className="user-details">
          <div className="user-name">{user.name}</div>
          <div className="user-status">{user.email}</div>
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="user-dropdown">
          {/* Dropdown header with user info */}
          <div className="dropdown-header">
            <div className="dropdown-user-info">
              <div className="dropdown-user-email">{user.email}</div>
              <div className="dropdown-plan">
                <div className="plan-badge">
                  <span className="plan-initial">0</span>
                  <div className="plan-details">
                    <span className="plan-name">Personal</span>
                    <span className="plan-type">Free plan</span>
                  </div>
                  <div className="plan-check">✓</div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="dropdown-divider"></div>

          {/* Dropdown menu items */}
          <div className="dropdown-menu">
            <button 
              className="dropdown-item"
              onClick={() => handleMenuItemClick('settings')}
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>

            <button 
              className="dropdown-item dropdown-item-expandable"
              onClick={() => handleMenuItemClick('language')}
            >
              <div className="dropdown-item-content">
                <span>Language</span>
                <span className="dropdown-item-badge">BETA</span>
              </div>
              <ChevronRight size={16} />
            </button>

            <button 
              className="dropdown-item"
              onClick={() => handleMenuItemClick('help')}
            >
              <HelpCircle size={16} />
              <span>Get help</span>
            </button>

            <button 
              className="dropdown-item"
              onClick={() => handleMenuItemClick('upgrade')}
            >
              <CreditCard size={16} />
              <span>Upgrade plan</span>
            </button>

            <button 
              className="dropdown-item dropdown-item-expandable"
              onClick={() => handleMenuItemClick('learn')}
            >
              <BookOpen size={16} />
              <span>Learn more</span>
              <ChevronRight size={16} />
            </button>

            {/* Divider */}
            <div className="dropdown-divider"></div>

            <button 
              className="dropdown-item"
              onClick={() => handleMenuItemClick('logout')}
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>

          {/* Dropdown footer with counter */}
          <div className="dropdown-footer">
            <div className="dropdown-counter">0</div>
          </div>
        </div>
      )}
    </div>
  );
};