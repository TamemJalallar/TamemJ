import type {
  FantasyDraftPick,
  FantasyKeeperCandidate,
  FantasyKeeperRules,
  FantasyKeeperSelection,
  FantasyLeagueAward,
  FantasyLeagueDataset,
  FantasyLeagueIdentity,
  FantasyLeagueRecord,
  FantasyMatchup,
  FantasyMember,
  FantasyPlayer,
  FantasySeason,
  FantasyStanding,
  FantasyTeamIdentity
} from "@/types/fantasy";

type PlayerSeed = Omit<FantasyPlayer, "id">;

function createPlayerId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toIsoDate(value: string): string {
  return new Date(value).toISOString();
}

function roundCost(previousDraftRound?: number): number | undefined {
  if (!previousDraftRound || previousDraftRound < 4) return undefined;
  return Math.max(previousDraftRound - 1, 4);
}

function createSnakeDraftPicks(
  seasonYear: number,
  teamOrder: string[],
  playerPoolByRound: PlayerSeed[][]
): FantasyDraftPick[] {
  const picks: FantasyDraftPick[] = [];
  let overallPick = 1;

  playerPoolByRound.forEach((roundPlayers, roundIndex) => {
    const round = roundIndex + 1;
    const order = round % 2 === 1 ? [...teamOrder] : [...teamOrder].reverse();

    order.forEach((teamId, pickIndex) => {
      const playerSeed = roundPlayers[pickIndex];
      const playerId = createPlayerId(playerSeed.name);

      picks.push({
        id: `${seasonYear}-${overallPick}`,
        seasonYear,
        round,
        pickInRound: pickIndex + 1,
        overallPick,
        teamId,
        playerId,
        isKeeper: false
      });

      overallPick += 1;
    });
  });

  return picks;
}

function createPlayers(...playerPools: PlayerSeed[][]): FantasyPlayer[] {
  const registry = new Map<string, FantasyPlayer>();

  playerPools.flat().forEach((player) => {
    const id = createPlayerId(player.name);
    if (!registry.has(id)) {
      registry.set(id, { id, ...player });
    }
  });

  return [...registry.values()];
}

function createCandidateId(teamId: string, playerId: string): string {
  return `${teamId}-${playerId}`;
}

const members: FantasyMember[] = [
  {
    id: "m-tamem",
    managerName: "Tamem J",
    favoriteTeam: "New York Giants",
    rivalryNote: "Always circles the Mike matchup and treats it like a title game.",
    draftTendency: "Starts RB-heavy, then looks for quarterback value after the room tilts.",
    bio: "Commissioner-style operator who likes clean keeper math, deep bench flexibility, and late-round upside swings."
  },
  {
    id: "m-arjun",
    managerName: "Arjun Patel",
    favoriteTeam: "New York Jets",
    rivalryNote: "Claims every season is a revenge tour after the 2022 semifinal loss.",
    draftTendency: "Aggressive on elite wide receivers and fast to churn the flex spot.",
    bio: "Draft-room instigator who tracks ADP closely and rarely leaves upside on the board."
  },
  {
    id: "m-mike",
    managerName: "Mike Rivera",
    favoriteTeam: "Buffalo Bills",
    rivalryNote: "Defending champion with a running joke that everyone else is drafting for second.",
    draftTendency: "Leans quarterback early when the top tier starts to disappear.",
    bio: "Current title holder who manages the waiver wire like a depth chart optimizer."
  },
  {
    id: "m-sarah",
    managerName: "Sarah Kim",
    favoriteTeam: "Philadelphia Eagles",
    rivalryNote: "Low-key feud with Jordan after three one-score games in two seasons.",
    draftTendency: "Best-ball style roster builds with multiple weekly ceiling plays.",
    bio: "Consistently dangerous once the playoffs start, even when the regular season looks average."
  },
  {
    id: "m-devin",
    managerName: "Devin Brooks",
    favoriteTeam: "Baltimore Ravens",
    rivalryNote: "Wants every trade recap logged because he remembers every tiny edge.",
    draftTendency: "Targets dual-threat quarterbacks and late-stack combinations.",
    bio: "League note-taker who will surface old receipts any time a rival talks too early."
  },
  {
    id: "m-chris",
    managerName: "Chris Morales",
    favoriteTeam: "Dallas Cowboys",
    rivalryNote: "Built an annual grudge match with Tamem around Monday night comebacks.",
    draftTendency: "Usually takes one veteran floor play too early, then wins that value back with late sleepers.",
    bio: "Former champion who still treats every Sunday slate like a tactical exercise."
  },
  {
    id: "m-maya",
    managerName: "Maya Chen",
    favoriteTeam: "San Francisco 49ers",
    rivalryNote: "Spent all offseason reminding the league about the 2024 semis miracle.",
    draftTendency: "Comfortable reaching for breakout wideouts before the market catches up.",
    bio: "Most likely to turn one keeper into a full roster identity by midseason."
  },
  {
    id: "m-jordan",
    managerName: "Jordan Ellis",
    favoriteTeam: "Pittsburgh Steelers",
    rivalryNote: "Does not forget close losses and stores matchup screenshots like evidence.",
    draftTendency: "Starts balanced and then hoards mid-round running back insurance.",
    bio: "Reliable playoff threat with a knack for surviving ugly injury weeks."
  },
  {
    id: "m-lucas",
    managerName: "Lucas Grant",
    favoriteTeam: "Detroit Lions",
    rivalryNote: "Wants one giant upset every year, usually against the top seed.",
    draftTendency: "Prefers explosive WR rooms and usually waits until late for tight end.",
    bio: "High-variance manager who can post the weekly high or low score with equal confidence."
  },
  {
    id: "m-nora",
    managerName: "Nora Sullivan",
    favoriteTeam: "Minnesota Vikings",
    rivalryNote: "Talks less than everyone else and still ends up with the sharpest waiver claims.",
    draftTendency: "Patient in the draft, then relentless on Tuesday nights.",
    bio: "Quiet lineup optimizer who gains ground in-season by outworking the margins."
  }
];

