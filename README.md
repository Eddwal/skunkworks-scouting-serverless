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
After running the script, developers simply need to:
1. Add year-specific validation fields to `lib/games/<year>/schemas.ts`.
2. Add year-specific `<Input>` and `<Checkbox>` UI components to `lib/games/<year>/pit-scout/robot.tsx` and `capabilities.tsx`.
3. Add the viewer elements to `lib/games/<year>/team-viewer.tsx` so the data displays correctly on the team viewer page.
