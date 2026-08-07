import streamDeck, { LogLevel } from '@elgato/streamdeck';
import { StatsAction } from './actions/stats-action';

// INFO, not TRACE/DEBUG: settings payloads (including the user's Cloudflare
// API token, entered via the property inspector) can appear in verbose SDK
// tracing. Every installer runs this default, so it has to be safe as
// shipped. See stats-action.ts for the token redaction on the settings
// actually logged at INFO by this plugin's own code — lowering this level
// alone does not fix that; the log calls themselves must never print the
// token.
streamDeck.logger.setLevel(LogLevel.INFO);

streamDeck.logger.info('Cloudflare Analytics Plugin Starting...');

// Register the action
const statsAction = new StatsAction();
streamDeck.logger.info('StatsAction created');
streamDeck.actions.registerAction(statsAction);
streamDeck.logger.info('StatsAction registered');

// Connect to Stream Deck
streamDeck.logger.info('Connecting to Stream Deck...');
streamDeck.connect();
streamDeck.logger.info('Connected to Stream Deck!');