const teams: FantasyTeamIdentity[] = [
  {
    id: "team-night-shift",
    memberId: "m-tamem",
    teamName: "North Jersey Night Shift",
    shortName: "Night Shift",
    mascot: "Owls",
    colors: { primary: "#2563EB", secondary: "#06B6D4" },
    championships: 1,
    playoffAppearances: 4,
    allTimeRecord: { wins: 62, losses: 46, ties: 0 },
    legacyNames: ["Night Shift Ops", "North Jersey Night Shift"],
    notes: "Usually leads the league in bench contingency planning and pre-waiver shortlists."
  },
  {
    id: "team-hail-marys",
    memberId: "m-arjun",
    teamName: "Hudson Valley Hail Marys",
    shortName: "Hail Marys",
    mascot: "Falcons",
    colors: { primary: "#4F46E5", secondary: "#A78BFA" },
    championships: 1,
    playoffAppearances: 5,
    allTimeRecord: { wins: 65, losses: 43, ties: 0 },
    legacyNames: ["HV Hail Marys", "Hudson Valley Hail Marys"],
    notes: "Sets the tone for most trade deadlines by making the first serious offer."
  },
  {
    id: "team-brooklyn-blitz",
    memberId: "m-mike",
    teamName: "Brooklyn Blitz",
    shortName: "Blitz",
    mascot: "Bulls",
    colors: { primary: "#0F172A", secondary: "#38BDF8" },
    championships: 2,
    playoffAppearances: 6,
    allTimeRecord: { wins: 69, losses: 39, ties: 0 },
    legacyNames: ["BK Blitz", "Brooklyn Blitz"],
    notes: "Most polished roster manager in the league and the current standard everyone is chasing."
  },
  {
    id: "team-goal-line",
    memberId: "m-sarah",
    teamName: "Garden State Goal Line",
    shortName: "Goal Line",
    mascot: "Foxes",
    colors: { primary: "#16A34A", secondary: "#86EFAC" },
    championships: 1,
    playoffAppearances: 5,
    allTimeRecord: { wins: 60, losses: 48, ties: 0 },
    legacyNames: ["Goal Line Stand", "Garden State Goal Line"],
    notes: "Known for ripping off huge December runs after a middling first half."
  },
  {
    id: "team-checkdown-club",
    memberId: "m-devin",
    teamName: "Queens Checkdown Club",
    shortName: "Checkdown Club",
    mascot: "Comets",
    colors: { primary: "#9333EA", secondary: "#C4B5FD" },
    championships: 0,
    playoffAppearances: 3,
    allTimeRecord: { wins: 54, losses: 54, ties: 0 },
    legacyNames: ["Queens Checkdowns", "Queens Checkdown Club"],
    notes: "Every lineup move gets documented, defended, and usually argued back in group chat."
  },
  {
    id: "team-red-zone",
    memberId: "m-chris",
    teamName: "Bronx Red Zone",
    shortName: "Red Zone",
    mascot: "Wolves",
    colors: { primary: "#DC2626", secondary: "#FCA5A5" },
    championships: 1,
    playoffAppearances: 4,
    allTimeRecord: { wins: 58, losses: 50, ties: 0 },
    legacyNames: ["Bronx Goalposts", "Bronx Red Zone"],
    notes: "Won the ugliest title run in league history and will mention it anytime variance comes up."
  },
  {
    id: "team-lobos",
    memberId: "m-maya",
    teamName: "Long Island Lobos",
    shortName: "Lobos",
    mascot: "Lobos",
    colors: { primary: "#0891B2", secondary: "#67E8F9" },
    championships: 0,
    playoffAppearances: 3,
    allTimeRecord: { wins: 52, losses: 56, ties: 0 },
    legacyNames: ["Long Island Wolves", "Long Island Lobos"],
    notes: "Most likely to hit on the one breakout wide receiver nobody else wanted to believe in."
  },
  {
    id: "team-audible",
    memberId: "m-jordan",
    teamName: "Albany Audible",
    shortName: "Audible",
    mascot: "Owls",
    colors: { primary: "#F59E0B", secondary: "#FDE68A" },
    championships: 1,
    playoffAppearances: 4,
    allTimeRecord: { wins: 57, losses: 51, ties: 0 },
    legacyNames: ["Albany Audible", "Capital Region Audible"],
    notes: "Usually comes out of the draft looking average and turns into a problem by Week 5."
  },
  {
    id: "team-rooks",
    memberId: "m-lucas",
    teamName: "Rochester Rooks",
    shortName: "Rooks",
    mascot: "Rooks",
    colors: { primary: "#14B8A6", secondary: "#99F6E4" },
    championships: 0,
    playoffAppearances: 2,
    allTimeRecord: { wins: 49, losses: 59, ties: 0 },
    legacyNames: ["Rochester Rooks"],
    notes: "High-risk build paths produce some of the wildest box scores the league sees all year."
  },
  {
    id: "team-snow-game",
    memberId: "m-nora",
    teamName: "Syracuse Snow Game",
    shortName: "Snow Game",
    mascot: "Storm",
    colors: { primary: "#64748B", secondary: "#E2E8F0" },
    championships: 0,
    playoffAppearances: 2,
    allTimeRecord: { wins: 47, losses: 61, ties: 0 },
    legacyNames: ["Snow Game", "Syracuse Snow Game"],
    notes: "Rarely wins the headline battle, but the waiver wire often ends up running through this roster."
  }
];

const league: FantasyLeagueIdentity = {
  name: "Sunday Night Legacy League",
  slug: "sunday-night-legacy-league",
  tagline: "An original fantasy football league hub built for rivalries, records, draft receipts, and keeper strategy.",
  seasonYear: 2025,
  establishedYear: 2019,
  logoText: "SNL",
  currentWeekLabel: "Week 7",
  location: "New York / New Jersey",
  nextDraftDate: toIsoDate("2026-08-23T19:30:00-04:00"),
  platformReadiness: ["Yahoo", "Sleeper", "ESPN", "Manual"],
  leagueSize: 10
};

