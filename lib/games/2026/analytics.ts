import { AnalyticsData2026, MatchData2026 } from './match-scout/schema';

export function processAnalytics(currentAnalytics: AnalyticsData2026, matchData: MatchData2026): AnalyticsData2026 {
  const matchCount = currentAnalytics.matchCount; // This is the new match count, already incremented
  
  const autoFuel = matchData.auto?.fuelScored || 0;
  const teleopFuel = matchData.teleop?.fuelScored || 0;
  const overallFuel = autoFuel + teleopFuel;
  
  const autoMoved = matchData.auto?.moved ? 1 : 0;
  const autoDied = matchData.auto?.died ? 1 : 0;

  currentAnalytics.totalAutoFuelScored = (currentAnalytics.totalAutoFuelScored || 0) + autoFuel;
  currentAnalytics.totalTeleopFuelScored = (currentAnalytics.totalTeleopFuelScored || 0) + teleopFuel;
  currentAnalytics.totalOverallFuelScored = (currentAnalytics.totalOverallFuelScored || 0) + overallFuel;
  currentAnalytics.totalMatchesAutoMoved = (currentAnalytics.totalMatchesAutoMoved || 0) + autoMoved;
  currentAnalytics.totalMatchesAutoDied = (currentAnalytics.totalMatchesAutoDied || 0) + autoDied;

  if (matchCount > 0) {
    currentAnalytics.avgAutoFuelScored = (currentAnalytics.totalAutoFuelScored || 0) / matchCount;
    currentAnalytics.avgTeleopFuelScored = (currentAnalytics.totalTeleopFuelScored || 0) / matchCount;
    currentAnalytics.avgOverallFuelScored = (currentAnalytics.totalOverallFuelScored || 0) / matchCount;
    currentAnalytics.autoMovedPercentage = ((currentAnalytics.totalMatchesAutoMoved || 0) / matchCount) * 100;
    currentAnalytics.autoDiedPercentage = ((currentAnalytics.totalMatchesAutoDied || 0) / matchCount) * 100;
  }

  return currentAnalytics;
}

export function calculateMatchPoints(matchData: MatchData2026) {
  const autoPoints = matchData.auto?.fuelScored || 0; // Assuming 1 fuel = 1 point as requested before
  const teleopPoints = matchData.teleop?.fuelScored || 0;
  const endgamePoints = 0; // Not tracked for 2026 yet

  return {
    matchKey: matchData.matchSetup?.matchKey || '',
    auto: autoPoints,
    teleop: teleopPoints,
    endgame: endgamePoints,
    total: autoPoints + teleopPoints + endgamePoints
  };
}
