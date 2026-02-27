import { table, t } from 'spacetimedb/server';

export const SuperimpositionCost = t.object('SuperimpositionCost', {
    S1: t.f32(),
    S2: t.f32(),
    S3: t.f32(),
    S4: t.f32(),
    S5: t.f32(),
});

export const CardPosition = t.object('CardPosition', {
    width: t.string(),
    x: t.i32(),
    y: t.i32(),
});

export const HsrLightcone = table({
    name: 'hsr_lightcone',
    public: true,
}, {
    name: t.string().primaryKey(),
    displayName: t.string(),
    aliases: t.array(t.string()),
    path: t.string(),
    rarity: t.u8(),
    imageUrl: t.string(),
    cost: SuperimpositionCost,
    positioning: CardPosition,
});