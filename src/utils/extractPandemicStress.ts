interface extractPandemicStressProps {
  timelineData: any[];
}

export const extractPandemicStress = ({
  timelineData,
}: extractPandemicStressProps) => {
  const itensQuantity = Object.keys(timelineData[0]).filter((key) =>
    key.includes("item")
  );

  let startValue, endValue, startPeriod, endPeriod;
  const lastYear = new Date(timelineData[timelineData.length - 1].period);

  if (lastYear.getFullYear() < 2020) {
    return;
  }

  const results = [];

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

        const returnValue = (endValue / startValue - 1) * 100;

        results.push({
          start: { period: startPeriod, value: startValue },
          end: { period: endPeriod, value: endValue },
          returnValue: returnValue.toFixed(2),
          symbol: itensQuantity[j],
        });
      }
    }
  }

  return results;
};

export type extractPandemicStressReturnType = ReturnType<
  typeof extractPandemicStress
>;
