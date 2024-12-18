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
			{ field: 'game', headerName: 'Game' },
	        { field: 'mechanics', headerName: 'Mechanics' },
	        { field: 'theme', headerName: 'Theme' },
	        { field: 'min_players', headerName: 'Min Players' },
	        { field: 'max_players', headerName: 'Max Players' },
	        { field: 'min_best', headerName: 'Min Best' },
	        { field: 'max_best', headerName: 'Max Best' },
	        { field: 'min_time', headerName: 'Min Time' },
	        { field: 'max_time', headerName: 'Max Time' },
	        { field: 'learning_complexity', headerName: 'Learning Complexity' },
	        { field: 'playing_complexity', headerName: 'Playing Complexity' },
	        { field: 'expansion', headerName: 'Expansion' },
	        { field: 'co-op', headerName: 'Co-op' },
	        { field: 'legacy', headerName: 'Legacy' },
	        { field: 'favorite', headerName: 'Favorite' },
	        { field: 'play_more', headerName: 'Play More' },
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