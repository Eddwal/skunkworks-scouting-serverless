export function processAnalytics(currentAnalytics: any, matchData: any) {
  const matchCount = currentAnalytics.matchCount; // This is the new match count, already incremented
  
  const getMatchTotal = (field: string) => {
    return (matchData.auto?.[field] || 0) + (matchData.teleop?.[field] || 0);
  };

  const totalFuel = (currentAnalytics.totalFuelScored || 0) + getMatchTotal('fuelScored');
  currentAnalytics.totalFuelScored = totalFuel;

  if (matchCount > 0) {
    currentAnalytics.avgFuelScored = totalFuel / matchCount;
  }

  return currentAnalytics;
}
