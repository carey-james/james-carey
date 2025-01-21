'use strict';

function runner(games_data, feedback_data) {
	let gridApi;

	console.log(feedback_data);

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
	        { 
	        	field: 'mechanics', 
	        	headerName: `<img src="assets/icons/game-icons/other-icons/mechanics.svg" alt="Mechanics" style="width:15px; height:15px;"><br>Mechanics`,
	        	valueGetter: (params) => {
	        		const mech = params.data.mechanics;
	        		return `<img src="assets/icons/game-icons/mechanics-icons/${mech}.svg" alt="${mech}" style="width:15px; height:15px;"><br>${mech}`;
	        	} 
	        },
	        {
	        	field: 'mechanics_rating', 
	        	headerName: 'Mechanics Rating',
	        	valueGetter: (params) => {
	        		const game = params.data.game;
	        		const ratings = feedback_data
  						.filter(item => item.game === `${game}`)
  						.map(item => parseInt(item.mechanics_enjoyment, 10));  // Convert  Complexity to Int
  					const averageRating = parseFloat((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1));
	        		return `${averageRating}`;
	        	}
	        },
	        { 
	        	field: 'theme', 
	        	headerName: 'Theme',
				valueGetter: (params) => {
	        		const theme = params.data.theme;
	        		return `<img src="assets/icons/game-icons/theme-icons/${theme}.svg" alt="${theme}" style="width:15px; height:15px;"><br>${theme}`;
	        	} 
	        },
	        {
	        	field: 'theme_rating', 
	        	headerName: 'Theme Rating',
	        	valueGetter: (params) => {
	        		const game = params.data.game;
	        		const ratings = feedback_data
  						.filter(item => item.game === `${game}`)
  						.map(item => parseInt(item.theme_enjoyment, 10));  // Convert  Complexity to Int
  					const averageRating = parseFloat((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1));
	        		return `${averageRating}`;
	        	}
	        },
	        {
				field: 'players',
				headerName: 'Players',
				valueGetter: (params) => {
					const minPlayers = params.data.min_players;
					const maxPlayers = params.data.max_players;
					const minBest = params.data.min_best;
					const maxBest = params.data.max_best;
					let playerDots = ``
					for (let i = 1; ((i < maxPlayers) && (i < 21)); i++) {
						if (i < minPlayers) {
							playerDots += `<img src="assets/icons/game-icons/other-icons/players-not-playable.svg" alt="Light Blue Dot" style="width:4px; height:4px;">`;
						} else if ((i >= minBest) && (i <= maxBest)) {
							playerDots += `<img src="assets/icons/game-icons/other-icons/players-best.svg" alt="Gold Dot" style="width:4px; height:4px;">`;
						} else {
							playerDots += `<img src="assets/icons/game-icons/other-icons/players-playable.svg" alt="Dark Blue Dot" style="width:4px; height:4px;">`;
						}
					}
					return `Players: ${minPlayers} - ${maxPlayers}<br>${playerDots}<br>Best with: ${minBest} - ${maxBest}`;
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
					if (minTime == maxTime) {
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
	        { 
	        	field: 'learning_complexity', 
	        	headerName: 'Learning Complexity',
	        	valueGetter: (params) => {
	        		const game = params.data.game;
	        		const complexities = feedback_data
  						.filter(item => item.game === `${game}`)
  						.map(item => parseInt(item.learning_complexity, 10));  // Convert  Complexity to Int
  					const averageComplexity = parseFloat((complexities.reduce((sum, complex) => sum + complex, 0) / complexities.length).toFixed(1));
	        		return `${averageComplexity}`;
	        	}
	        },
	        { 
	        	field: 'playing_complexity', 
	        	headerName: 'Playing Complexity',
	        	valueGetter: (params) => {
	        		const game = params.data.game;
	        		const complexities = feedback_data
  						.filter(item => item.game === `${game}`)
  						.map(item => parseInt(item.playing_complexity, 10));  // Convert  Complexity to Int
  					const averageComplexity = parseFloat((complexities.reduce((sum, complex) => sum + complex, 0) / complexities.length).toFixed(1));
	        		return `${averageComplexity}`;
	        	}
	        },
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
			cellRenderer: (params) => {
		        const value = params.value;
		        return value ? value.replace(/<br>/g, '<br/>') : '';
		    },
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
	const feedback = await d3.dsv('|', 'https://raw.githubusercontent.com/carey-james/Games-List/refs/heads/main/feedback.csv');
	runner(games, feedback);}

initGames();