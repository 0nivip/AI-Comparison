import React from 'react';

export const DragonLogo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    style={{ display: 'block' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="32" fill="#1a1a1a"/>
    <path
      d="M44 18c-2 2-6 2-8 0 2 4 0 8-4 10 6 0 10 4 10 10-2-2-6-2-8 0 2 4 0 8-4 10"
      stroke="#e11d48"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M28 44c-6-2-10-8-10-14 0-8 6-14 14-14 2 0 4 0 6 1"
      stroke="#f43f5e"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="38" cy="26" r="1.5" fill="#fff"/>
  </svg>
);