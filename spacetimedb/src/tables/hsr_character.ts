import { table, t } from 'spacetimedb/server';

// Nested Types
export const EidolonCost = t.object('EidolonCost', {
    E0: t.f32(),
    E1: t.f32(),
    E2: t.f32(),
    E3: t.f32(),
    E4: t.f32(),
    E5: t.f32(),
    E6: t.f32(),
});

export const GameModeCost = t.object('GameModeCost', {
    memoryofchaos: EidolonCost,
    apocalypticshadow: EidolonCost,
    anomalyarbitration: EidolonCost,
});

export const HsrCharacter = table({
    name: 'hsr_character',
    public: true,
}, {
    name: t.string().primaryKey(), // e.g., "acheron"
    displayName: t.string(),       // e.g., "Acheron"
    aliases: t.array(t.string()),  // e.g., ["raiden", "acheron"]
    rarity: t.u8(),
    path: t.string(),
    element: t.string(),
    role: t.string(),
    imageUrl: t.string(),
    cost: GameModeCost,
});