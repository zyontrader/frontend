import React, { useState, useEffect, useRef } from 'react';
import styles from './CustomStepper.module.css';

const getNearestMultiple = (value, multiple, min) => {
  console.log('getNearestMultiple', value, multiple, min);
  if (multiple <= 0) return value;
  let rounded = Math.round(value / multiple) * multiple;
  if (min !== undefined && rounded < min) return min;
  return rounded;
};

const CustomStepper = ({ value, onChange, min = 0, step = 1, style = {}, ...rest }) => {
  // Remove browser arrows
  const inputStyle = {
    textAlign: 'center',
    fontSize: 14,
    ...style,
  };

  const [inputValue, setInputValue] = useState(String(value));
  const inputRef = useRef();

  // Keep local inputValue in sync with value prop
  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  // Hide arrows in Chrome
  const inputProps = {
    ...rest,
    style: inputStyle,
    type: 'number',
    min,
    step,
    onWheel: e => e.target.blur(), // Prevent scroll changing value
    value: inputValue,
    onChange: e => {
      setInputValue(e.target.value);
    },
    onBlur: e => {
      let val = Number(e.target.value);
      if (isNaN(val)) val = min;
      val = getNearestMultiple(val, step, min);
      setInputValue(String(val)); // Always set to snapped value
      if (val !== value) onChange(val); // Only call onChange if changed
    },
    onKeyDown: e => {
      if (e.key === 'Enter') {
        let val = Number(e.target.value);
        if (isNaN(val)) val = min;
        val = getNearestMultiple(val, step, min);
        setInputValue(String(val)); // Always set to snapped value
        if (val !== value) onChange(val); // Only call onChange if changed
        if (inputRef.current) inputRef.current.blur();
      }
    },
  };

  const handleStep = (dir) => {
    let newVal = value + dir * step;
    if (min !== undefined && newVal < min) newVal = min;
    newVal = getNearestMultiple(newVal, step, min);
    onChange(newVal);
  };

  return (
    <div className={styles.noSpinner} style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: 6, overflow: 'hidden', width: 120, background: '#fff' }}>
      <button
        type="button"
        style={{ width: 32, height: 32, border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: '#374151' }}
        onClick={() => handleStep(-1)}
        tabIndex={-1}
      >
        -
      </button>
      <input {...inputProps} ref={inputRef} className={styles.noSpinnerInput} />
      <button
        type="button"
        style={{ width: 32, height: 32, border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: '#374151' }}
        onClick={() => handleStep(1)}
        tabIndex={-1}
      >
        +
      </button>
    </div>
  );
};

export default CustomStepper; 