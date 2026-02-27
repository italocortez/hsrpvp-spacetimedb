import spacetimedb from '../schema';
import { t, SenderError } from 'spacetimedb/server';
import { getOrCreateUser } from '../utils/permissions';

export const set_nickname = spacetimedb.reducer(
    { newName: t.string() },
    (ctx, { newName }) => {
        // Validation
        if (newName.length < 3 || newName.length > 20) {
            throw new SenderError("Nickname must be between 3 and 20 chars");
        }

        const user = getOrCreateUser(ctx);

        // Update
        ctx.db.User.id.update({
            ...user,
            nickname: newName
        });
    }
);

export const set_profile_picture = spacetimedb.reducer(
    { charName: t.string() },
    (ctx, { charName }) => {
        // Validate character exists
        if (!ctx.db.HsrCharacter.name.find(charName)) {
            throw new SenderError("Character not found");
        }

        const user = getOrCreateUser(ctx);
        ctx.db.User.id.update({ ...user, profilePicture: charName });
    }
);