const keeperRules: FantasyKeeperRules = {
  maxKeepers: 2,
  sourceSeasonYear: 2024,
  targetSeasonYear: 2025,
  deadline: toIsoDate("2025-08-18T23:59:00-04:00"),
  costRule: "Keepers cost one round earlier than the prior draft round, with Round 4 as the minimum keeper cost.",
  roundPenaltyRule: "Players drafted in Rounds 1-3 are not eligible. Players already kept twice become ineligible.",
  defaultWaiverCost: "Waiver pickups default to a Round 8 cost unless the league votes to override.",
  ineligiblePlayersRule: "Any player without a valid prior draft round, or any player already kept twice, cannot be locked as a keeper.",
  notes: [
    "Maximum two keepers per team.",
    "Keeper selections lock at the deadline and occupy the matching draft slot.",
    "Use notes for injuries, offseason uncertainty, or commissioner review items.",
    "This file is safe for mock/manual data until API integration is enabled."
  ]
};

const teamOrder = teams.map((team) => team.id);

const draftPool2024: PlayerSeed[][] = [
  [
    { name: "Christian McCaffrey", position: "RB", nflTeam: "SF", adp: 1.2 },
    { name: "CeeDee Lamb", position: "WR", nflTeam: "DAL", adp: 2.1 },
    { name: "Tyreek Hill", position: "WR", nflTeam: "MIA", adp: 3.4 },
    { name: "Bijan Robinson", position: "RB", nflTeam: "ATL", adp: 4.3 },
    { name: "Breece Hall", position: "RB", nflTeam: "NYJ", adp: 5.1 },
    { name: "Amon-Ra St. Brown", position: "WR", nflTeam: "DET", adp: 6.2 },
    { name: "Justin Jefferson", position: "WR", nflTeam: "MIN", adp: 7.4 },
    { name: "Ja'Marr Chase", position: "WR", nflTeam: "CIN", adp: 8.2 },
    { name: "Saquon Barkley", position: "RB", nflTeam: "PHI", adp: 9.7 },
    { name: "A.J. Brown", position: "WR", nflTeam: "PHI", adp: 10.4 }
  ],
  [
    { name: "Josh Allen", position: "QB", nflTeam: "BUF", adp: 13.5 },
    { name: "Jalen Hurts", position: "QB", nflTeam: "PHI", adp: 15.1 },
    { name: "Kyren Williams", position: "RB", nflTeam: "LAR", adp: 16.8 },
    { name: "Garrett Wilson", position: "WR", nflTeam: "NYJ", adp: 17.9 },
    { name: "Nico Collins", position: "WR", nflTeam: "HOU", adp: 18.3 },
    { name: "Marvin Harrison Jr.", position: "WR", nflTeam: "ARI", adp: 19.7 },
    { name: "Derrick Henry", position: "RB", nflTeam: "BAL", adp: 20.1 },
    { name: "Puka Nacua", position: "WR", nflTeam: "LAR", adp: 21.3 },
    { name: "Jonathan Taylor", position: "RB", nflTeam: "IND", adp: 22.5 },
    { name: "Travis Etienne Jr.", position: "RB", nflTeam: "JAX", adp: 23.9 }
  ],
  [
    { name: "Drake London", position: "WR", nflTeam: "ATL", adp: 24.7 },
    { name: "James Cook", position: "RB", nflTeam: "BUF", adp: 25.4 },
    { name: "Lamar Jackson", position: "QB", nflTeam: "BAL", adp: 26.1 },
    { name: "Mike Evans", position: "WR", nflTeam: "TB", adp: 27.8 },
    { name: "Trey McBride", position: "TE", nflTeam: "ARI", adp: 28.9 },
    { name: "James Conner", position: "RB", nflTeam: "ARI", adp: 29.2 },
    { name: "Cooper Kupp", position: "WR", nflTeam: "LAR", adp: 30.5 },
    { name: "DJ Moore", position: "WR", nflTeam: "CHI", adp: 31.1 },
    { name: "DK Metcalf", position: "WR", nflTeam: "SEA", adp: 32.7 },
    { name: "Joe Mixon", position: "RB", nflTeam: "HOU", adp: 33.4 }
  ],
  [
    { name: "Rashee Rice", position: "WR", nflTeam: "KC", adp: 34.2 },
    { name: "Zay Flowers", position: "WR", nflTeam: "BAL", adp: 35.8 },
    { name: "Malik Nabers", position: "WR", nflTeam: "NYG", adp: 36.4 },
    { name: "Alvin Kamara", position: "RB", nflTeam: "NO", adp: 37.2 },
    { name: "DeVonta Smith", position: "WR", nflTeam: "PHI", adp: 38.1 },
    { name: "Kenneth Walker III", position: "RB", nflTeam: "SEA", adp: 39.7 },
    { name: "George Kittle", position: "TE", nflTeam: "SF", adp: 40.2 },
    { name: "Aaron Jones", position: "RB", nflTeam: "MIN", adp: 41.9 },
    { name: "Chris Olave", position: "WR", nflTeam: "NO", adp: 42.4 },
    { name: "Jayden Daniels", position: "QB", nflTeam: "WSH", adp: 43.1 }
  ],
  [
    { name: "Brian Thomas Jr.", position: "WR", nflTeam: "JAX", adp: 44.6 },
    { name: "David Montgomery", position: "RB", nflTeam: "DET", adp: 45.2 },
    { name: "Jameson Williams", position: "WR", nflTeam: "DET", adp: 46.8 },
    { name: "Rome Odunze", position: "WR", nflTeam: "CHI", adp: 47.7 },
    { name: "Courtland Sutton", position: "WR", nflTeam: "DEN", adp: 48.3 },
    { name: "Brian Robinson Jr.", position: "RB", nflTeam: "WSH", adp: 49.1 },
    { name: "Brock Bowers", position: "TE", nflTeam: "LV", adp: 50.8 },
    { name: "Jaylen Waddle", position: "WR", nflTeam: "MIA", adp: 51.2 },
    { name: "Rachaad White", position: "RB", nflTeam: "TB", adp: 52.7 },
    { name: "Dak Prescott", position: "QB", nflTeam: "DAL", adp: 53.1 }
  ],
  [
    { name: "Tee Higgins", position: "WR", nflTeam: "CIN", adp: 54.7 },
    { name: "Joe Burrow", position: "QB", nflTeam: "CIN", adp: 55.4 },
    { name: "Calvin Ridley", position: "WR", nflTeam: "TEN", adp: 56.1 },
    { name: "Mark Andrews", position: "TE", nflTeam: "BAL", adp: 57.9 },
    { name: "Isiah Pacheco", position: "RB", nflTeam: "KC", adp: 58.3 },
    { name: "Sam LaPorta", position: "TE", nflTeam: "DET", adp: 59.1 },
    { name: "Xavier Worthy", position: "WR", nflTeam: "KC", adp: 60.7 },
    { name: "Tony Pollard", position: "RB", nflTeam: "TEN", adp: 61.4 },
    { name: "Christian Kirk", position: "WR", nflTeam: "JAX", adp: 62.8 },
    { name: "Jordan Love", position: "QB", nflTeam: "GB", adp: 63.5 }
  ]
];

