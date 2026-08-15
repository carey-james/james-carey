'use strict';

function runner(games_data, feedback_data) {

}

async function initGames() {
	// Get the games from the Games List repo
	// https://github.com/carey-james/Games-List
	const games = await d3.dsv('|', 'https://raw.githubusercontent.com/carey-james/Games-List/refs/heads/main/games.csv');
	const feedback = await d3.dsv('|', 'https://raw.githubusercontent.com/carey-james/Games-List/refs/heads/main/feedback.csv');
	runner(games, feedback);}

initGames();