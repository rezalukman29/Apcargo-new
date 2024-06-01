import { StylesConfig } from 'react-select';

export const colourStyles: StylesConfig<any> = {
  control: (provided) => ({
    ...provided,
    background: '#fff',
    minHeight: '40px',
    height: '40px',
  }),

  valueContainer: (provided) => ({
    ...provided,
    height: '30px',
    padding: '0 6px',
  }),

  input: (provided) => ({
    ...provided,
    margin: '0px',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: '30px',
  }),
};
