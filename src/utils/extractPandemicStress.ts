interface extractPandemicStressProps {
  timelineData: any[];
}

export const extractPandemicStress = ({
  timelineData,
}: extractPandemicStressProps) => {
  let pandemicEnding = new Date("05-01-2023");

  const itensQuantity = Object.keys(timelineData[0]).filter(
    (key) => key !== "period"
  );

  let startValue, endValue, startPeriod, endPeriod;
  const lastYear = new Date(timelineData[timelineData.length - 1].period);

  if (lastYear.getFullYear() < 2020) {
    return;
  }

  if (lastYear.getFullYear() < 2023) {
    pandemicEnding = lastYear;
  }

  for (let i = 0; i < timelineData.length; i++) {
    const currentDate = new Date(timelineData[i].period);
    for (let j = 0; j < itensQuantity.length; j++) {
      if (currentDate.getMonth() === 0 && currentDate.getFullYear() === 2020) {
        startValue = timelineData[i][itensQuantity[j]];
        startPeriod = timelineData[i].period;
      }

      if (currentDate.getMonth() === 2 && currentDate.getFullYear() === 2020) {
        endValue = timelineData[i][itensQuantity[j]];
        endPeriod = timelineData[i].period;
      }
    }
  }

  const result = (endValue / startValue - 1) * 100;

  return {
    start: { period: startPeriod, value: startValue },
    end: { period: endPeriod, value: endValue },
    result: result.toFixed(2),
    symbol: itensQuantity[0]
  };
};

export type extractPandemicStressReturnType = ReturnType<typeof extractPandemicStress>; 

/*
from 2020-march to 2023-may

interface extractPandemicStressProps {
  timelineData: any[];
}

export const extractPandemicStress = ({
  timelineData,
}: extractPandemicStressProps) => {
  let pandemicEnding = new Date("05-01-2023");

  const itensQuantity = Object.keys(timelineData[0]).filter(
    (key) => key !== "period"
  );

  let startValue, endValue, startPeriod, endPeriod;
  const lastYear = new Date(timelineData[timelineData.length - 1].period);

  if (lastYear.getFullYear() < 2020) {
    return;
  }

  if (lastYear.getFullYear() < 2023) {
    pandemicEnding = lastYear;
  }

  for (let i = 0; i < timelineData.length; i++) {
    const currentDate = new Date(timelineData[i].period);
    for (let j = 0; j < itensQuantity.length; j++) {
      if (currentDate.getMonth() === 2 && currentDate.getFullYear() === 2020) {
        startValue = timelineData[i][itensQuantity[j]];
        startPeriod = timelineData[i].period;
      }

      if (
        currentDate.getMonth() === 4 &&
        currentDate.getFullYear() === pandemicEnding.getFullYear()
      ) {
        endValue = timelineData[i][itensQuantity[j]];
        endPeriod = timelineData[i].period;
      }
    }
  }

  const result = (endValue / startValue - 1) * 100;

  return {
    start: { period: startPeriod, value: startValue },
    end: { period: endPeriod, value: endValue },
    result,
  };
};

*/