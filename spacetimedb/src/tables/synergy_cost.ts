import { table, t } from 'spacetimedb/server';

export const SynergyValues = t.object('SynergyValues', {
    memoryofchaos: t.f32(),
    apocalypticshadow: t.f32(),
});

export const SynergyCost = table({
    name: 'synergy_cost',
    public: true,
    indexes: [
        { name: 'by_source', algorithm: 'btree', columns: ['source'] },
        { name: 'by_target', algorithm: 'btree', columns: ['pairTarget'] },
    ],
}, {
    id: t.string().primaryKey(), // "should be a concatenation of source and pair_target e.g. acheron_jingyuan"
    source: t.string(),
    pairTarget: t.string(),
    cost: SynergyValues,
});