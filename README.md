# Skunkworks Scouting App
## Adding a New Game Year
Run the following command:

```bash
npm run generate-year <year> "<Game Name>"
```

**Example:**
```bash
npm run generate-year 2027 "Biocore"
```

### What this script does:
1. **Creates scaffolding**: Generates a new directory in `lib/games/<year>/` containing all required components for pit scouting (`robot.tsx`, `capabilities.tsx`, `team-viewer.tsx`, and `schemas.ts`).
2. **Implements boilerplate**: The generated files automatically extend the base schemas and wrap the UI fields in the `BasePitScoutRobot` and `BasePitScoutCapabilities` wrappers, handling standard robot dimensions and drivetrain data automatically.
3. **Registers the game**: The script automatically injects the new game config into the `GAME_CONFIGS` registry located in `lib/games/index.ts`.

### Next Steps:
After running the script, you will need to implement the game-specific logic. The system is highly modular, so you only need to edit files within your newly generated `lib/games/<year>/` directory:

1. **Define Data Models**: 
   Open `lib/games/<year>/schemas.ts`. This file uses [Zod](https://zod.dev/) to define the data structures for both Pit and Match scouting. Add your new game-specific fields (e.g., `canScoreHigh: z.boolean()`) to the appropriate schemas. You can also define custom analytics fields in `analyticsSchema` which will automatically extend the base analytics structure. These schemas automatically power the form validation and the TypeScript types across the app.

2. **Build Scouting Forms**: 
   Update the form components to include inputs for your new schema fields. These forms use [React Hook Form](https://react-hook-form.com/) combined with [Shadcn UI](https://ui.shadcn.com/docs/components/form) components.
   - **Pit Scouting**: Edit `lib/games/<year>/pit-scout/robot.tsx` and `lib/games/<year>/pit-scout/capabilities.tsx`.
   - **Match Scouting**: Edit `lib/games/<year>/match-scout/auto.tsx`, `lib/games/<year>/match-scout/teleop.tsx`, and `lib/games/<year>/match-scout/endgame.tsx`.

3. **Configure the Team Viewer**: 
   To display the collected data to users, edit `lib/games/<year>/team-viewer.tsx`. You will need to implement the `RobotViewerComponent`, `CapabilitiesViewerComponent`, and optionally the `AnalyticsViewerComponent` to format and display the year-specific data properly on the main Team Viewer dashboard.

4. **Build the Main Dashboard (Optional)**:
   You can provide a custom dashboard view for the home page of the game by passing a `DashboardComponent` to your year's `GameConfig` in `lib/games/<year>/index.ts`.

## Local Development & Emulators

This project is configured to use Firebase Local Emulators for safe, offline development without affecting production data.

1. **Start the Emulators**: 
   Run `npm run emulators`. This will start the local Firebase App Hosting emulator (which builds and serves your Next.js app), Auth emulator, and Firestore emulator. The web app will automatically be available at `http://localhost:5002`. It also automatically saves and loads emulator data from the `./emulator-data` directory on exit.

2. **Seed a Demo Event**: 
   If your emulator database is empty, you can populate it with test teams and matches. **While the emulator is running**, open a new terminal tab and run:
   ```bash
   node scripts/add-demo-event.mjs --year 2027 --name "My Demo Event"
   ```
   Replacing the year and the event name with the current info

## Firebase & Architecture

### Database Structure
The application uses a **Cloud Firestore** document DB structured around events:
- `events/{eventId}`: Stores metadata for a given competition (e.g., 2026wasam).
- `events/{eventId}/teams/{teamId}`: This contains all data collected for a given team, including match scout data and pit scout data
  - `robot` & `capabilities`: Contains the data collected directly from Pit Scouting.
  - `analytics`: Contains the aggregated stats calculated from all Match Scouting reports.

### How Analytics Work
The application stores pre-aggregated data in the `analytics` field directly on the team's document (`events/{eventId}/teams/{teamId}`).

When Match Scouting data is submitted, it updates this centralized `analytics` object for a given team.

The base analytics schema enforces standard metrics across all years (e.g., `matchCount`, `uptime`, `fouls`). By defining an `analyticsSchema` in your year-specific config, you can define custom fields (like `totalCoralScored` or `avgCoralScored`).

**Adding Year-Specific Analytics Logic:**
To inject your year-specific metrics into this pipeline, you need to implement the `processAnalytics` function located in `lib/games/<year>/analytics.ts`.

The central upload transaction will automatically retrieve the existing team document, increment all standard base metrics (like fouls and match counts), and then pass the resulting analytics object to your game-specific `processAnalytics` function!

For example, to calculate a running total and average for a custom `coralScored` field:
```typescript
// Inside lib/games/<year>/analytics.ts
export function processAnalytics(currentAnalytics: any, matchData: any) {
  // Read the new coral scored from the submitted Match Scouting form
  const newCoralScored = matchData.teleop?.coralScored || 0;

  // Calculate the running total and average
  const totalCoral = (currentAnalytics.totalCoral || 0) + newCoralScored;
  currentAnalytics.totalCoral = totalCoral;
  currentAnalytics.avgCoralScored = totalCoral / currentAnalytics.matchCount;

  return currentAnalytics;
}
```