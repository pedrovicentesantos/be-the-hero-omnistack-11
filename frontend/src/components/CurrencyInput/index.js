import React from 'react';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

const defaultMaskOptions = {
  prefix: 'R$',
  suffix: '',
  includeThousandsSeparator: false,
  allowDecimal: true,
  decimalSymbol: '.',
  decimalLimit: 2,
  integerLimit: 7,
  allowNegative: false,
  allowLeadingZeroes: false
}

function CurrencyInput({ handleChange }) {
  const currencyMask = createNumberMask({
    ...defaultMaskOptions,
  });

  return (
    <MaskedInput
      mask={currencyMask}
      placeholder="Valor em reais"
      onChange={handleChange}
    />
  );
}

export default CurrencyInput;
