import React from 'react';

const Textarea = ({ 
  placeholder, 
  value, 
  onChange, 
  rows = 4, 
  className = '', 
  ...props 
}) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 ${className}`}
      {...props}
    />
  );
};

export default Textarea;