const draftPool2025: PlayerSeed[][] = [
  [
    { name: "Bijan Robinson", position: "RB", nflTeam: "ATL", adp: 1.3 },
    { name: "Ja'Marr Chase", position: "WR", nflTeam: "CIN", adp: 2.1 },
    { name: "CeeDee Lamb", position: "WR", nflTeam: "DAL", adp: 3.1 },
    { name: "Saquon Barkley", position: "RB", nflTeam: "PHI", adp: 4.5 },
    { name: "Justin Jefferson", position: "WR", nflTeam: "MIN", adp: 5.3 },
    { name: "Breece Hall", position: "RB", nflTeam: "NYJ", adp: 6.2 },
    { name: "Amon-Ra St. Brown", position: "WR", nflTeam: "DET", adp: 7.1 },
    { name: "Christian McCaffrey", position: "RB", nflTeam: "SF", adp: 8.8 },
    { name: "Jahmyr Gibbs", position: "RB", nflTeam: "DET", adp: 9.4 },
    { name: "Puka Nacua", position: "WR", nflTeam: "LAR", adp: 10.2 }
  ],
  [
    { name: "Nico Collins", position: "WR", nflTeam: "HOU", adp: 11.9 },
    { name: "Jonathan Taylor", position: "RB", nflTeam: "IND", adp: 12.8 },
    { name: "A.J. Brown", position: "WR", nflTeam: "PHI", adp: 13.6 },
    { name: "De'Von Achane", position: "RB", nflTeam: "MIA", adp: 14.7 },
    { name: "Josh Allen", position: "QB", nflTeam: "BUF", adp: 15.9 },
    { name: "Derrick Henry", position: "RB", nflTeam: "BAL", adp: 16.5 },
    { name: "Lamar Jackson", position: "QB", nflTeam: "BAL", adp: 17.3 },
    { name: "Garrett Wilson", position: "WR", nflTeam: "NYJ", adp: 18.8 },
    { name: "Tee Higgins", position: "WR", nflTeam: "CIN", adp: 19.1 },
    { name: "Trey McBride", position: "TE", nflTeam: "ARI", adp: 20.4 }
  ],
  [
    { name: "Jalen Hurts", position: "QB", nflTeam: "PHI", adp: 21.5 },
    { name: "Kyren Williams", position: "RB", nflTeam: "LAR", adp: 22.1 },
    { name: "Mike Evans", position: "WR", nflTeam: "TB", adp: 23.9 },
    { name: "James Cook", position: "RB", nflTeam: "BUF", adp: 24.3 },
    { name: "Drake London", position: "WR", nflTeam: "ATL", adp: 25.6 },
    { name: "Terry McLaurin", position: "WR", nflTeam: "WSH", adp: 26.4 },
    { name: "Ladd McConkey", position: "WR", nflTeam: "LAC", adp: 27.7 },
    { name: "DJ Moore", position: "WR", nflTeam: "CHI", adp: 28.9 },
    { name: "Marvin Harrison Jr.", position: "WR", nflTeam: "ARI", adp: 29.8 },
    { name: "Rashee Rice", position: "WR", nflTeam: "KC", adp: 30.6 }
  ],
  [
    { name: "Patrick Mahomes", position: "QB", nflTeam: "KC", adp: 31.4 },
    { name: "Zay Flowers", position: "WR", nflTeam: "BAL", adp: 32.2 },
    { name: "Malik Nabers", position: "WR", nflTeam: "NYG", adp: 33.7 },
    { name: "Alvin Kamara", position: "RB", nflTeam: "NO", adp: 34.8 },
    { name: "Kenneth Walker III", position: "RB", nflTeam: "SEA", adp: 35.4 },
    { name: "Chuba Hubbard", position: "RB", nflTeam: "CAR", adp: 36.5 },
    { name: "Xavier Worthy", position: "WR", nflTeam: "KC", adp: 37.6 },
    { name: "James Conner", position: "RB", nflTeam: "ARI", adp: 38.7 },
    { name: "George Kittle", position: "TE", nflTeam: "SF", adp: 39.1 },
    { name: "Jayden Daniels", position: "QB", nflTeam: "WSH", adp: 40.8 }
  ],
  [
    { name: "Brian Thomas Jr.", position: "WR", nflTeam: "JAX", adp: 41.2 },
    { name: "Chris Olave", position: "WR", nflTeam: "NO", adp: 42.5 },
    { name: "Jameson Williams", position: "WR", nflTeam: "DET", adp: 43.8 },
    { name: "Joe Mixon", position: "RB", nflTeam: "HOU", adp: 44.6 },
    { name: "Tetairoa McMillan", position: "WR", nflTeam: "CAR", adp: 45.1 },
    { name: "Brian Robinson Jr.", position: "RB", nflTeam: "WSH", adp: 46.2 },
    { name: "Brock Bowers", position: "TE", nflTeam: "LV", adp: 47.6 },
    { name: "David Montgomery", position: "RB", nflTeam: "DET", adp: 48.4 },
    { name: "Rachaad White", position: "RB", nflTeam: "TB", adp: 49.5 },
    { name: "Dak Prescott", position: "QB", nflTeam: "DAL", adp: 50.7 }
  ],
  [
    { name: "Travis Kelce", position: "TE", nflTeam: "KC", adp: 51.1 },
    { name: "Joe Burrow", position: "QB", nflTeam: "CIN", adp: 52.3 },
    { name: "Calvin Ridley", position: "WR", nflTeam: "TEN", adp: 53.5 },
    { name: "Mark Andrews", position: "TE", nflTeam: "BAL", adp: 54.2 },
    { name: "Isiah Pacheco", position: "RB", nflTeam: "KC", adp: 55.7 },
    { name: "Sam LaPorta", position: "TE", nflTeam: "DET", adp: 56.6 },
    { name: "Jaxon Smith-Njigba", position: "WR", nflTeam: "SEA", adp: 57.9 },
    { name: "Tony Pollard", position: "RB", nflTeam: "TEN", adp: 58.3 },
    { name: "Christian Kirk", position: "WR", nflTeam: "JAX", adp: 59.5 },
    { name: "Jordan Love", position: "QB", nflTeam: "GB", adp: 60.2 }
  ],
  [
    { name: "Chris Godwin", position: "WR", nflTeam: "TB", adp: 61.8 },
    { name: "Rome Odunze", position: "WR", nflTeam: "CHI", adp: 62.4 },
    { name: "Tyreek Hill", position: "WR", nflTeam: "MIA", adp: 63.7 },
    { name: "TreVeyon Henderson", position: "RB", nflTeam: "NE", adp: 64.2 },
    { name: "Bo Nix", position: "QB", nflTeam: "DEN", adp: 65.4 },
    { name: "Omarion Hampton", position: "RB", nflTeam: "LAC", adp: 66.8 },
    { name: "Caleb Williams", position: "QB", nflTeam: "CHI", adp: 67.1 },
    { name: "Jerry Jeudy", position: "WR", nflTeam: "CLE", adp: 68.3 },
    { name: "Aaron Jones", position: "RB", nflTeam: "MIN", adp: 69.5 },
    { name: "DeVonta Smith", position: "WR", nflTeam: "PHI", adp: 70.2 }
  ],
  [
    { name: "Vikings D/ST", position: "DST", nflTeam: "MIN", adp: 71.1 },
    { name: "Quinshon Judkins", position: "RB", nflTeam: "CLE", adp: 72.4 },
    { name: "Cooper Kupp", position: "WR", nflTeam: "LAR", adp: 73.7 },
    { name: "Baker Mayfield", position: "QB", nflTeam: "TB", adp: 74.2 },
    { name: "Travis Hunter", position: "WR", nflTeam: "JAX", adp: 75.1 },
    { name: "Tucker Kraft", position: "TE", nflTeam: "GB", adp: 76.5 },
    { name: "Jayden Reed", position: "WR", nflTeam: "GB", adp: 77.3 },
    { name: "Ricky Pearsall", position: "WR", nflTeam: "SF", adp: 78.1 },
    { name: "Kaleb Johnson", position: "RB", nflTeam: "PIT", adp: 79.4 },
    { name: "D'Andre Swift", position: "RB", nflTeam: "CHI", adp: 80.2 }
  ]
];

