import React from 'react';

interface SpiderManLogoProps {
  className?: string;
  size?: number;
}

export const SpiderManLogo: React.FC<SpiderManLogoProps> = ({ className = '', size = 44 }) => {
  return (
    <img
      src="/spiderman-logo.png"
      alt="Spider-Man Logo"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`shrink-0 object-contain drop-shadow-[2px_2px_0px_#000] transition-transform duration-300 hover:scale-110 ${className}`}
    />
  );
};