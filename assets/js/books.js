'use strict';

// Global Constants
const MIN_SHELF_WIDTH = 250; // Used in getShelfWidth, min width shelf will shrink to
const PUB_YEAR_HEIGHT_MIN = 1950; // Used in getPublishedHeight, min year for bottom of book height
const PUB_YEAR_HEIGHT_MAX = 2030;
const MAX_BOOK_HEIGHT = 100; // Height of stories (shelf shelves)
const BOOK_WIDTH_RANGE = [10, 45]; // Book width/thickness range
const STORY_GAP = 40;  // Gap between stories
const EDGE_WIDTH = 6; // Shelf edge width
const DIVIDER_GAP_0 = 16; // First level divider gap (must be bigger than second level, they overlap)
const DIVIDER_GAP_1 = 16; // Second level divider gap
const SPINE_LINE_WIDTH = 2; // 'width', aka thickness, of the spine lines
const SPINE_LINE_DISTANCE_FROM_TOP = 10; // Distance of the first Spine Line from the top of the book
const SPINE_LINE_GAP = 4 + SPINE_LINE_WIDTH; // Gap between the spine lines
const GENRE_MARKER_FROM_BOT = 20; // Distance of the genre marker from the bottom of the book
const GENRE_MARKER_WIDTH = 12; // Width of the Genre Marker Icon
const GENRE_MARKER_HEIGHT = GENRE_MARKER_WIDTH; // Height of the Genre Marker Icon
const SECOND_SORT_OPTIONS = {
	'year':['month','country','gender','genre'],
	'year_desc':['month','country','gender','genre'],
	'country':['year','year_desc','gender','genre'],
	'gender':['year','year_desc','country','genre'],
	'genre':['year','year_desc','country','gender']
}

// Used for fixing '01/01/2022' dates into Date objects and adding Year
// Also fixes the other numbers
function dateFixer(arr, index) {
	var result = arr;
	const parseTime = d3.utcParse('%m/%d/%Y');
	const formatDate = d3.utcFormat('%e %B %Y');
	const formatYear = d3.utcFormat('%Y');
	const formatMonth = d3.utcFormat('%m');
	const new_date = parseTime(arr.date);
	result.date = new_date;
	result.pretty_date = formatDate(new_date);
	result.year = formatYear(new_date);
	result.year_desc = -result.year;
	result.month = Number(formatMonth(new_date));
	result.pages = Number(arr.pages);
	result.published = Number(arr.published);
	result.id = index;
	return result;
}

// Floor/Ceiling Range
function getRange(arr, by) {
	return [Math.floor(_.min(arr) / by) * by, Math.ceil(_.max(arr) / by) * by];
}

