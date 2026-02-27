import { table, t } from 'spacetimedb/server';

export const StepAction = t.enum('StepAction', {
    StartMatch: t.unit(),
    Ban: t.string(),     // payload: character_name
    Pick: t.string(),    // payload: character_name
    Bid: t.object('BidPayload', { char: t.string(), amount: t.u32() }),
    Pause: t.unit(),
    Resume: t.unit(),
    Undo: t.unit(),      // Logic will look at previous steps
});

export const MatchStep = table({
    name: 'match_step',
    public: true,
    indexes: [
        { name: 'by_match_id', algorithm: 'btree', columns: ['matchId'] },
    ],
}, {
    id: t.u64().primaryKey().autoInc(),
    matchId: t.u64(),
    stepIndex: t.u32(), // 1, 2, 3... essential for consistent replays
    timestamp: t.timestamp(),
    action: StepAction,
    actor: t.identity(), // Who performed the action
});