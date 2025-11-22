export interface Team {
  id: string;
  name: string;
  colors: string;
  logoUrl: string;
  ownerName?: string; // Added for "Owned Team" mode
}

export interface Player {
  id: string;
  name: string;
  teams: Team[];
  isBot: boolean;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | ''; // Empty string for unplayed
  awayScore: number | '';
  isPlayed: boolean;
}

export interface Group {
  name: string;
  teams: Team[];
  matches: Match[];
}

export interface MatchResult {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  commentary: string;
}

export interface TeamStats {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}