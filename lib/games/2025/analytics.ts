export function processAnalytics(currentAnalytics: any, matchData: any) {
  const matchCount = currentAnalytics.matchCount; // This is the new match count, already incremented
  
  const getMatchTotal = (level: string) => {
    return (matchData.auto?.[level] || 0) + (matchData.teleop?.[level] || 0);
  };

  const totalL4 = (currentAnalytics.totalCoralL4 || 0) + getMatchTotal('coralL4');
  const totalL3 = (currentAnalytics.totalCoralL3 || 0) + getMatchTotal('coralL3');
  const totalL2 = (currentAnalytics.totalCoralL2 || 0) + getMatchTotal('coralL2');
  const totalL1 = (currentAnalytics.totalCoralL1 || 0) + getMatchTotal('coralL1');

  currentAnalytics.totalCoralL4 = totalL4;
  currentAnalytics.totalCoralL3 = totalL3;
  currentAnalytics.totalCoralL2 = totalL2;
  currentAnalytics.totalCoralL1 = totalL1;

  if (matchCount > 0) {
    currentAnalytics.avgCoralL4 = totalL4 / matchCount;
    currentAnalytics.avgCoralL3 = totalL3 / matchCount;
    currentAnalytics.avgCoralL2 = totalL2 / matchCount;
    currentAnalytics.avgCoralL1 = totalL1 / matchCount;
  }

  return currentAnalytics;
}
