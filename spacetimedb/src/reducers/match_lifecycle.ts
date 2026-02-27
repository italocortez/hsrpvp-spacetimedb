import spacetimedb from '../schema';
import { t, SenderError } from 'spacetimedb/server';
import { ensureHost, ensureReferee } from '../utils/permissions';

export const start_match = spacetimedb.reducer(
    { matchId: t.u64() },
    (ctx, { matchId }) => {
        ensureHost(ctx, matchId);
        const match = ctx.db.MatchSession.id.find(matchId);
        if (!match) throw new SenderError("Match not found");

        // Update status
        ctx.db.MatchSession.id.update({
            ...match,
            status: { tag: 'InProgress' },
            startedAt: ctx.timestamp,
            lastActionAt: ctx.timestamp
        });

        // Add "Start" step to log
        ctx.db.MatchStep.insert({
            id: 0n,
            matchId: matchId,
            stepIndex: 0,
            timestamp: ctx.timestamp,
            action: { tag: 'StartMatch' },
            actor: ctx.sender
        });
    }
);

export const submit_match_results = spacetimedb.reducer(
    { matchId: t.u64(), winnerSide: t.string() },
    (ctx, { matchId, winnerSide }) => {
        ensureReferee(ctx, matchId);

        const match = ctx.db.MatchSession.id.find(matchId);
        if (!match) throw new SenderError("Match not found");

        // 1. Fetch Participants & Resolve Names
        const participants = Array.from((ctx.db.MatchParticipant as any).match_participants_match_id.filter(matchId)) as any[];

        const hostUser = ctx.db.User.id.find(match.hostId);
        const hostName = hostUser ? hostUser.nickname : "Unknown Host";

        const redTeamNames: string[] = [];
        const blueTeamNames: string[] = [];

        for (const p of participants) {
            const pUser = ctx.db.User.id.find(p.userId);
            if (!pUser) continue;

            if (p.side.tag === 'Red') redTeamNames.push(pUser.nickname);
            else if (p.side.tag === 'Blue') blueTeamNames.push(pUser.nickname);
        }

        // 2. Create History Meta (The Archive)
        ctx.db.HistoryMeta.insert({
            matchId: matchId, // We keep the ID for reference
            settings: match.settings,
            winner: winnerSide === 'Red' ? { tag: 'Red' } : { tag: 'Blue' },
            endedAt: ctx.timestamp,
            hostName: hostName,
            redTeamNames: redTeamNames,
            blueTeamNames: blueTeamNames
        });

        // 3. Create History Log (The Replay)
        const rawStepsIterator = (ctx.db.MatchStep as any).match_step_match_id.filter(matchId);
        const steps = Array.from(rawStepsIterator) as any[];
        steps.sort((a, b) => a.stepIndex - b.stepIndex);

        ctx.db.HistoryLog.insert({
            matchId: matchId,
            steps: steps.map((s) => ({
                action: s.action,
                timestamp: s.timestamp,
                actorId: s.actor.toHexString()
            })),
            snapshots: []
        });

        // 4. CLEANUP: Delete ALL Operational Data (Session, Participants, Steps)

        // A. Delete Steps
        for (const step of steps) {
            ctx.db.MatchStep.id.delete(step.id);
        }

        // B. Delete Participants
        for (const p of participants) {
            ctx.db.MatchParticipant.id.delete(p.id);
        }

        // C. Delete Session (It is now archived in HistoryMeta)
        ctx.db.MatchSession.id.delete(matchId);
    }
);