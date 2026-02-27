import spacetimedb from '../schema';
import { t, SenderError } from 'spacetimedb/server';
import { MatchSettings } from '../tables/match_session';
import { getOrCreateUser, ensureHost } from '../utils/permissions';

export const create_lobby = spacetimedb.reducer(
    { settings: MatchSettings },
    (ctx, { settings }) => {
        const user = getOrCreateUser(ctx);
        const session = ctx.db.MatchSession.insert({
            id: 0n,
            hostId: ctx.sender,
            status: { tag: 'Lobby' },
            settings: settings,
            startedAt: ctx.timestamp,
            lastActionAt: ctx.timestamp
        });

        ctx.db.MatchParticipant.insert({
            id: 0n,
            matchId: session.id,
            userId: ctx.sender,
            isReferee: true, // Correct: Host starts as Ref
            side: { tag: 'None' },
            role: { tag: 'Player' },
            slotIndex: 0
        });
    }
);

export const join_lobby = spacetimedb.reducer(
    { matchId: t.u64() },
    (ctx, { matchId }) => {
        const user = getOrCreateUser(ctx);
        const match = ctx.db.MatchSession.id.find(matchId);

        if (!match) throw new SenderError("Match not found");
        if (match.status.tag !== 'Lobby') throw new SenderError("Match already in progress");

        const existing = (ctx.db.MatchParticipant as any).match_participants_match_id.filter(matchId);
        for (const p of existing) {
            if (p.userId.toHexString() === ctx.sender.toHexString()) throw new SenderError("Already in lobby");
        }

        ctx.db.MatchParticipant.insert({
            id: 0n,
            matchId: matchId,
            userId: ctx.sender,
            isReferee: false, // Correct: Joiners are NOT Ref
            side: { tag: 'None' },
            role: { tag: 'Spectator' },
            slotIndex: 0
        });
    }
);

export const update_match_settings = spacetimedb.reducer(
    { matchId: t.u64(), newSettings: MatchSettings },
    (ctx, { matchId, newSettings }) => {
        ensureHost(ctx, matchId);

        const match = ctx.db.MatchSession.id.find(matchId);
        if (!match) throw new SenderError("Match not found");
        if (match.status.tag !== 'Lobby') throw new SenderError("Cannot change settings after start");

        ctx.db.MatchSession.id.update({
            ...match,
            settings: newSettings,
            lastActionAt: ctx.timestamp
        });
    }
);

/**
 * NEW: Allows the Host to move users between Red/Blue/Spectator
 */
export const update_participant = spacetimedb.reducer(
    { matchId: t.u64(), targetUser: t.identity(), newSide: t.string(), newRole: t.string(), slot: t.u8() },
    (ctx, { matchId, targetUser, newSide, newRole, slot }) => {
        ensureHost(ctx, matchId); // Only Host can organize the lobby

        const participants = Array.from((ctx.db.MatchParticipant as any).match_participants_match_id.filter(matchId)) as any[];
        const target = participants.find(p => p.userId.toHexString() === targetUser.toHexString());

        if (!target) throw new SenderError("User not in lobby");

        // Map strings to Enums
        const sideEnum = newSide === 'Red' ? { tag: 'Red' } : newSide === 'Blue' ? { tag: 'Blue' } : { tag: 'None' };
        const roleEnum = newRole === 'Player' ? { tag: 'Player' } : { tag: 'Spectator' };

        ctx.db.MatchParticipant.id.update({
            ...target,
            side: sideEnum,
            role: roleEnum,
            slotIndex: slot
        });
    }
);

/**
 * NEW: Allows the Host to designate a specific Referee
 */
export const assign_referee = spacetimedb.reducer(
    { matchId: t.u64(), newRefereeId: t.identity() },
    (ctx, { matchId, newRefereeId }) => {
        ensureHost(ctx, matchId);

        const participants = Array.from((ctx.db.MatchParticipant as any).match_participants_match_id.filter(matchId)) as any[];

        // 1. Find the NEW referee
        const newRef = participants.find(p => p.userId.toHexString() === newRefereeId.toHexString());
        if (!newRef) throw new SenderError("Target user not in lobby");

        // 2. Find the OLD referee(s) and strip their flag
        for (const p of participants) {
            if (p.isReferee) {
                ctx.db.MatchParticipant.id.update({ ...p, isReferee: false });
            }
        }

        // 3. Grant flag to new referee
        ctx.db.MatchParticipant.id.update({ ...newRef, isReferee: true });
    }
);

export const leave_lobby = spacetimedb.reducer(
    { matchId: t.u64() },
    (ctx, { matchId }) => {
        const match = ctx.db.MatchSession.id.find(matchId);
        if (!match) throw new SenderError("Match not found");

        // Cast to access the index
        const participants = Array.from((ctx.db.MatchParticipant as any).match_participants_match_id.filter(matchId)) as any[];

        const leaver = participants.find(p => p.userId.toHexString() === ctx.sender.toHexString());
        if (!leaver) throw new SenderError("You are not in this lobby");

        // === SCENARIO 1: HOST LEAVES (The Nuclear Option) ===
        if (match.hostId.toHexString() === ctx.sender.toHexString()) {

            // 1. Archive to HistoryMeta
            // We save it so we have a record that this match existed but was abandoned
            ctx.db.HistoryMeta.insert({
                matchId: matchId,
                settings: match.settings,
                winner: { tag: 'None' }, // No winner
                endedAt: ctx.timestamp,
                hostName: "Host (Abandoned)",
                redTeamNames: [],
                blueTeamNames: []
            });

            // 2. Archive empty HistoryLog (to satisfy foreign key constraints if any)
            ctx.db.HistoryLog.insert({
                matchId: matchId,
                steps: [],
                snapshots: []
            });

            // 3. KICK EVERYONE (Disconnect users)
            // Deleting their participant row causes the client subscription 
            // to update, effectively sending them back to the main menu.
            for (const p of participants) {
                ctx.db.MatchParticipant.id.delete(p.id);
            }

            // 4. Clean up any steps if the match had started
            const steps = Array.from((ctx.db.MatchStep as any).match_step_match_id.filter(matchId)) as any[];
            for (const s of steps) {
                ctx.db.MatchStep.id.delete(s.id);
            }

            // 5. DELETE SESSION (Crucial Change)
            // We remove the row entirely. The session is over.
            ctx.db.MatchSession.id.delete(matchId);

            return; // Exit, we are done.
        }

        // === SCENARIO 2: GUEST LEAVES ===

        // Referee Failover Logic
        // If the leaver was the designated Referee, give power back to the Host
        if (leaver.isReferee) {
            const hostPart = participants.find(p => p.userId.toHexString() === match.hostId.toHexString());
            // Only transfer if Host is still there (which they should be, otherwise Scenario 1 hit)
            if (hostPart) {
                ctx.db.MatchParticipant.id.update({ ...hostPart, isReferee: true });
            }
        }

        // Delete ONLY the leaver
        ctx.db.MatchParticipant.id.delete(leaver.id);
    }
);