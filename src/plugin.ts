import streamDeck, { LogLevel } from '@elgato/streamdeck';
import { StatsAction } from './actions/stats-action';

// Set log level to debug
streamDeck.logger.setLevel(LogLevel.TRACE);

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

