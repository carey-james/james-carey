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
			{ field: 'game', headerName: 'Game', minWidth: 180 },
	        { 
	        	field: 'mechanics', 
	        	headerName: 'Mechanics',
	        	valueGetter: (params) => {
	        		const mech = params.data.mechanics;
	        		return `<img src="assets/icons/game-icons/mechanics-icons/${mech}.svg" alt="${mech}" style="width:20px; height:20px;"><br>${mech}`;
	        	},
	        	minWidth: 150
	        },
	        {
	        	field: 'mechanics_rating', 
	        	headerName: 'Rating',
	        	valueGetter: (params) => {
	        		const game = params.data.game;
	        		const ratings = feedback_data
  						.filter(item => item.game === `${game}`)
  						.map(item => parseInt(item.mechanics_enjoyment, 10));  // Convert  Complexity to Int
  					const averageRating = parseFloat((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1));
  					let mechs = ``;
	        		if (isNaN(averageRating)) {
  						return 'TBD';
  					} else {
						for (let i = 0; i < Math.trunc(averageRating); i++) {
							mechs += `<img src="assets/icons/game-icons/other-icons/gear.svg" alt="Clock" style="width:12px; height:12px;">`;
						}
						if ((Math.round(averageRating * 2) % 2) == 1) {
							mechs += `<img src="assets/icons/game-icons/other-icons/half-gear.svg" alt="Clock" style="width:6px; height:12px;">`;
						}
	  					return `${mechs}<br>${averageRating}`;
  					}
	        	},
	        	minWidth: 100
	        },
	        { 
	        	field: 'theme', 
	        	headerName: 'Theme',
				valueGetter: (params) => {
	        		const theme = params.data.theme;
	        		return `<img src="assets/icons/game-icons/theme-icons/${theme}.svg" alt="${theme}" style="width:20px; height:20px;"><br>${theme}`;
	        	},
	        	minWidth: 100 
	        },
	        {
	        	field: 'theme_rating', 
	        	headerName: 'Rating',
	        	valueGetter: (params) => {
	        		const game = params.data.game;
	        		const ratings = feedback_data
  						.filter(item => item.game === `${game}`)
  						.map(item => parseInt(item.theme_enjoyment, 10));  // Convert  Complexity to Int
  					const averageRating = parseFloat((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1));
  					let themes = ``;
	        		if (isNaN(averageRating)) {
  						return 'TBD';
  					} else {
						for (let i = 0; i < Math.trunc(averageRating); i++) {
							themes += `<img src="assets/icons/game-icons/other-icons/bulb.svg" alt="Clock" style="width:12px; height:12px;">`;
						}
						if ((Math.round(averageRating * 2) % 2) == 1) {
							themes += `<img src="assets/icons/game-icons/other-icons/half-bulb.svg" alt="Clock" style="width:6px; height:12px;">`;
						}
	  					return `${themes}<br>${averageRating}`;
  					}
	        	},
	        	minWidth: 100
	        },
	        {
				field: 'players',
				headerName: 'Players',
				valueGetter: (params) => {
					const minPlayers = params.data.min_players;
					const maxPlayers = params.data.max_players;
					const minBest = params.data.min_best;
					const maxBest = params.data.max_best;
					let playerDots = ``;
					for (let i = 1; ((i <= maxPlayers) && (i <= 20)); i++) {
						if (i < minPlayers) {
							playerDots += `<img src="assets/icons/game-icons/other-icons/players-not-playable.svg" alt="Light Blue Dot" style="width:5px; height:5px;">`;
						} else if ((i >= minBest) && (i <= maxBest)) {
							playerDots += `<img src="assets/icons/game-icons/other-icons/players-best.svg" alt="Gold Dot" style="width:5px; height:5px;">`;
						} else {
							playerDots += `<img src="assets/icons/game-icons/other-icons/players-playable.svg" alt="Dark Blue Dot" style="width:5px; height:5px;">`;
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
				},
	        	minWidth: 100
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
					const medTime = (Number(minTime) + Number(maxTime)) / 2;
					let numClocks = 0;
					let clocks = ``;
					let timeLeg = ``;
					if (medTime <= 20) {
						numClocks = 1;
					} else if (medTime <= 40) {
						numClocks = 2;
					} else if (medTime <= 80) {
						numClocks = 3;
					} else if (medTime <= 110) {
						numClocks = 4;
					} else {
						numClocks = 5;
					}
					for (let i = 0; i < numClocks; i++) {
						clocks += `<img src="assets/icons/game-icons/other-icons/clock.svg" alt="Clock" style="width:12px; height:12px;">`;
					}
					if (minTime == maxTime) {
						timeLeg = `${minTime} mins`;
					} else {
						timeLeg = `${minTime} - ${maxTime} mins`;
					}
					return `${clocks}<br>${timeLeg}`;

				},
				sortable: true,
				comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
					if (!nodeA.data || !nodeB.data) return 0;
					return ((Number(nodeA.data.max_time) + Number(nodeA.data.min_time)) - (Number(nodeB.data.max_time) + Number(nodeB.data.min_time)));
				},
				minWidth: 100
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
	        		let learning = ``;
	        		if (isNaN(averageComplexity)) {
  						return 'TBD';
  					} else {
						for (let i = 0; i < Math.trunc(averageComplexity); i++) {
							learning += `<img src="assets/icons/game-icons/other-icons/learning-complexity.svg" alt="Clock" style="width:12px; height:12px;">`;
						}
						if ((Math.round(averageComplexity * 2) % 2) == 1) {
							learning += `<img src="assets/icons/game-icons/other-icons/half-learning-complexity.svg" alt="Clock" style="width:6px; height:12px;">`;
						}
	  					return `${learning}<br>${averageComplexity}`;
  					}
	        	},
				minWidth: 150
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
	        		let playing = ``;
	        		if (isNaN(averageComplexity)) {
  						return 'TBD';
  					} else {
						for (let i = 0; i < Math.trunc(averageComplexity); i++) {
							playing += `<img src="assets/icons/game-icons/other-icons/playing-complexity.svg" alt="Clock" style="width:12px; height:12px;">`;
						}
						if ((Math.round(averageComplexity * 2) % 2) == 1) {
							playing += `<img src="assets/icons/game-icons/other-icons/half-playing-complexity.svg" alt="Clock" style="width:6px; height:12px;">`;
						}
	  					return `${playing}<br>${averageComplexity}`;
  					}
	        	},
				minWidth: 150
	        },
	        { field: 'expansion', headerName: 'Expansion', hide: true, },
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
  		headerHeight: 60,
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