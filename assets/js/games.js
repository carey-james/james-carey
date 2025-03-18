'use strict';

function runner(games_data, feedback_data) {
	let gridApi;

	let summary_data = [];
	const all_games = [...new Set(games_data.map(item => item.game))];
	console.log(all_games);
	const feedback_games = [...new Set(feedback_data.map(item => item.game))];
	all_games.forEach(game => {
		let summary_item = {};
		summary_item.game = game;
		if (feedback_games.includes(game)) {
			summary_item.rated = true;
			const filtered_items = feedback_data.filter(item => item.game === game);
			summary_item.avg_mech_rating = parseFloat((filtered_items.map(item => parseInt(item.mechanics_enjoyment, 10)).reduce((sum, rating) => sum + rating, 0) / filtered_items.length).toFixed(1));
			summary_item.avg_theme_rating = parseFloat((filtered_items.map(item => parseInt(item.theme_enjoyment, 10)).reduce((sum, rating) => sum + rating, 0) / filtered_items.length).toFixed(1));
			summary_item.avg_learn_comp = parseFloat((filtered_items.map(item => parseInt(item.learning_complexity, 10)).reduce((sum, rating) => sum + rating, 0) / filtered_items.length).toFixed(1));
			summary_item.avg_play_comp = parseFloat((filtered_items.map(item => parseInt(item.playing_complexity, 10)).reduce((sum, rating) => sum + rating, 0) / filtered_items.length).toFixed(1));
			summary_data.push(summary_item);
		} else {
			summary_item.rated = false;
			const filtered_item = games_data.filter(item => item.game === game)[0];
			summary_item.avg_mech_rating = 0;
			summary_item.avg_theme_rating = 0;
			summary_item.avg_learn_comp = filtered_item.learning_complexity;
			summary_item.avg_play_comp = filtered_item.learning_complexity;
			summary_data.push(summary_item);
		};
	});

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
  					const games = summary_data.filter(item => item.game === `${game}`);
  					let mechs = ``;
	        		if (games.length < 1) {
  						return 'ERROR';
  					} else if (games[0].rated) {
						for (let i = 0; i < Math.floor(games[0].avg_mech_rating); i++) {
							mechs += `<img src="assets/icons/game-icons/other-icons/gear.svg" alt="Gear" style="width:12px; height:12px;">`;
						}
						if ((games[0].avg_mech_rating - Math.floor(games[0].avg_mech_rating)) >= 0.49 ) {
							mechs += `<img src="assets/icons/game-icons/other-icons/half-gear.svg" alt="Half Gear" style="width:6px; height:12px;">`;
						}
	  					return `${mechs}<br>${games[0].avg_mech_rating}`;
  					} else {
						mechs += `<img src="assets/icons/game-icons/other-icons/question.svg" alt="Question Mark" style="width:12px; height:12px;">`;
						}
	  					return `${mechs}<br>Not Rated`;
  					}
	        	},
	        	sortable: true,
				comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
					if (!nodeA.data || !nodeB.data) return 0;
					const gamesA = summary_data.filter(item => item.game === `${nodeA.data.game}`);
					const gamesB = summary_data.filter(item => item.game === `${nodeB.data.game}`);
					const gamesAVal = gamesA.length < 1 ? 0 : gamesA[0].avg_mech_rating;
					const gamesBVal = gamesB.length < 1 ? 0 : gamesB[0].avg_mech_rating;
					return (gamesAVal - gamesBVal);
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
	        		const games = summary_data.filter(item => item.game === `${game}`);
  					let themes = ``;
	        		if (games.length < 1) {
  						return 'TBD';
  					} else if (games[0].rated) {
						for (let i = 0; i < Math.floor(games[0].avg_theme_rating); i++) {
							themes += `<img src="assets/icons/game-icons/other-icons/bulb.svg" alt="Bulb" style="width:12px; height:12px;">`;
						}
						if ((games[0].avg_theme_rating - Math.floor(games[0].avg_theme_rating)) >= 0.49 ) {
							themes += `<img src="assets/icons/game-icons/other-icons/half-bulb.svg" alt="Half Bulb" style="width:6px; height:12px;">`;
						}
	  					return `${themes}<br>${games[0].avg_theme_rating}`;
  					} else {
						themes += `<img src="assets/icons/game-icons/other-icons/question.svg" alt="Question Mark" style="width:12px; height:12px;">`;
						}
	  					return `${themes}<br>Not Rated`;
  					}
	        	},
	        	sortable: true,
				comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
					if (!nodeA.data || !nodeB.data) return 0;
					const gamesA = summary_data.filter(item => item.game === `${nodeA.data.game}`);
					const gamesB = summary_data.filter(item => item.game === `${nodeB.data.game}`);
					const gamesAVal = gamesA.length < 1 ? 0 : gamesA[0].avg_theme_rating;
					const gamesBVal = gamesB.length < 1 ? 0 : gamesB[0].avg_theme_rating;
					return (gamesAVal - gamesBVal);
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
  					const games = summary_data.filter(item => item.game === `${game}`);
	        		let learning = ``;
	        		if (games.length < 1) {
  						return 'TBD';
  					} else if (games[0].rated) {
						for (let i = 0; i < Math.floor(games[0].avg_learn_comp); i++) {
							learning += `<img src="assets/icons/game-icons/other-icons/learning-complexity.svg" alt="Clock" style="width:12px; height:12px;">`;
						}
						if ((games[0].avg_learn_comp - Math.floor(games[0].avg_learn_comp)) >= 0.49 ) {
							learning += `<img src="assets/icons/game-icons/other-icons/half-learning-complexity.svg" alt="Clock" style="width:6px; height:12px;">`;
						}
	  					return `${learning}<br>${games[0].avg_learn_comp}`;
  					} else {
						for (let i = 0; i < Math.floor(games[0].avg_learn_comp); i++) {
							learning += `<img src="assets/icons/game-icons/other-icons/nr_learning-complexity.svg" alt="Clock" style="width:12px; height:12px;">`;
						}
						if ((games[0].avg_learn_comp - Math.floor(games[0].avg_learn_comp)) >= 0.49 ) {
							learning += `<img src="assets/icons/game-icons/other-icons/nr_half-learning-complexity.svg" alt="Clock" style="width:6px; height:12px;">`;
						}
	  					return `${learning}<br>${games[0].avg_learn_comp}`;
  					}
	        	},
	        	sortable: true,
				comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
					if (!nodeA.data || !nodeB.data) return 0;
					const gamesA = summary_data.filter(item => item.game === `${nodeA.data.game}`);
					const gamesB = summary_data.filter(item => item.game === `${nodeB.data.game}`);
					const gamesAVal = gamesA.length < 1 ? 0 : gamesA[0].avg_learn_comp;
					const gamesBVal = gamesB.length < 1 ? 0 : gamesB[0].avg_learn_comp;
					return (gamesAVal - gamesBVal);
				},
				minWidth: 150
	        },
	        { 
	        	field: 'playing_complexity', 
	        	headerName: 'Playing Complexity',
	        	valueGetter: (params) => {
	        		const game = params.data.game;
	        		const games = summary_data.filter(item => item.game === `${game}`);
	        		let playing = ``;
	        		if (games.length < 1) {
  						return 'TBD';
  					} else if (games[0].rated) {
						for (let i = 0; i < Math.floor(games[0].avg_play_comp); i++) {
							playing += `<img src="assets/icons/game-icons/other-icons/playing-complexity.svg" alt="Clock" style="width:12px; height:12px;">`;
						}
						if ((games[0].avg_play_comp - Math.floor(games[0].avg_play_comp)) >= 0.49 ) {
							playing += `<img src="assets/icons/game-icons/other-icons/half-playing-complexity.svg" alt="Clock" style="width:6px; height:12px;">`;
						}
	  					return `${playing}<br>${games[0].avg_play_comp}`;
  					} else {
  						for (let i = 0; i < Math.floor(games[0].avg_play_comp); i++) {
							playing += `<img src="assets/icons/game-icons/other-icons/nr_playing-complexity.svg" alt="Clock" style="width:12px; height:12px;">`;
						}
						if ((games[0].avg_play_comp - Math.floor(games[0].avg_play_comp)) >= 0.49 ) {
							playing += `<img src="assets/icons/game-icons/other-icons/nr_half-playing-complexity.svg" alt="Clock" style="width:6px; height:12px;">`;
						}
	  					return `${playing}<br>${games[0].avg_play_comp}`;
  					}
	        	},
	        	sortable: true,
				comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
					if (!nodeA.data || !nodeB.data) return 0;
					const gamesA = summary_data.filter(item => item.game === `${nodeA.data.game}`);
					const gamesB = summary_data.filter(item => item.game === `${nodeB.data.game}`);
					const gamesAVal = gamesA.length < 1 ? 0 : gamesA[0].avg_play_comp;
					const gamesBVal = gamesB.length < 1 ? 0 : gamesB[0].avg_play_comp;
					return (gamesAVal - gamesBVal);
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