// Divider Logic
function getDivider(datum, option) {
	let val = datum[option];
	// Get Divider Labels
	let label = val;
	if (option == 'year_desc') {
		label = -val;
	} else if (option == 'title') {
		label = _.isNaN(+val.charAt(0) ? val.charAt(0) : '#');
	} else if (option == 'month') {
		const months = ['-','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		label = months[val];
	}
	return label;
}

// Borders for shelf story gaps
function borderToDashArray(dimensions = {width, height}, border = {top, right, bottom, left}) {
	const sideLengths = {
		top: dimensions.width,
		right: dimensions.height,
		bottom: dimensions.width,
		left: dimensions.height
	};

	const dashArray = [];
	let borderOrder = ['top', 'right', 'bottom', 'left'];
	let lastSide = -1;
	for (let side of borderOrder) {
		if (lastSide !== border[side]) {
			if (side === 'top' && !border[side]) {
				dashArray.push(0);
			}
		dashArray.push(sideLengths[side]);
		} else {
			dashArray[dashArray.length - 1] += sideLengths[side];
		}
		lastSide = border[side];
	}
	return dashArray.join(',');
}

// Search
function getSearchedText(arr, entered) {
	let result = arr;
	const index = arr.toLowerCase().indexOf(entered);
	if (index > -1) {
		result = `${arr.substring(0, index)}<i>${arr.substr(index, entered.length)}</i>${arr.substring(index + entered.length, arr.length)}`;
	}
	return result;
}

// Show Modal
function showModal(d, i, count, list, entered) {
	// Control the Prev and Next buttons
	d3.select('.js-modal-prev').classed('is-hidden', i <= 0);
	if (i > 0) {
		d3.select('.js-modal-prev').on('click', () => {showModal(list[i - 1], i - 1, count, list, entered)});
	}
	d3.select('.js-modal-next').classed('is-hidden', (i < count - 1 ? false : true));
	if (i < count - 1) {
		d3.select('.js-modal-next').on('click', () => {showModal(list[i + 1], i + 1, count, list, entered)});
	}

	d3.select('.js-d-genre').attr('class',`tag js-d-genre tag-${d.genre}`);
	d3.select('.js-d-form').attr('class',`tag tag-form js-d-form`);
	d3.select('.js-modal-count').html(`${entered ? `Searched by <strong>${entered}</strong>, ` : ''}${i + 1}/${count}`);
	let title = d.title;
	let favorite = 'N/A';
	if (!_.isEmpty(d.favorite)) {
		let fv = d.favorite;
	}
	const bookInfo = {
		title,
		author: d.author,
		date: d.date,
		form: d.form,
		genre: d.genre,
		published: d.published,
		pages: d.pages,
		country: d.country,
		series: d.series || 'N/A',
		gender: d.gender,
		favorite: d.favorite || 'N/A',
		year: d.year,
		blurb: d.blurb,
		pretty_date: d.pretty_date
	};

	_.each(bookInfo, (v,k) => {
		if (v) {
			if (k === 'favorite' || k === 'series') {
				d3.select(`.js-d-${k}-wrapper`).classed('is-hidden', v === 'N/A');
				d3.select(`.js-d-${k}`).attr('class',`tag tag-${k} js-d-${k}`);
			}
			d3.select(`.js-d-${k}`).html(v);
		} 
	});
}

// Shelf Width
function getShelfWidth() {
	return Math.max(document.getElementById('shelf').clientWidth, MIN_SHELF_WIDTH)
}


// Book height based on published year
function getPublishedHeight(arr) {
	return ((arr - PUB_YEAR_HEIGHT_MIN)/(PUB_YEAR_HEIGHT_MAX - PUB_YEAR_HEIGHT_MIN)) * (95 - 65) + 65;
}


function runner(book_data) {
	// Get Books info
	const books = book_data;

	// Get Wrapper Width
	let divW = getShelfWidth();
	/* Gap is drawn in svg, sides are draw in div style (background & border)
	=========== gap
	| story H |
	=========== gap
	| story H |
	=========== gap
	*/

	// Set range for book size
	const storyH = MAX_BOOK_HEIGHT; // Max Book Height
	const storyGap = STORY_GAP; // Height of Gap
	const bookWRange = BOOK_WIDTH_RANGE; // Book width/thickness range
	const bookHRange = [60, storyH]; // Book Height Range

	// Two d3 Gs in the entire shelf, one for shelf bg, one for other elements
	const shelfG = d3.select('#shelf-svg').attr('width', divW).append('g');
	const g = d3.select('#shelf-svg').append('g');

	// Dimensions for each book
	const pages = [50,1000];//books.map((d) => d.pages);
	const pageRange = getRange(pages, 100);
	const bookW = d3.scaleLinear().domain(pageRange).range(bookWRange); // Page
	const bookH = d3.scaleLinear().domain([60,100]).range(bookHRange); // Book form

	// Put Legend of First Level (id) and 2nd Level
	const putLegend0 = (text, count, accW, accS, isInitial, gap) => {
	    // hide labels first after sorting option is changed
	    let triangle = 5;
	    let pX = accW;
	    let pY = (accS - 1) * (storyH + storyGap);
	    let wrapper = g.append('g')
	    	.attr('transform', `translate(${pX}, ${pY})`)
	    	.attr('class', `js-legends${isInitial ? '' : ' is-hidden'}`)
	    wrapper.append('rect')
	    	.attr('x', -gap + 5)
	    	.attr('y', storyGap)
	    	.attr('width', gap - 5.5)
	    	.attr('height', storyH)
	    	.attr('class', 'legend-0-bg');
	    wrapper.append('text')
	    	.attr('x', -gap + 5)
	    	.attr('y', storyGap - triangle * 3)
	    	.attr('dy', -4)
	    	.text(text)
	    	.attr('class', 'legend-0');
	    wrapper.append('text')
	    	.attr('x', -gap + 5 + triangle * 1.2 + 4)
	    	.attr('y', storyGap - triangle - 2)
	    	.attr('class', 'legend-0-count')
	    	.attr('id', `legend-0-${count}`);
	    //triangle
	    g.append('path')
	    	.attr('d', `M${pX - gap + 5} ${pY + storyGap - triangle * 2 - 2} l ${triangle * 1.2} ${triangle} l ${-triangle * 1.2} ${triangle} z`)
	    	.attr('class', `legend-arrow js-legends${isInitial ? '' : ' is-hidden'}`)
	};
	const putLegend1 = (text, count, accW, accS, isInitial, gap) => {
	    let pX = accW;
	    let pY = accS * (storyH + storyGap) - storyH;
	    let wrapper = g.append('g')
	    	.attr('transform', `translate(${pX}, ${pY})`)
	    	.attr('class', `js-legends${isInitial ? '' : ' is-hidden'}`);
	    wrapper.append('rect')
	    	.attr('x', -gap + 0.5)
	    	.attr('y', 0)
	    	.attr('width', gap - 1)
	      	.attr('height', storyH)
	      	.attr('class', 'legend-1-bg')
	      	.attr('stroke-dasharray', borderToDashArray({
        			width: gap - 1,
        			height: storyH
        		}, {
        			top: true,
        			right: false,
        			bottom: false,
        			left: true
        	}));
	    wrapper.append('text')
	      	.attr('x', -4)
	      	.attr('y', 4)
	      	.text(text)
	      	.attr('transform', `rotate(90, -4, 4)`)
	      	.attr('class', 'legend-1');
	    wrapper.append('text')
	      	.attr('y', 12)
	      	.attr('x', storyH - 18)
	      	.attr('class', 'legend-1-percent')
	      	.attr('id', `legend-1-percent-${count}`);
	    wrapper.append('text')
	      	.attr('x', -4)
	      	.attr('y', storyH)
	      	.attr('dy', -4)
	      	.attr('class', 'legend-1-count')
	      	.attr('id', `legend-1-${count}`);
  	};

  	// Sort Options
  	let sortOptions = ['year','month'];

  	// Get new positions for the books when option is changed and put legends
  	function getDimensions(sortedBooks, isInitial) {
  		// Remove all legends
  		d3.selectAll('.js-legends').remove();
  		d3.selectAll('.js-shelves').remove();
  		let prevVals = _.map(sortOptions, (o) => getDivider(sortedBooks[0], o));
  		let edge = EDGE_WIDTH;
  		let gap0 = DIVIDER_GAP_0; //first level gap
  		let gap1 = DIVIDER_GAP_1; //second level gap
    	let accW = gap0; //accumulated width
    	let accS = 1; //accumultated number of stories
    	let dimensions = [];
    	let counts = [0, 0, 0]; //count of books in the current label
    	let isNewLabels = [true, true]; //check if the books are divided
    	let labelCounts = [0, 0]; //counts of each label, used for id
    	let runningCounts = new Map();
    	_.each(sortedBooks, (d, i) => {
     		const w = bookW(d.pages); // book width
      		const h = bookH(getPublishedHeight(d.published)); // book height
      		const dividers = sortOptions.map((o) => getDivider(d, o)); // get labels at the dividing postions
      		// check with the previous vals, then decide to divide or not
		    if (dividers[0] !== prevVals[0]) {
		    	accW += gap0;
		        isNewLabels[0] = true;
		    } else if (dividers[1] !== prevVals[1]){
		        accW += gap1;
		        isNewLabels[1] = true;
		    }
      		// check if the accmulated books' width is larger than the shelf width or it's a new top-level division
	    	if ((accW + w > divW) || (dividers[0] !== prevVals[0])) {
	        	accS++;
	        	if (_.isEqual(prevVals, dividers)) {
	          		accW = 0;
	        	} else if (prevVals[0] !== dividers[0]) {
	          		accW = gap0;
	        	} else if (prevVals.length > 1 && prevVals[1] !== dividers[1]) {
	          		accW = gap1;
	        	}
      		}
      		// add demensions
      		dimensions.push({
        		x: accW,
        		y: (storyH + storyGap) * accS - h,
        		bookId: d.id //needed for d3 selection
      		})
      		// update prev vals
      		counts[0]++;
      		counts[1]++;
      		// put the first level label
      		if (isNewLabels[0]) {
        		putLegend0(dividers[0], labelCounts[0], accW, accS, isInitial, gap0);
        		//update count for the previous values
        		d3.select(`#legend-0-${labelCounts[0] - 1}`).text(counts[0]);
        		runningCounts.forEach(function(value, key){
        			if (key < counts[2]) {
        				let oldCount = parseInt(d3.select(`#legend-0-${labelCounts[0] - 1}`).text());
        				d3.select(`#legend-1-percent-${key}`).text(`${((value / oldCount) * 100).toString().split('.')[0]}%`);
        			} else {
        				d3.select(`#legend-1-percent-${key}`).text(`${((value / counts[0]) * 100).toString().split('.')[0]}%`);
        			}	
        		})
        		runningCounts.clear();
        		counts[2] = labelCounts[1]; // Used for Percentage
       	 		counts[0] = 0;
        		labelCounts[0]++;
      		}
      		// put the second level only for two sorting options
     		if ((isNewLabels[0] || isNewLabels[1]) && sortOptions.length === 2) {
        		putLegend1(dividers[1], labelCounts[1], accW, accS, isInitial, gap1);
        		d3.select(`#legend-1-${labelCounts[1] - 1}`).text(counts[1]);
        		runningCounts.set(labelCounts[1] - 1, counts[1]);
        		counts[1] = 0;
        		labelCounts[1]++;
      		}
      		// update the last labels; count
      		if (i === sortedBooks.length - 1) {
        		d3.select(`#legend-0-${labelCounts[0] - 1}`).text(counts[0] + 1);
        		d3.select(`#legend-1-${labelCounts[1] - 1}`).text(counts[1] + 1);
        		runningCounts.set(labelCounts[1] - 1, counts[1]);
        		runningCounts.forEach(function(value, key){
        			d3.select(`#legend-1-percent-${key}`).text(`${((value / counts[0]) * 100).toString().split('.')[0]}%`);
        		})
      		}
      		// add width, update before the next iteration
      		accW += (w + 0);
      		prevVals = dividers;
      		isNewLabels = [false, false];
    	});

    	// Add the percents
    	let percent_markers = d3.selectAll('.legend-1-percent');



    	// set the wrapper height to fit
    	d3.select('#shelf-svg').attr('height', accS * (storyGap + storyH) + storyGap);
    	// put story gap
    	_.each(_.range(accS + 1), (i) => {
      		shelfG.append('rect')
        		.attr('x', 0)
        		.attr('y', i * (storyH + storyGap))
        		.attr('width', divW)
        		.attr('height', storyGap)
        		.attr('class', 'shelf-gap js-shelves')
        		.attr('stroke-dasharray', borderToDashArray({
        			width: divW,
        			height: storyGap
        		}, {
        			top: true,
        			right: false,
        			bottom: false,
        			left: true
        		}))
   		});
    return dimensions;
  	}

  	function resizeShelf() {
    	const sortedBooks = _.sortBy(books, sortOptions);
    	const dimensions = getDimensions(sortedBooks, false);
    	// disable the sorting options
    	d3.selectAll('select').attr('disabled', 'disabled');
    	// move books
   	 	_.each(dimensions, (d, i) => {
     		const bg = d3.select(`#book-${d.bookId}`);
      		// move horizontally first, then move vertically
      		const currentY = bg.attr('prev-y');
      		bg.attr('prev-y', d.y)
        		.transition()
          		.attr('transform', `translate(${d.x}, ${currentY})`)
          		.duration(1000)
          		.delay(800 * Math.random())
          		.on('end', function() {
            		d3.select(this)
              			.transition()
              			.duration(800)
              			.delay(600 * Math.random())
              			.attr('transform', `translate(${d.x}, ${d.y})`)
              			.on('end', () => {
                			// when animation ends, show the legends
                			d3.selectAll('.js-legends').classed('is-hidden', false);
                			// enable back the sorting options
                			_.delay(() => { d3.selectAll('select').attr('disabled', null) }, 1400);
              			});
          		});
      		bg.on('click', () => {
        		d3.select('#modal').classed('is-active', true);
        		showModal(sortedBooks[i], i, dimensions.length, sortedBooks);
      		});
    	});
  	}

  	// Sort Books
  	function sortBooks(option, id) {
    	// Update global sort option and sort the original books
    	sortOptions[+id] = option;
    	resizeShelf();
  	}

  	// Book drawing
  	const dimensions = getDimensions(books, true);
  	function getUpPos(elm, isUp) {
  		// Get current transform value, then update Y pos
  		const currP = elm.attr('transform');
  		const splitted = currP.split(', ');
  		const currY = splitted[1].slice(0, splitted[1].length - 1);
  		return `${splitted[0]}, ${currY - (isUp ? 10 : -10)})`;
  	}
  	g.selectAll('.js-books')
  		.data(books)
  			.enter()
		.append('g') // Book wrapper
  			.attr('transform', (d, i) => `translate(${dimensions[i].x}, ${dimensions[i].y})`)
  			.attr('title', (d) => {
        		let title = `<span class="bname"><strong>${d.title}</strong></span>`;
        		return `${title}<div><div class="author">by <strong>${d.author}</strong></div></div><div><img src="assets/icons/flags/${d.country}.png" alt="${d.country}" style="width:15px; height:15px;"></div>`;
        	})
      	.attr('class', 'js-books')
      	.attr('id', (d) => `book-${d.id}`)
      	.attr('prev-y', (d, i) => dimensions[i].y)
      	.on('mouseover', function(d) {
        	if ('ontouchstart' in document) {
          		return false;
        	}
        	//effect of book being picked up
        	d3.select(`#book-${d.id}`)
          		.attr('transform', getUpPos(d3.select(this), true));
        	//tippy
        	tippy(`#book-${d.id}`, {
          		arrow: true,
         		duration: 0,
          		size: 'small',
          		theme: `book-${d.genre}`
        	});
      	})
      	.on('mouseout', function(d) {
        	if ('ontouchstart' in document) {
          		return false;
        	}
        	d3.select(`#book-${d.id}`)
          		.attr('transform', getUpPos(d3.select(this), false));
      	})
      	.on('click', (d, i) => {
        	d3.select('#modal').classed('is-active', true);
        	showModal(d, i, books.length, books);
      	})
    	.append('rect')
      		.attr('x', 0)
      		.attr('y', 0)
      		.attr('width', (d) => bookW(d.pages))
      		.attr('height', (d) => bookH(getPublishedHeight(d.published)))
      		.attr('rx', 1)
      		.attr('ry', 1)
      		.attr('id', (d) => `book-rect-${d.id}`)
      		.attr('class', (d) => `genre-${d.genre} book-${d.gender}`);
	
	// Mark favorites
    _.each(_.filter(books, (d) => d.favorite), (d) => {
    	d3.select(`#book-${d.id}`)
    		.append('path')
    		.attr('d','M 0 0 V -10 L 6 -4 L 12 -10 V 0 Z')
    		.attr('class', 'favorite')
    });

    // Spine Lines for form and gender
    _.each(books, (d) => {
    	// One line for Non-Fiction and Drama, Drama dashed in CSS
    	d3.select(`#book-${d.id}`)
    		.append('line')
    			.style('stroke-width', SPINE_LINE_WIDTH)
    			.attr('x1', 0)
    			.attr('y1', SPINE_LINE_DISTANCE_FROM_TOP)
    			.attr('x2', bookW(d.pages))
    			.attr('y2', SPINE_LINE_DISTANCE_FROM_TOP)
    			.attr('class', `line-gender-${d.gender} line-form-${d.form}`)
    	// Two lines for Fiction and Poetry, Poetry dashed in CSS
    	if (d.form === 'Fiction' || d.form === 'Comics' || d.form === 'Poetry') {
    		d3.select(`#book-${d.id}`)
    		.append('line')
    			.style('stroke-width', SPINE_LINE_WIDTH)
    			.attr('x1', 0)
    			.attr('y1', (SPINE_LINE_DISTANCE_FROM_TOP + SPINE_LINE_GAP))
    			.attr('x2', bookW(d.pages))
    			.attr('y2', (SPINE_LINE_DISTANCE_FROM_TOP + SPINE_LINE_GAP))
    			.attr('class', `line-gender-${d.gender} line-form-${d.form}`)
    	} 
    	// Three lines for Comics
    	if (d.form === 'Comics') {
    		d3.select(`#book-${d.id}`)
    		.append('line')
    			.style('stroke-width', SPINE_LINE_WIDTH)
    			.attr('x1', 0)
    			.attr('y1', (SPINE_LINE_DISTANCE_FROM_TOP + (SPINE_LINE_GAP * 2)))
    			.attr('x2', bookW(d.pages))
    			.attr('y2', (SPINE_LINE_DISTANCE_FROM_TOP + (SPINE_LINE_GAP * 2)))
    			.attr('class', `line-gender-${d.gender} line-form-${d.form}`)
    	}
    });

    // Genre Marker Symbol on Spine
    _.each(books, (d) => {
    	d3.select(`#book-${d.id}`)
    		.append('svg:image')
				.attr('x', ((bookW(d.pages) / 2) - ( GENRE_MARKER_WIDTH / 2)))
				.attr('y', (bookH(getPublishedHeight(d.published)) - GENRE_MARKER_FROM_BOT))
				.attr('width', GENRE_MARKER_WIDTH)
				.attr('height', GENRE_MARKER_HEIGHT)
				.attr('xlink:href', `assets/icons/book-icons/${d.genre}.svg`)
    });

    // Modal close
  	d3.select('#modal-close').on('click', () => {
    	d3.select('#modal').classed('is-active', false);
  	});

  	// Search 
  	/*
  	let selectedId = -1;
  	function resetSearch() {
  		selectedId = -1;
  		d3.selectAll('.js-search-elm').classed('is-hidden', true);
  		d3.select('#search-result').html('');
  	}

  	function triggerModal(obj, i, count, list, entered) {
  		d3.select('#modal').classed('is-active', true);
  		showModal(obj, i, count, list, entered);
  		resetSearch();
  	}

  	document.getElementById('search-input').addEventListener('keyup', function(d) {
  		// Check for a min of 3 letters
  		if (this.value.length > 2) {
  			const entered = this.value.trim().toLowerCase();
  			const filtered = _.filter(books, (d) => {
  				return d.title.toLowerCase().indexOf(entered) > -1 || d.author.toLowerCase().indexOf(entered) > -1;
  			});
  		// Show only books with the typed letters
  		if (filtered.length > 0) {
  			const
  		}
  		}
  	}
  	*/

  	// Sort
  	document.getElementById('sort-0').addEventListener('change', (d) => {
  		const option = d.target.value;
  		// Hide second sort option if first option doesn't support second sort
  		const withSecond = Object.keys(SECOND_SORT_OPTIONS);
  		let isHidden = false;
  		if (withSecond.indexOf(option) === -1) { // Options without second option
  			isHidden = true;
  			sortOptions = []; // Empty Sort options
  		} else {
  			// Set second options back, when withSecond option is selected
  			const second = document.getElementById('sort-1');
  			const sec_opts = second.options;
  			let flag = true;
  			_.each(sec_opts, (o) => {
  				d3.select(o).selected = false;
				if (!(SECOND_SORT_OPTIONS[option].includes(o.value))) {
					d3.select(o).property('disabled', true);
  				} else {
  					d3.select(o).property('disabled', false);
  					if (flag) {
  						d3.select('sort-1').value = o.value;
  						flag = false;
  					}
  				}
  			});
  		}
  		d3.select('#option-1').classed('is-hidden', isHidden);
  		sortBooks(d.target.value, 0);
  		if (!isHidden) {
  			sortBooks(d3.select('sort-1').value, 1);
  		}
  	});
  	document.getElementById('sort-1').addEventListener('change', (d) => {
  		sortBooks(d.target.value, 1);
  	});

  	// Resize
  	window.addEventListener('resize', _.debounce(() => {
  		const newW = getShelfWidth();
  		if (newW !== divW) {
  			divW = newW;
  			d3.select('#shelf-svg').attr('width', divW);
  			resizeShelf();
  		}
  	}), 500);
}

async function initBooks() {
	// Get the books data from the Reading List repo
	// https://github.com/carey-james/Reading-List
	const data_2022 = await d3.dsv('|', 'https://raw.githubusercontent.com/carey-james/Reading-List/main/2022/books.csv');
	const data_2023 = await d3.dsv('|', 'https://raw.githubusercontent.com/carey-james/Reading-List/main/2023/books.csv');
	const data_2024 = await d3.dsv('|', 'https://raw.githubusercontent.com/carey-james/Reading-List/main/2024/books.csv');
	const raw_data = data_2022.concat(data_2023.concat(data_2024));
	const data = _.sortBy(raw_data.map(dateFixer),['year','date']);
	runner(data);
}

initBooks();