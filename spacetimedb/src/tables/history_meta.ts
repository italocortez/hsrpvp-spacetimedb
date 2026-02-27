import { table, t } from 'spacetimedb/server';
import { MatchSettings } from './match_session';
import { MatchSide } from './match_participants';

export const HistoryMeta = table({
    name: 'history_meta',
    public: true,
    indexes: [
        { name: 'by_date', algorithm: 'btree', columns: ['endedAt'] },
    ],
}, {
    matchId: t.u64().primaryKey(), // Re-use the session ID
    settings: MatchSettings,
    winner: MatchSide, // Red, Blue, or None (Draw)
    endedAt: t.timestamp(),
    hostName: t.string(),
    redTeamNames: t.array(t.string()),
    blueTeamNames: t.array(t.string()),
});