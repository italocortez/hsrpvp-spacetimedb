import { schema } from 'spacetimedb/server';

// Import all your tables
import { HsrCharacter } from './tables/hsr_character';
import { HsrLightcone } from './tables/hsr_lightcone';
import { SynergyCost } from './tables/synergy_cost';
import { User } from './tables/user';
import { MatchSession } from './tables/match_session';
import { MatchParticipant } from './tables/match_participants';
import { MatchStep } from './tables/match_step';
import { HistoryMeta } from './tables/history_meta';
import { HistoryLog } from './tables/history_log';

// Define and export the schema
// This object is what your reducers will import to register functions
export default schema({
    HsrCharacter,
    HsrLightcone,
    SynergyCost,
    User,
    MatchSession,
    MatchParticipant,
    MatchStep,
    HistoryMeta,
    HistoryLog,
});