const players = createPlayers(...draftPool2024, ...draftPool2025);

const baseDraftPicks2024 = createSnakeDraftPicks(2024, teamOrder, draftPool2024);
const baseDraftPicks2025 = createSnakeDraftPicks(2025, teamOrder, draftPool2025);

const keeperCandidateOverrides = new Map<string, Partial<FantasyKeeperCandidate>>([
  [createCandidateId("team-hail-marys", createPlayerId("Chris Olave")), { notes: "Stable WR2 floor. Favorite conservative keeper if the room goes RB-heavy." }],
  [createCandidateId("team-night-shift", createPlayerId("Brian Thomas Jr.")), { notes: "Premium upside profile and a clean Round 4 cost." }],
  [createCandidateId("team-goal-line", createPlayerId("Xavier Worthy")), { notes: "Boom-bust, but the Round 5 price keeps him in play." }],
  [createCandidateId("team-lobos", createPlayerId("Brock Bowers")), { notes: "Premium tight-end edge at a Round 4 cost makes this one of the cleanest keeper calls in the league." }],
  [createCandidateId("team-snow-game", createPlayerId("Dak Prescott")), { notes: "Quarterback value is league-dependent. Strong if the room pushes QB early." }],
  [createCandidateId("team-brooklyn-blitz", createPlayerId("Jameson Williams")), { notes: "Explosive WR value if Brooklyn wants to double down on weekly spike weeks." }],
  [createCandidateId("team-audible", createPlayerId("Calvin Ridley")), { notes: "Not the safest profile, but the price is manageable if Jordan wants veteran volume." }],
  [createCandidateId("team-rooks", createPlayerId("Rachaad White")), { notes: "Useful floor keeper if Lucas wants draft flexibility instead of another early RB chase." }],
  [createCandidateId("team-red-zone", createPlayerId("Brian Robinson Jr.")), { notes: "Clear volume play with a reasonable Round 4 cost." }],
  [createCandidateId("team-red-zone", createPlayerId("Christian McCaffrey")), { eligible: false, notes: "Round 1 players are ineligible under current league rules." }],
  [createCandidateId("team-brooklyn-blitz", createPlayerId("James Cook")), { eligible: false, notes: "Round 3 cost is above the league cutoff and cannot be kept." }]
]);

