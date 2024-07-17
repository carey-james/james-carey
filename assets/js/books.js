'use strict';

// Used for fixing '01/01/2022' dates into Date objects and adding Year
// Also fixes the other numbers
function dateFixer(arr, index) {
	var result = arr;
	const parseTime = d3.utcParse('%m/%d/%Y');
	const formatYear = d3.utcFormat('%Y');
	const formatMonth = d3.utcFormat('%m');
	const new_date = parseTime(arr.date);
	result.date = new_date;
	result.year = formatYear(new_date);
	result.month = Number(formatMonth(new_date));
	result.pages = Number(arr.pages);
	result.published = Number(arr.published);
	console.log(result);
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
	d3.select('.js-d-form').attr('class',`tag js-d-form tag-${d.form}`);
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
		year: d.year
	};

	_.each(bookInfo, (v,k) => {
		if (v) {
			if (k === 'favorite' || k === 'series') {
				d3.select(`.js-d-${k}-wrapper`).classed('is-hidden', v === 'N/A');
			}
			d3.select(`.js-d-${k}`).html(v);
		} 
	});
}

// Shelf Width
function getShelfWidth() {
	return Math.max(document.getElementById('shelf').clientWidth, 250)
}


// Book height based on published year
function getPublishedHeight(arr) {
	/*if (arr == 'Comics') {
		return 95;
	} else if (arr == 'Non-Fiction') {
		return 85;
	} else if (arr == 'Fiction') {
		return 75;
	} else if (arr == 'Drama') {
		return 70;
	} else if (arr == 'Poetry') {
		return 65;
	} else {
		return 70;
	}*/
	return ((arr - 1950)/(2030 - 1950)) * (95 - 65) + 65;

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
	const storyH = 100; // Max Book Height
	const storyGap = 40; // Height of Gap
	const bookWRange = [10, 50]; // Book width/thickness range
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
	      	.attr('class', 'legend-1-bg');
	    wrapper.append('text')
	      	.attr('x', -4)
	      	.attr('y', 4)
	      	.text(text)
	      	.attr('transform', `rotate(90, -4, 4)`)
	      	.attr('class', 'legend-1');
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
  		let edge = 6;
  		let gap0 = 14; //first level gap
  		let gap1 = 14; //second level gap
    	let accW = gap0; //accumulated width
    	let accS = 1; //accumultated number of stories
    	let dimensions = [];
    	let counts = [0, 0]; //count of books in the current label
    	let isNewLabels = [true, true]; //check if the books are divided
    	let labelCounts = [0, 0]; //counts of each label, used for id
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
       	 		counts[0] = 0;
        		labelCounts[0]++;
      		}
      		// put the second level only for two sorting options
     		if ((isNewLabels[0] || isNewLabels[1]) && sortOptions.length === 2) {
        		putLegend1(dividers[1], labelCounts[1], accW, accS, isInitial, gap1);
        		d3.select(`#legend-1-${labelCounts[1] - 1}`).text(counts[1]);
        		counts[1] = 0;
        		labelCounts[1]++;
      		}
      		// update the last labels; count
      		if (i === sortedBooks.length - 1) {
        		d3.select(`#legend-0-${labelCounts[0] - 1}`).text(counts[0] + 1);
        		d3.select(`#legend-1-${labelCounts[1] - 1}`).text(counts[1] + 1);
      		}
      		// add width, update before the next iteration
      		accW += (w + 0);
      		prevVals = dividers;
      		isNewLabels = [false, false];
    	});

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
    	//update global sort option and sort the original books
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
        		let title = `<strong>${d.title}</strong>`;
        		return `${title}<div><div class="author">by <strong>${d.author}</strong></div></div>`;
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
    		.attr('d', `M 0 0 h ${bookWRange[0]} l -${bookWRange[0]} ${bookWRange[0]} z`)
    		.attr('class', 'favorite')
    });

    // Genre Symbol on Spine
    _.each(books, (d) => {
    	d3.select(`#book-${d.id}`)
    		.append('svg:image')
				.attr('x', ((bookW(d.pages) / 2) -6))
				.attr('y', (bookH(getPublishedHeight(d.published)) - 20))
				.attr('width', 12)
				.attr('height', 12)
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
  	/*
  	document.getElementById('sort-0').addEventListener('change', (d) => {
  		const option = d.target.value;
  		// Can add second sort option here
  		sortBooks(d.target.value, 0);
  	});
  	*/

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
	const data_2022 = await d3.dsv("|", "https://raw.githubusercontent.com/carey-james/Reading-List/main/2022/books.csv");
	const data_2023 = await d3.dsv("|", "https://raw.githubusercontent.com/carey-james/Reading-List/main/2023/books.csv");
	const data_2024 = await d3.dsv("|", "https://raw.githubusercontent.com/carey-james/Reading-List/main/2024/books.csv");
	const raw_data = data_2022.concat(data_2023.concat(data_2024));
	const data = _.sortBy(raw_data.map(dateFixer),['year','date']);
	runner(data);
}

initBooks();