import React from "react";

const errorStyle = {
  color: 'red',
  fontSize: '10px',
};

const Input = ({ type, placeholder, value, onChange, error, name, style }) => (
  <>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      style={style}
    />
    <div style={errorStyle}>{error}</div>
  </>
);

export default Input;

