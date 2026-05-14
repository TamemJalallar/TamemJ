import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SOURCE_URL = process.env.FANTASYPROS_PPR_CHEATSHEET_URL ?? 'https://www.fantasypros.com/nfl/rankings/ppr-cheatsheets.php';
const OUTPUT_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../data/fantasypros-ppr-cheatsheet.json');

function normalizePlayerKey(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function extractAssignedJson(html, variableName, nextVariableName) {
  const pattern = new RegExp(`var\\s+${variableName}\\s*=\\s*([\\s\\S]*?);\\s*var\\s+${nextVariableName}\\s*=`, 'm');
  const match = html.match(pattern);
  if (!match?.[1]) {
    throw new Error(`Unable to find ${variableName} in FantasyPros page response.`);
  }

  return JSON.parse(match[1]);
}

const response = await fetch(SOURCE_URL, {
  headers: {
    'user-agent': 'Mozilla/5.0 (compatible; TamemJFantasyLeagueBot/1.0; +https://tamemj.com/fantasy/)'
  }
});

if (!response.ok) {
  throw new Error(`FantasyPros request failed with ${response.status} ${response.statusText}`);
}

const html = await response.text();
const ecrData = extractAssignedJson(html, 'ecrData', 'sosData');
const adpData = extractAssignedJson(html, 'adpData', 'sentimentScores');
const adpByPlayerId = new Map(adpData.map((player) => [Number(player.player_id), Number(player.rank_ecr)]));

const snapshot = {
  sourceUrl: SOURCE_URL,
  sourceLabel: 'FantasyPros 2026 PPR Cheat Sheet',
  seasonYear: Number(ecrData.year),
  scoring: ecrData.scoring,
  fetchedAt: new Date().toISOString(),
  updatedDisplay: ecrData.last_updated,
  accessed: ecrData.accessed,
  playerCount: Array.isArray(ecrData.players) ? ecrData.players.length : 0,
  players: (Array.isArray(ecrData.players) ? ecrData.players : [])
    .map((player) => ({
      key: normalizePlayerKey(player.player_name),
      playerId: Number(player.player_id),
      name: player.player_name,
      nflTeam: player.player_team_id,
      position: player.player_position_id,
      ecrRank: Number(player.rank_ecr),
      adp: adpByPlayerId.get(Number(player.player_id)),
      pageUrl: player.player_page_url
    }))
    .sort((left, right) => (left.adp ?? Number.POSITIVE_INFINITY) - (right.adp ?? Number.POSITIVE_INFINITY) || left.name.localeCompare(right.name))
};

await writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
console.log(`Saved ${snapshot.players.length} FantasyPros players to ${OUTPUT_PATH}`);
