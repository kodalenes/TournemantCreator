import { Team } from './types';

export const DEFAULT_TEAM_LOGO = "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";

// Legacy export to avoid breaking other files immediately, 
// though App.tsx will check the database file.
// In a full refactor, we would remove this, but for now we keep an empty array 
// or re-export from database if strictly needed by types, 
// but we will update App.tsx to use the new file.
export const AVAILABLE_TEAMS: Team[] = []; 
