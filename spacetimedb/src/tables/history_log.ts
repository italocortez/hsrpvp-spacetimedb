import { table, t } from 'spacetimedb/server';
import { StepAction } from './match_step';

// We snapshot the calculated cost for every character involved in the match
// This ensures if we buff "Acheron" tomorrow, old match history doesn't break.
export const CharSnapshot = t.object('CharSnapshot', {
    charName: t.string(),
    finalCost: t.f32(),
    lightconeName: t.string().optional(),
});

export const HistoryLog = table({
    name: 'history_log',
    public: true, // Or false if you only want to serve this via specific Reducers/Queries
}, {
    matchId: t.u64().primaryKey(), // FK

    // The sequence of events for the replay player
    steps: t.array(t.object('HistoryStep', {
        action: StepAction,
        timestamp: t.timestamp(),
        actorId: t.string(), // Store as string (HexString) since Identity might be ephemeral? No, string is safer for display.
    })),

    // The definitive cost data at the moment of match end
    snapshots: t.array(CharSnapshot),
});