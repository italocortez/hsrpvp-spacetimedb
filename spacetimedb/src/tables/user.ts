import { table, t } from 'spacetimedb/server';

export const UserRole = t.enum('UserRole', {
    Admin: t.unit(),
    TournamentHost: t.unit(),
    Player: t.unit(),
});

export const User = table({
    name: 'user',
    public: true,
    indexes: [
        { name: 'by_discord_id', algorithm: 'btree', columns: ['discordId'] },
    ],
}, {
    id: t.identity().primaryKey(),
    nickname: t.string(),
    discordId: t.string().optional(), // Optional for guest users
    online: t.bool(),
    role: UserRole,
    profilePicture: t.string(), // References hsr_character.name
});