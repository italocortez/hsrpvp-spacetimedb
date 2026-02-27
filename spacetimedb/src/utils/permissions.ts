import { SenderError } from 'spacetimedb/server';

// We use 'any' for ctx to avoid import errors with ReducerContext types during bundling.
// Since this function is called inside a valid Reducer, ctx is guaranteed to be valid.

/**
 * Throws an error if the sender is not an Admin.
 */
export function ensureAdmin(ctx: any) {
    // ctx.db is 'any', so we access tables via their Schema names (PascalCase)
    const user = ctx.db.User.id.find(ctx.sender);

    if (!user) {
        throw new SenderError('Authentication failed: User not found.');
    }

    if (user.role.tag !== 'Admin') {
        throw new SenderError('Permission denied: Admin role required.');
    }
}

/**
 * Throws an error if the sender is not the Host of the specified match.
 */
export function ensureHost(ctx: any, matchId: bigint) {
    const match = ctx.db.MatchSession.id.find(matchId);

    if (!match) {
        throw new SenderError(`Match session ${matchId} not found.`);
    }

    // Compare Identity strings
    if (match.hostId.toHexString() !== ctx.sender.toHexString()) {
        throw new SenderError('Permission denied: Only the Host can perform this action.');
    }
}

/**
 * Throws an error if the sender is not a Referee (or Host) for the match.
 */
export function ensureReferee(ctx: any, matchId: bigint) {
    // Access custom index dynamically
    const participants = ctx.db.MatchParticipant.match_participants_match_id.filter(matchId);
    let isRef = false;

    for (const p of participants) {
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
export function getOrCreateUser(ctx: any) {
    let user = ctx.db.User.id.find(ctx.sender);

    if (!user) {
        // Auto-register as Player/Guest
        const row = ctx.db.User.insert({
            id: ctx.sender,
            nickname: `Guest-${ctx.sender.toHexString().substring(0, 6)}`,
            online: true,
            role: { tag: 'Player' },
            profilePicture: 'default',
        });
        return row;
    }
    return user;
}