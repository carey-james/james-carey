'use strict';

function runner(games_data, feedback_data) {
	let gridApi;

	let summary_data = [];
	const all_games = [...new Set(games_data.map(item => item.game))];
	const feedback_games = [...new Set(feedback_data.map(item => item.game))];
	all_games.forEach(game => {
		let summary_item = {};
		summary_item.game = game;
		if (feedback_games.includes(game)) {
			summary_item.rated = true;
			const filtered_items = feedback_data.filter(item => item.game === game);
			summary_item.avg_mech_rating = parseFloat((filtered_items.map(item => parseInt(item.mechanics_enjoyment, 10)).reduce((sum, rating) => sum + rating, 0) / filtered_items.length).toFixed(1));
			summary_item.avg_theme_rating = parseFloat((filtered_items.map(item => parseInt(item.theme_enjoyment, 10)).reduce((sum, rating) => sum + rating, 0) / filtered_items.length).toFixed(1));
			summary_item.min_time = Math.ceil(d3.quantile(filtered_items.map(item => parseInt(item.playtime, 10)).sort((a, b) => (a - b)), 0.25)/ 5) * 5;
			summary_item.max_time = Math.ceil(d3.quantile(filtered_items.map(item => parseInt(item.playtime, 10)).sort((a, b) => (a - b)), 0.75)/ 5) * 5;	
			summary_item.avg_learn_comp = parseFloat((filtered_items.map(item => parseInt(item.learning_complexity, 10)).reduce((sum, rating) => sum + rating, 0) / filtered_items.length).toFixed(1));
			summary_item.avg_play_comp = parseFloat((filtered_items.map(item => parseInt(item.playing_complexity, 10)).reduce((sum, rating) => sum + rating, 0) / filtered_items.length).toFixed(1));
			summary_data.push(summary_item);
		} else {
			summary_item.rated = false;
			const filtered_item = games_data.filter(item => item.game === game)[0];
			summary_item.avg_mech_rating = 0;
			summary_item.avg_theme_rating = 0;
			summary_item.min_time = parseInt(filtered_item.min_time, 10);
			summary_item.max_time = parseInt(filtered_item.max_time, 10);
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
	        	minWidth: 100
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
	        	minWidth: 90
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
	        	minWidth: 90
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
					for (let i = 1; ((i <= maxPlayers) && (i <= 15)); i++) {
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
	        	minWidth: 120
			},
	        { field: 'min_players', hide: true },
	        { field: 'max_players', hide: true },
	        { field: 'min_best', hide: true },
	        { field: 'max_best', hide: true },
	        {
				field: 'time',
				headerName: 'Time',
				valueGetter: (params) => {
					const game = params.data.game;
  					const games = summary_data.filter(item => item.game === `${game}`);
					const minTime = games[0].min_time;
					const maxTime = games[0].max_time;
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
					if (games[0].rated) {
						for (let i = 0; i < numClocks; i++) {
							clocks += `<img src="assets/icons/game-icons/other-icons/clock.svg" alt="Clock" style="width:12px; height:12px;">`;
						}
					} else {
						for (let i = 0; i < numClocks; i++) {
							clocks += `<img src="assets/icons/game-icons/other-icons/nr_clock.svg" alt="Clock" style="width:12px; height:12px;">`;
						}
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
					const gamesA = summary_data.filter(item => item.game === `${nodeA.data.game}`);
					const gamesB = summary_data.filter(item => item.game === `${nodeB.data.game}`);
					return (((Number(gamesA[0].max_time) + Number(gamesA[0].min_time)) / 2) - ((Number(gamesB[0].max_time) + Number(gamesB[0].min_time)) / 2));
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
				minWidth: 120
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
				minWidth: 120
	        },
	        {
	        	field: 'extras',
	        	headerName: '',
	        	valueGetter: (params) => {
	        		let extras = ``;
	        		// if (params.data.expansion !== '') {
	        		// 	extras += `<img src="assets/icons/game-icons/other-icons/expansion.svg" alt="Expansion" style="width:14px; height:14px;">  `;
	        		// }
	        		if (params.data.co_op !== '') {
	        			extras += `<img src="assets/icons/game-icons/other-icons/co_op.svg" alt="Co-Op" style="width:14px; height:14px;">  `;
	        		}
	        		if (params.data.team !== '') {
	        			extras += `<img src="assets/icons/game-icons/other-icons/team.svg" alt="Team" style="width:14px; height:14px;">  `;
	        		}
	        		// if (params.data.legacy !== '') {
	        		// 	extras += `<img src="assets/icons/game-icons/other-icons/legacy.svg" alt="Legacy" style="width:14px; height:14px;">  `;
	        		// }
	        		if (params.data.favorite !== '') {
	        			extras += `<img src="assets/icons/game-icons/other-icons/favorite.svg" alt="Favorite" style="width:14px; height:14px;">  `;
	        		}
	        		// if (params.data.play_more !== '') {
	        		// 	extras += `<img src="assets/icons/game-icons/other-icons/play_more.svg" alt="Play More" style="width:14px; height:14px;">  `;
	        		// }
	        		return `${extras}`;
	        	},
	        	sortable: false,
	        	minWidth: 30
	        },
	        { 
	        	field: 'blurb', 
	        	headerName: 'Description',
	        	sortable: false,
	        	minWidth: 170
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
  		headerHeight: 60,
  		isExternalFilterPresent: isExternalFilterPresent,
  		doesExternalFilterPass: doesExternalFilterPass
	};

	let player_filter = false;
	let players = 1;
	let time_filter = false;
	let time_slide = 180;
	let co_op_filter = false;
	let team_filter = false;
	let favorite_filter = false;
	let unrated_filter = false
	// let play_more_filter = false;
	function isExternalFilterPresent() {
		return (player_filter || time_filter || co_op_filter || team_filter || favorite_filter || unrated_filter);
	}
	function doesExternalFilterPass(node) {
		if (node.data) {
			const games = summary_data.filter(item => item.game === `${node.data.game}`);
			if (player_filter) {
				if (players === 12) {
					if (!(node.data.max_players >= 12)) {
						return false;
					} // Show games with max_players >= 12
				}
				if (!((players >= Number(node.data.min_players)) && (players <= Number(node.data.max_players)))) {
					return false;
				}
			}
			if (time_filter) {
				if (time_slide < 175) {
					if (time_slide < (games[0].max_time - 5)) { // Allow for a bit of wiggle room
						return false; 
					}
				}
			}
			if (co_op_filter) {
				if (!(node.data.co_op)) {
					return false;
				}
			}
			if (team_filter) {
				if (!(node.data.team)) {
					return false;
				}
			}
			if (favorite_filter) {
				if (!(node.data.favorite)) {
					return false;
				}
			}
			if (unrated_filter) {
				if (games[0].rated) {
					return false;
				}
			}
			// if (play_more_filter) {
			// 	if (!(node.data.play_more)) {
			// 		return false;
			// 	}
			// }
		}
		return true;
	}

	// Your Javascript code to create the Data Grid
	const myGridElement = document.querySelector('#gamesGrid');
	gridApi = agGrid.createGrid(myGridElement, gridOptions);

	// Filter listeners
	const players_box = document.getElementById('players-box');
	players_box.addEventListener('change', function(event) {
		if (event.target.checked) {
			player_filter = true;
		} else {
			player_filter = false;
		}
		gridApi.onFilterChanged();
	});
	const players_slider = document.getElementById('players-slider');
	const players_slider_value = document.getElementById('players-slider-value');
	players_slider.addEventListener('input', function () {
		let value = players_slider.value;
		if (value == 12) {
			players_slider_value.textContent = '12+';
		} else {
			players_slider_value.textContent = value;
		}
		players = value;
		gridApi.onFilterChanged();
	});
	const time_box = document.getElementById('time-box');
	time_box.addEventListener('change', function(event) {
		if (event.target.checked) {
			time_filter = true;
		} else {
			time_filter = false;
		}
		gridApi.onFilterChanged();
	});
	const time_slider = document.getElementById('time-slider');
	const time_slider_value = document.getElementById('time-slider-value');
	time_slider.addEventListener('input', function () {
		let value = time_slider.value;
		if (value == 180) {
			time_slider_value.textContent = '180+';
		} else {
			time_slider_value.textContent = value;
		}
		time_slide = value;
		gridApi.onFilterChanged();
	});
	const co_op_box = document.getElementById('co-op-box');
	co_op_box.addEventListener('change', function(event) {
		if (event.target.checked) {
			co_op_filter = true;
		} else {
			co_op_filter = false;
		}
		gridApi.onFilterChanged();
	});
	const team_box = document.getElementById('team-box');
	team_box.addEventListener('change', function(event) {
		if (event.target.checked) {
			team_filter = true;
		} else {
			team_filter = false;
		}
		gridApi.onFilterChanged();
	});
	const favorite_box = document.getElementById('favorite-box');
	favorite_box.addEventListener('change', function(event) {
		if (event.target.checked) {
			favorite_filter = true;
		} else {
			favorite_filter = false;
		}
		gridApi.onFilterChanged();
	});
	const unrated_box = document.getElementById('unrated-box');
	unrated_box.addEventListener('change', function(event) {
		if (event.target.checked) {
			unrated_filter = true;
		} else {
			unrated_filter = false;
		}
		gridApi.onFilterChanged();
	});
	// const play_more_box = document.getElementById('play-more-box');
	// play_more_box.addEventListener('change', function(event) {
	// 	if (event.target.checked) {
	// 		play_more_filter = true;
	// 	} else {
	// 		play_more_filter = false;
	// 	}
	// 	gridApi.onFilterChanged();
	// });
	

}

async function initGames() {
	// Get the games from the Games List repo
	// https://github.com/carey-james/Games-List
	const games = await d3.dsv('|', 'https://raw.githubusercontent.com/carey-james/Games-List/refs/heads/main/games.csv');
	const feedback = await d3.dsv('|', 'https://raw.githubusercontent.com/carey-james/Games-List/refs/heads/main/feedback.csv');
	runner(games, feedback);}

initGames();