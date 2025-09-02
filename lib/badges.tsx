import React from 'react';

export const BADGES = [
  "director",
  "guionista", 
  "novato",
  "spamero",
  "dibujante",
  "animador",
  "hacker",
  "superfan",
  "fan",
  "masteranimador"
] as const;

type BadgeType = typeof BADGES[number];

export const getBadgeIcon = (badge: string, size: number = 16): React.ReactElement => {
  const iconStyle: React.CSSProperties = { width: size, height: size };
  
  switch(badge as BadgeType) {
    case 'director':
      // Clapperboard icon equivalent
      return (
        <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v3H2V3zM2 8v6a2 2 0 002 2h12a2 2 0 002-2V8H2zm3 4a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      );
    case 'guionista':
      // Pencil icon equivalent  
      return (
        <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      );
    case 'novato':
      // UserPlus icon equivalent
      return (
        <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
        </svg>
      );
    case 'spamero':
      // Users icon equivalent (but red for spam)
      return (
        <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      );
    case 'dibujante':
      // Brush icon equivalent
      return (
        <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      );
    case 'animador':
      // Video icon equivalent
      return (
        <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
        </svg>
      );
    case 'hacker':
      // Code icon equivalent
      return (
        <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    case 'superfan':
      // Star icon equivalent
      return (
        <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    case 'fan':
      // HeartHandshake icon equivalent
      return (
        <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      );
    case 'masteranimador':
      // Award icon equivalent
      return (
        <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
  }
};

export const getBadgeColor = (badge: string): string => {
  switch(badge as BadgeType) {
    case 'director': 
      return 'bg-rose-100 text-rose-800 border border-rose-300';
    case 'guionista': 
      return 'bg-amber-100 text-amber-800 border border-amber-300';
    case 'novato': 
      return 'bg-blue-100 text-blue-800 border border-blue-300';
    case 'spamero': 
      return 'bg-red-100 text-red-800 border border-red-300';
    case 'dibujante': 
      return 'bg-green-100 text-green-800 border border-green-300';
    case 'animador': 
      return 'bg-purple-100 text-purple-800 border border-purple-300';
    case 'hacker': 
      return 'bg-slate-100 text-slate-800 border border-slate-300';
    case 'superfan': 
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    case 'fan': 
      return 'bg-pink-100 text-pink-800 border border-pink-300';
    case 'masteranimador': 
      return 'bg-indigo-100 text-indigo-800 border border-indigo-300';
    default: 
      return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
};