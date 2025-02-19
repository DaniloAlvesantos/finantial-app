interface encodeValuesProps {
  value: any;
}

export const encodeValues = ({ value }: encodeValuesProps): string => {
  const json = JSON.stringify(value);
  const encodedValue = btoa(encodeURIComponent(json));

  return encodedValue;
};

interface decodeValuesProps {
  value: string;
}

export const decodeValues = ({ value }: decodeValuesProps) => {
  try {
    const decoded = decodeURIComponent(atob(value));
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Error decoding value:", error);
    return null;
  }
};
