export class Calcs {
  trendy(previousValue: number, currentValue: number) {
    const percentageChange =
      ((currentValue - previousValue) / previousValue) * 100;
    return percentageChange.toFixed(2);
  }
}
