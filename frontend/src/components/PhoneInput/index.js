import React from 'react';
import MaskedInput from 'react-text-mask';

const phoneNumberMask = [
  "+",
  "5",
  "5",
  " ",
  "(",
  /\d/,
  /\d/,
  ")",
  " ",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
  /\d/,
  /\d/
];

function PhoneInput({handleChange}) {
  return (
    <MaskedInput
      onChange={(e) => {handleChange(e.target.value)}}
      placeholder="Whatsapp"
      mask={phoneNumberMask}
    />
  );
}

export default PhoneInput;
