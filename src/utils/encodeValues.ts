interface encodeValuesProps {
  value: any;
}

interface decodeValuesProps {
  value: string;
}

export const encodeValues = ({ value }: encodeValuesProps): string => {
  const json = JSON.stringify(value);
  const encodedValue = btoa(json);

  return encodedValue;
};

export const decodeValues = ({ value }: decodeValuesProps) => {
  try {
    const decoded = atob(value);
    console.log(decoded)
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Error decoding value:", error);
    return null;
  }
};
