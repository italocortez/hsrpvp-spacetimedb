import { table, t } from 'spacetimedb/server';

export const MatchStatus = t.enum('MatchStatus', {
    Lobby: t.unit(),
    InProgress: t.unit(),
    Ended: t.unit(),
    Abandoned: t.unit(),
});

export const MatchSettings = t.object('MatchSettings', {
    reserveTime: t.f32(),
    phaseTime: t.f32(),
    banRestrictions: t.string(), // "4bans" | "6bans"
    gameMode: t.string(),        // "memoryofchaos" | "apocalypticshadow" | "anomalyarbitration"
    draftMode: t.string(),       // "classic" | "auction"
    rosterDifferenceAdvantage: t.f32(),
    underThresholdAdvantagePerPoint: t.f32(),
    aboveThresholdPenaltyPerPoint: t.f32(),
    deathPenalties: t.f32(),
    bidBudget: t.f32(),
});

export const MatchSession = table({
    name: 'match_session',
    public: true,
    indexes: [
        { name: 'by_status', algorithm: 'btree', columns: ['status'] }, // For Lobby filtering
        { name: 'by_host', algorithm: 'btree', columns: ['hostId'] },
    ],
}, {
    id: t.u64().primaryKey().autoInc(),
    hostId: t.identity(),
    status: MatchStatus,
    settings: MatchSettings,
    startedAt: t.timestamp(),
    lastActionAt: t.timestamp(), // For 1h timeout logic
});