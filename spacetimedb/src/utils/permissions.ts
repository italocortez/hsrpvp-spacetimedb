import { ReducerCtx, SenderError } from 'spacetimedb/server';

// We use <any> here to bypass strict schema typing for these helper functions.
// This prevents circular dependencies while still allowing access to ctx.db.
type Ctx = ReducerCtx<any>;

/**
 * Throws an error if the sender is not an Admin.
 */
export function ensureAdmin(ctx: Ctx) {
    // Cast db to any to access tables dynamically without strict type definitions
    const db = ctx.db as any;

    const user = db.user.identity.find(ctx.sender);

    if (!user) {
        throw new SenderError('Authentication failed: User not found.');
    }

    // Accessing the Enum variant tag directly from the row data
    if (user.role.tag !== 'Admin') {
        throw new SenderError('Permission denied: Admin role required.');
    }
}

/**
 * Throws an error if the sender is not the Host of the specified match.
 */
export function ensureHost(ctx: Ctx, matchId: bigint) {
    const db = ctx.db as any;
    const match = db.matchSession.id.find(matchId);

    if (!match) {
        throw new SenderError(`Match session ${matchId} not found.`);
    }

    // Compare Identity strings for safety
    if (match.hostId.toHexString() !== ctx.sender.toHexString()) {
        throw new SenderError('Permission denied: Only the Host can perform this action.');
    }
}

/**
 * Throws an error if the sender is not a Referee (or Host) for the match.
 */
export function ensureReferee(ctx: Ctx, matchId: bigint) {
    const db = ctx.db as any;

    // 1. Get participants for this match
    // Note: .filter() returns an iterator
    const participants = db.matchParticipants.by_match_id.filter(matchId);
    let isRef = false;

    for (const p of participants) {
        // Check Identity match + Referee Boolean flag
        if (p.userId.toHexString() === ctx.sender.toHexString() && p.isReferee) {
            isRef = true;
            break;
        }
    }

    if (!isRef) {
        throw new SenderError('Permission denied: Referee status required.');
    }
}

/**
 * Helper to get user or create guest if they don't exist
 */
export function getOrCreateUser(ctx: Ctx) {
    const db = ctx.db as any;
    let user = db.user.identity.find(ctx.sender);

    if (!user) {
        // Auto-register as Player/Guest
        // 0n is the placeholder for AutoInc ID
        const row = db.user.insert({
            id: 0n,
            nickname: `Guest-${ctx.sender.toHexString().substring(0, 6)}`,
            online: true,
            role: { tag: 'Player', value: {} },
            profilePicture: 'default',
            // discordId is optional, so we can omit it
        });
        return row;
    }
    return user;
}