const keeperCandidates: FantasyKeeperCandidate[] = baseDraftPicks2024.map((pick) => {
  const candidateId = createCandidateId(pick.teamId, pick.playerId);
  const override = keeperCandidateOverrides.get(candidateId);
  const previousDraftRound = pick.round;
  const keeperCostRound = roundCost(previousDraftRound);
  const eligible = override?.eligible ?? keeperCostRound !== undefined;

  return {
    id: candidateId,
    seasonYear: 2024,
    teamId: pick.teamId,
    playerId: pick.playerId,
    previousDraftRound,
    keeperCostRound,
    yearsKept: override?.yearsKept ?? 0,
    eligible,
    notes: override?.notes
  };
});

const keeperSelections2025: FantasyKeeperSelection[] = [
  { seasonYear: 2025, teamId: "team-night-shift", playerId: createPlayerId("Brian Thomas Jr."), keeperCostRound: 4, locked: true },
  { seasonYear: 2025, teamId: "team-hail-marys", playerId: createPlayerId("Chris Olave"), keeperCostRound: 4, locked: true },
  { seasonYear: 2025, teamId: "team-brooklyn-blitz", playerId: createPlayerId("Jameson Williams"), keeperCostRound: 4, locked: true },
  { seasonYear: 2025, teamId: "team-goal-line", playerId: createPlayerId("Xavier Worthy"), keeperCostRound: 5, locked: true },
  { seasonYear: 2025, teamId: "team-red-zone", playerId: createPlayerId("Brian Robinson Jr."), keeperCostRound: 4, locked: true },
  { seasonYear: 2025, teamId: "team-lobos", playerId: createPlayerId("Brock Bowers"), keeperCostRound: 4, locked: true },
  { seasonYear: 2025, teamId: "team-audible", playerId: createPlayerId("Calvin Ridley"), keeperCostRound: 5, locked: true },
  { seasonYear: 2025, teamId: "team-rooks", playerId: createPlayerId("Rachaad White"), keeperCostRound: 4, locked: true },
  { seasonYear: 2025, teamId: "team-snow-game", playerId: createPlayerId("Dak Prescott"), keeperCostRound: 4, locked: true }
];

const keeperSelectionMap = new Map(
  keeperSelections2025.map((selection) => [`${selection.teamId}:${selection.playerId}`, selection])
);

const draftPicks2025: FantasyDraftPick[] = baseDraftPicks2025.map((pick) => {
  const keeperSelection = keeperSelectionMap.get(`${pick.teamId}:${pick.playerId}`);

  if (!keeperSelection) {
    return pick;
  }

  return {
    ...pick,
    isKeeper: true,
    keeperCostRound: keeperSelection.keeperCostRound,
    notes: "Locked keeper"
  };
});

const standings2025: FantasyStanding[] = [
  { teamId: "team-brooklyn-blitz", rank: 1, wins: 6, losses: 1, ties: 0, pointsFor: 934.8, pointsAgainst: 801.4, streak: "W4" },
  { teamId: "team-goal-line", rank: 2, wins: 5, losses: 2, ties: 0, pointsFor: 901.3, pointsAgainst: 847.2, streak: "W2" },
  { teamId: "team-night-shift", rank: 3, wins: 5, losses: 2, ties: 0, pointsFor: 889.5, pointsAgainst: 812.9, streak: "W1" },
  { teamId: "team-lobos", rank: 4, wins: 4, losses: 3, ties: 0, pointsFor: 873.1, pointsAgainst: 860.8, streak: "L1" },
  { teamId: "team-hail-marys", rank: 5, wins: 4, losses: 3, ties: 0, pointsFor: 858.2, pointsAgainst: 845.6, streak: "W3" },
  { teamId: "team-red-zone", rank: 6, wins: 3, losses: 4, ties: 0, pointsFor: 842.4, pointsAgainst: 855.1, streak: "L2" },
  { teamId: "team-audible", rank: 7, wins: 3, losses: 4, ties: 0, pointsFor: 828.7, pointsAgainst: 866.9, streak: "W1" },
  { teamId: "team-snow-game", rank: 8, wins: 2, losses: 5, ties: 0, pointsFor: 814.3, pointsAgainst: 889.6, streak: "L3" },
  { teamId: "team-checkdown-club", rank: 9, wins: 2, losses: 5, ties: 0, pointsFor: 803.1, pointsAgainst: 876.5, streak: "L1" },
  { teamId: "team-rooks", rank: 10, wins: 1, losses: 6, ties: 0, pointsFor: 775.8, pointsAgainst: 907.4, streak: "L4" }
];

const matchups2025: FantasyMatchup[] = [
  { id: "wk7-1", week: 7, homeTeamId: "team-night-shift", awayTeamId: "team-lobos", homeScore: 128.6, awayScore: 126.9, status: "final", note: "Closest matchup of the week" },
  { id: "wk7-2", week: 7, homeTeamId: "team-brooklyn-blitz", awayTeamId: "team-checkdown-club", homeScore: 151.4, awayScore: 109.2, status: "final", note: "Biggest blowout of the week" },
  { id: "wk7-3", week: 7, homeTeamId: "team-goal-line", awayTeamId: "team-red-zone", homeScore: 137.3, awayScore: 130.7, status: "final" },
  { id: "wk7-4", week: 7, homeTeamId: "team-hail-marys", awayTeamId: "team-rooks", homeScore: 142.1, awayScore: 117.8, status: "final" },
  { id: "wk7-5", week: 7, homeTeamId: "team-audible", awayTeamId: "team-snow-game", homeScore: 121.7, awayScore: 119.5, status: "final" }
];

