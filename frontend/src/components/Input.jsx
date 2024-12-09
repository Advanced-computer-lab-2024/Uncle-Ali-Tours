import React from 'react';

const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = '', 
  ...props 
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 ${className}`}
      {...props}
    />
  );
};

export default Input;

