import spacetimedb from './schema';

// Register all reducers by importing them (Side Effects)
import './reducers/auth_reducer';
import './reducers/lobby_reducer';
import './reducers/draft_classic';
import './reducers/draft_auction';
import './reducers/admin_tools';
import './reducers/match_lifecycle';

console.log("HSR PvP Module Initialized");

// EXPORT the schema so SpacetimeDB knows this is the module definition
// This fixes the "declared but never used" error.
export default spacetimedb;