const seasons: FantasySeason[] = [
  {
    id: "season-2019",
    year: 2019,
    label: "2019 Inaugural Season",
    status: "completed",
    weekLabel: "Archive",
    teamOrder,
    standings: [],
    matchups: [],
    draftPicks: [],
    draftDate: toIsoDate("2019-08-25T19:30:00-04:00"),
    draftRounds: 0,
    keeperSelections: [],
    summary: {
      championTeamId: "team-hail-marys",
      runnerUpTeamId: "team-audible",
      regularSeasonWinnerTeamId: "team-hail-marys",
      highestScoringTeamId: "team-hail-marys",
      worstRecordTeamId: "team-snow-game"
    },
    seasonNotes: ["Inaugural league season."]
  },
  {
    id: "season-2020",
    year: 2020,
    label: "2020 Bubble Season",
    status: "completed",
    weekLabel: "Archive",
    teamOrder,
    standings: [],
    matchups: [],
    draftPicks: [],
    draftDate: toIsoDate("2020-08-30T19:30:00-04:00"),
    draftRounds: 0,
    keeperSelections: [],
    summary: {
      championTeamId: "team-brooklyn-blitz",
      runnerUpTeamId: "team-night-shift",
      regularSeasonWinnerTeamId: "team-brooklyn-blitz",
      highestScoringTeamId: "team-brooklyn-blitz",
      worstRecordTeamId: "team-rooks"
    },
    seasonNotes: ["Remote draft year with expanded bench depth."]
  },
  {
    id: "season-2021",
    year: 2021,
    label: "2021 Rivalry Season",
    status: "completed",
    weekLabel: "Archive",
    teamOrder,
    standings: [],
    matchups: [],
    draftPicks: [],
    draftDate: toIsoDate("2021-08-29T19:30:00-04:00"),
    draftRounds: 0,
    keeperSelections: [],
    summary: {
      championTeamId: "team-goal-line",
      runnerUpTeamId: "team-red-zone",
      regularSeasonWinnerTeamId: "team-goal-line",
      highestScoringTeamId: "team-goal-line",
      worstRecordTeamId: "team-checkdown-club"
    },
    seasonNotes: ["First year the league added dedicated keeper receipts into the draft recap."]
  },
  {
    id: "season-2022",
    year: 2022,
    label: "2022 Keeper Era Reset",
    status: "completed",
    weekLabel: "Archive",
    teamOrder,
    standings: [],
    matchups: [],
    draftPicks: [],
    draftDate: toIsoDate("2022-08-28T19:30:00-04:00"),
    draftRounds: 0,
    keeperSelections: [],
    summary: {
      championTeamId: "team-night-shift",
      runnerUpTeamId: "team-hail-marys",
      regularSeasonWinnerTeamId: "team-night-shift",
      highestScoringTeamId: "team-night-shift",
      worstRecordTeamId: "team-snow-game"
    },
    seasonNotes: ["Keeper cap formalized at two players."]
  },
  {
    id: "season-2023",
    year: 2023,
    label: "2023 Chaos Season",
    status: "completed",
    weekLabel: "Archive",
    teamOrder,
    standings: [],
    matchups: [],
    draftPicks: [],
    draftDate: toIsoDate("2023-08-27T19:30:00-04:00"),
    draftRounds: 0,
    keeperSelections: [],
    summary: {
      championTeamId: "team-red-zone",
      runnerUpTeamId: "team-brooklyn-blitz",
      regularSeasonWinnerTeamId: "team-brooklyn-blitz",
      highestScoringTeamId: "team-red-zone",
      worstRecordTeamId: "team-rooks"
    },
    seasonNotes: ["Wild-card team won it all after sneaking into the playoffs with a late streak."]
  },
  {
    id: "season-2024",
    year: 2024,
    label: "2024 Championship Season",
    status: "completed",
    weekLabel: "Final",
    teamOrder,
    standings: [
      { teamId: "team-brooklyn-blitz", rank: 1, wins: 10, losses: 4, ties: 0, pointsFor: 1821.5, pointsAgainst: 1608.9, streak: "W3" },
      { teamId: "team-lobos", rank: 2, wins: 9, losses: 5, ties: 0, pointsFor: 1760.7, pointsAgainst: 1655.2, streak: "L1" },
      { teamId: "team-night-shift", rank: 3, wins: 8, losses: 6, ties: 0, pointsFor: 1734.2, pointsAgainst: 1661.4, streak: "W1" },
      { teamId: "team-goal-line", rank: 4, wins: 8, losses: 6, ties: 0, pointsFor: 1719.8, pointsAgainst: 1699.6, streak: "W2" },
      { teamId: "team-hail-marys", rank: 5, wins: 7, losses: 7, ties: 0, pointsFor: 1688.4, pointsAgainst: 1693.3, streak: "L2" },
      { teamId: "team-audible", rank: 6, wins: 7, losses: 7, ties: 0, pointsFor: 1661.1, pointsAgainst: 1674.8, streak: "W1" },
      { teamId: "team-red-zone", rank: 7, wins: 6, losses: 8, ties: 0, pointsFor: 1638.6, pointsAgainst: 1702.5, streak: "L1" },
      { teamId: "team-checkdown-club", rank: 8, wins: 5, losses: 9, ties: 0, pointsFor: 1609.9, pointsAgainst: 1735.6, streak: "L3" },
      { teamId: "team-snow-game", rank: 9, wins: 4, losses: 10, ties: 0, pointsFor: 1568.2, pointsAgainst: 1769.2, streak: "W1" },
      { teamId: "team-rooks", rank: 10, wins: 3, losses: 11, ties: 0, pointsFor: 1517.4, pointsAgainst: 1804.1, streak: "L4" }
    ],
    matchups: [],
    draftPicks: baseDraftPicks2024,
    draftDate: toIsoDate("2024-08-25T19:30:00-04:00"),
    draftRounds: 6,
    keeperSelections: [],
    summary: {
      championTeamId: "team-brooklyn-blitz",
      runnerUpTeamId: "team-lobos",
      regularSeasonWinnerTeamId: "team-brooklyn-blitz",
      highestScoringTeamId: "team-brooklyn-blitz",
      worstRecordTeamId: "team-rooks"
    },
    seasonNotes: [
      "Brooklyn Blitz finished the job after securing the one seed.",
      "Long Island Lobos posted the playoff upset of the year in the semifinals."
    ]
  },
  {
    id: "season-2025",
    year: 2025,
    label: "2025 Current Season",
    status: "active",
    weekLabel: "Week 7",
    teamOrder,
    standings: standings2025,
    matchups: matchups2025,
    draftPicks: draftPicks2025,
    draftDate: toIsoDate("2025-08-24T19:30:00-04:00"),
    draftRounds: 8,
    keeperSelections: keeperSelections2025,
    summary: {
      championTeamId: "team-brooklyn-blitz",
      runnerUpTeamId: "team-goal-line",
      regularSeasonWinnerTeamId: "team-brooklyn-blitz",
      highestScoringTeamId: "team-brooklyn-blitz",
      worstRecordTeamId: "team-rooks"
    },
    seasonNotes: [
      "Six keepers were locked before the draft, with the tight end market moving up because of early value plays.",
      "The title race is wide open, but Brooklyn Blitz still holds the best profile through seven weeks.",
      "Waiver and draft countdown cards are placeholders until live provider sync is enabled."
    ]
  }
];

