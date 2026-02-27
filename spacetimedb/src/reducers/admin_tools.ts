import spacetimedb from '../schema';
import { t } from 'spacetimedb/server';
import { HsrCharacter } from '../tables/hsr_character';
import { HsrLightcone } from '../tables/hsr_lightcone';
import { SynergyCost } from '../tables/synergy_cost';
import { ensureAdmin } from '../utils/permissions';

// Bulk Upsert Characters
export const upsert_characters = spacetimedb.reducer(
    { characters: t.array(HsrCharacter.rowType) },
    (ctx, { characters }) => {
        ensureAdmin(ctx);

        for (const char of characters) {
            // Check if exists to update, or insert new
            const existing = ctx.db.HsrCharacter.name.find(char.name);
            if (existing) {
                ctx.db.HsrCharacter.name.update(char);
            } else {
                ctx.db.HsrCharacter.insert(char);
            }
        }
    }
);

// Bulk Upsert Lightcones
export const upsert_lightcones = spacetimedb.reducer(
    { lightcones: t.array(HsrLightcone.rowType) },
    (ctx, { lightcones }) => {
        ensureAdmin(ctx);
        for (const lc of lightcones) {
            const existing = ctx.db.HsrLightcone.name.find(lc.name);
            if (existing) {
                ctx.db.HsrLightcone.name.update(lc);
            } else {
                ctx.db.HsrLightcone.insert(lc);
            }
        }
    }
);

// Bulk Upsert Synergy Costs
export const upsert_synergies = spacetimedb.reducer(
    { synergies: t.array(SynergyCost.rowType) },
    (ctx, { synergies }) => {
        ensureAdmin(ctx);
        for (const s of synergies) {
            const existing = ctx.db.SynergyCost.id.find(s.id);
            if (existing) {
                ctx.db.SynergyCost.id.update(s);
            } else {
                ctx.db.SynergyCost.insert(s);
            }
        }
    }
);