interface encodeValuesProps {
  value: any;
}

export const encodeValues = ({ value }: encodeValuesProps) => {
  const json = JSON.stringify(value);
  const encodedValue = btoa(json);

  return encodedValue;
};

interface decodeValuesProps {
  value: string;
}

export const decodeValues = ({ value }: decodeValuesProps) => {
  return JSON.parse(atob(value));
};