const records: FantasyLeagueRecord[] = [
  {
    id: "record-highest-weekly-score",
    label: "Highest weekly score",
    category: "weekly",
    value: "176.4 points",
    seasonYear: 2024,
    teamId: "team-brooklyn-blitz",
    memberId: "m-mike",
    context: "Brooklyn Blitz dropped the single highest weekly total in the Week 11 rivalry matchup."
  },
  {
    id: "record-lowest-weekly-score",
    label: "Lowest weekly score",
    category: "weekly",
    value: "68.9 points",
    seasonYear: 2023,
    teamId: "team-rooks",
    memberId: "m-lucas",
    context: "Rochester Rooks lost half the lineup to byes and weather and still never heard the end of it."
  },
  {
    id: "record-biggest-blowout",
    label: "Biggest blowout",
    category: "matchup",
    value: "47.8 points",
    seasonYear: 2025,
    teamId: "team-brooklyn-blitz",
    memberId: "m-mike",
    context: "Brooklyn Blitz buried Queens Checkdown Club in Week 7."
  },
  {
    id: "record-closest-win",
    label: "Closest win",
    category: "matchup",
    value: "0.3 points",
    seasonYear: 2022,
    teamId: "team-night-shift",
    memberId: "m-tamem",
    context: "A Monday stat correction flipped the result just before waivers ran."
  },
  {
    id: "record-best-draft-pick",
    label: "Best draft pick",
    category: "draft",
    value: "Brian Thomas Jr. in Round 5",
    seasonYear: 2024,
    teamId: "team-night-shift",
    memberId: "m-tamem",
    context: "A Round 5 rookie swing turned into a Round 4 keeper conversation one year later."
  },
  {
    id: "record-worst-draft-pick",
    label: "Worst draft pick",
    category: "draft",
    value: "Round 2 quarterback reach",
    seasonYear: 2021,
    teamId: "team-checkdown-club",
    memberId: "m-devin",
    context: "The room still uses it as shorthand for overreacting to an ADP run."
  },
  {
    id: "record-most-points-season",
    label: "Most points in a season",
    category: "season",
    value: "1,821.5 points",
    seasonYear: 2024,
    teamId: "team-brooklyn-blitz",
    memberId: "m-mike",
    context: "The 2024 champion set the current benchmark for regular-season output."
  },
  {
    id: "record-most-playoff-appearances",
    label: "Most playoff appearances",
    category: "manager",
    value: "6 appearances",
    seasonYear: 2025,
    teamId: "team-brooklyn-blitz",
    memberId: "m-mike",
    context: "No other manager has made the bracket more consistently."
  }
];

const awards: FantasyLeagueAward[] = [
  {
    id: "award-waiver-pickup-2024",
    title: "Waiver pickup of the year",
    seasonYear: 2024,
    teamId: "team-snow-game",
    memberId: "m-nora",
    summary: "Late-September tight end stash turned into four usable starts during bye-week chaos."
  },
  {
    id: "award-trade-of-the-year-2024",
    title: "Trade of the year",
    seasonYear: 2024,
    teamId: "team-lobos",
    memberId: "m-maya",
    summary: "A two-for-one WR upgrade gave Long Island Lobos the ceiling needed for the semifinal upset."
  },
  {
    id: "award-manager-of-the-year-2024",
    title: "Manager of the year",
    seasonYear: 2024,
    teamId: "team-brooklyn-blitz",
    memberId: "m-mike",
    summary: "Top seed, top scorer, and a clean title run with very few wasted roster spots."
  },
  {
    id: "award-draft-room-heat-check-2025",
    title: "Draft room heat check",
    seasonYear: 2025,
    teamId: "team-night-shift",
    memberId: "m-tamem",
    summary: "Most talked-about board start after passing on quarterback runs and still landing value later."
  },
  {
    id: "award-keeper-value-2025",
    title: "Best keeper value",
    seasonYear: 2025,
    teamId: "team-lobos",
    memberId: "m-maya",
    summary: "Jaylen Waddle at a Round 5 cost kept Long Island anchored while others chased ceiling."
  }
];

export const fantasyLeague: FantasyLeagueDataset = {
  league,
  keeperRules,
  members,
  teams,
  players,
  seasons,
  keeperCandidates,
  records,
  awards
};

export function getFantasyLeague(): FantasyLeagueDataset {
  return fantasyLeague;
}

export function getFantasySeason(year: number): FantasySeason | undefined {
  return fantasyLeague.seasons.find((season) => season.year === year);
}

export function getActiveFantasySeason(): FantasySeason {
  return fantasyLeague.seasons.find((season) => season.status === "active") ?? fantasyLeague.seasons[fantasyLeague.seasons.length - 1];
}

export function getFantasyPlayersById(): Map<string, FantasyPlayer> {
  return new Map(fantasyLeague.players.map((player) => [player.id, player]));
}

export function getFantasyTeamsById(): Map<string, FantasyTeamIdentity> {
  return new Map(fantasyLeague.teams.map((team) => [team.id, team]));
}

export function getFantasyMembersById(): Map<string, FantasyMember> {
  return new Map(fantasyLeague.members.map((member) => [member.id, member]));
}
