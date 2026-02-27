import { table, t } from 'spacetimedb/server';

export const MatchSide = t.enum('MatchSide', {
    Red: t.unit(),
    Blue: t.unit(),
    None: t.unit(), // For Spectators
});

export const MatchRole = t.enum('MatchRole', {
    Player: t.unit(),
    Spectator: t.unit(),
});

export const MatchParticipant = table({
    name: 'match_participants',
    public: true,
    indexes: [
        { name: 'by_match_id', algorithm: 'btree', columns: ['matchId'] },
    ],
}, {
    id: t.u64().primaryKey().autoInc(),
    matchId: t.u64(),
    userId: t.identity(),
    isReferee: t.bool(), // Set to 'false' in your reducer when inserting!
    side: MatchSide,
    role: MatchRole,
    slotIndex: t.u8(),
});