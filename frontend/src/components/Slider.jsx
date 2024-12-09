import React, { useState } from 'react';

const Slider = ({ min, max, step, value, onValueChange }) => {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setLocalValue(newValue);
    onValueChange([newValue, localValue[1]]);
  };

  const handleChangeEnd = (e) => {
    const newValue = parseInt(e.target.value, 10);
    onValueChange([newValue, localValue[1]]);
  };

  return (
    <div className="w-full">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={localValue[0]}
        onChange={handleChange}
        onMouseUp={handleChangeEnd}
        onTouchEnd={handleChangeEnd}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={localValue[1]}
        onChange={(e) => {
          const newValue = parseInt(e.target.value, 10);
          setLocalValue([localValue[0], newValue]);
          onValueChange([localValue[0], newValue]);
        }}
        onMouseUp={handleChangeEnd}
        onTouchEnd={handleChangeEnd}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
      />
    </div>
  );
};

export default Slider;

