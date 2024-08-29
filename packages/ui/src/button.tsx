"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean; // Added disabled prop
}

export const Button = ({ onClick, children, disabled }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled} // Set disabled attribute
    >
      {children}
    </button>
  );
};
