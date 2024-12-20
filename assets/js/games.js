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
	        {
				field: 'players',
				headerName: 'Players',
				valueGetter: (params) => {
					const minPlayers = params.data.min_players;
					const maxPlayers = params.data.max_players;
					const minBest = params.data.min_best;
					const maxBest = params.data.max_best;
					return `${minPlayers} - ${maxPlayers}<br>${minBest} - ${maxBest}`;
				},
				cellRenderer: (params) => {
		        	const value = params.value;
		        	return value ? value.replace(/<br>/g, '<br/>') : '';
		    	},
				sortable: true,
				comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
					if (!nodeA.data || !nodeB.data) return 0;
					if (isInverted) {
						return (nodeA.data.max_players - nodeB.data.max_players);
					} else {
						return (nodeA.data.min_players - nodeB.data.min_players);
					}
				}
			},
	        { field: 'min_players', hide: true },
	        { field: 'max_players', hide: true },
	        { field: 'min_best', hide: true },
	        { field: 'max_best', hide: true },
	        {
				field: 'time',
				headerName: 'Time',
				valueGetter: (params) => {
					const minTime = params.data.min_time;
					const maxTime = params.data.max_time;
					if (minTime == max_ti me) {
						return `${minTime} mins`;
					} else {
						return `${minTime} - ${maxTime} mins`;
					}
				},
				sortable: true,
				comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
					if (!nodeA.data || !nodeB.data) return 0;
					if (isInverted) {
						return (nodeA.data.max_time - nodeB.data.max_time);
					} else {
						return (nodeA.data.min_time - nodeB.data.min_time);
					}
				}
			},
	        { field: 'learning_complexity', headerName: 'Learning Complexity' },
	        { field: 'playing_complexity', headerName: 'Playing Complexity' },
	        { field: 'expansion', headerName: 'Expansion', hide: true },
	        { field: 'co-op', headerName: 'Co-op', hide: true },
	        { field: 'legacy', headerName: 'Legacy', hide: true },
	        { field: 'favorite', headerName: 'Favorite', hide: true },
	        { field: 'play_more', headerName: 'Play More', hide: true },
		],
		defaultColDef: {
    		flex: 1,
    		resizable: false,
    		suppressMovable: true,
    		autoHeight: true,
			wrapText: true,
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