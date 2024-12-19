'use strict';

function runner(games_data) {
	let gridApi;

	const gamesTheme = agGrid.themeQuartz.withParams({
	    fontFamily: 'Bitter',
		headerFontFamily: 'Raleway',
		cellFontFamily: 'Bitter',
	});

	// Grid Options: Contains all of the Data Grid configurations
	const gridOptions = {
		theme: gamesTheme,
		rowData: games_data,
		columnDefs: [
			{ field: 'game' },
			{ field: 'mechanics' },
			{ field: 'theme' },
			{ field: 'min_players' },
			{ field: 'max_players' }
		],
		defaultColDef: {
    		flex: 1,
  		},
	};

	// Your Javascript code to create the Data Grid
	const myGridElement = document.querySelector('#gamesGrid');
	agGrid.createGrid(myGridElement, gridOptions);
}

async function initGames() {
	// Get the games from the Games List repo
	// https://github.com/carey-james/Games-List
	const games = await d3.dsv('|', 'https://raw.githubusercontent.com/carey-james/Games-List/refs/heads/main/games.csv');
	runner(games);
	console.log(games);
}

initGames();