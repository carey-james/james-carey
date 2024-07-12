'use strict';

// Used for fixing '01/01/2022' dates into Date objects and adding Year
function dateFixer(arr) {
	var result = arr;
	const parseTime = d3.utcParse('%m/%d/%Y');
	const formatYear = d3.utcFormat('%Y');
	const new_date = parseTime(arr.date);
	result.date = new_date;
	result.year = formatYear(new_date);
	return result;
}

async function initBooks() {

	// Get the books data from the Reading List repo
	// https://github.com/carey-james/Reading-List
	const data_2022 = await d3.dsv("|", "https://raw.githubusercontent.com/carey-james/Reading-List/main/2022/books.csv");
	const data_2023 = await d3.dsv("|", "https://raw.githubusercontent.com/carey-james/Reading-List/main/2023/books.csv");
	const data_2024 = await d3.dsv("|", "https://raw.githubusercontent.com/carey-james/Reading-List/main/2024/books.csv");
	const raw_data = data_2022.concat(data_2023.concat(data_2024));
	const data = _sortBy(raw_data.map(dateFixer),['year','date'];
	return data;
}

// Floor/Ceiling Range
function getRange(arr, by) {
	return [Math.floor(_.min(arr) / by) * by, Math.ceil(_.max(arr) / by) * by];
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

	// Show book elements
	d3.select('.js-d-genre').classed(`tag-${d.genre}`, true);
	d3.select('.js-modal-count').html(`${entered ? `Searched by <strong>${entered}</strong>, ` : ''}${i + 1}/${count}`);
	let title = d.title;
	let favorite = 'N/A';
	if (!_.isEmpty(d.book.favorite)) {
		let fv = d.book.favorite;
	}
	const bookInfo = {
		title,
		author: d.book.author,
		date: d.book.date,
		form: d.book.form,
		genre: d.book.genre,
		published: d.book.published,
		pages: d.book.pages,
		country: d.book.country,
		series: d.book.series,
		gender: b.book.gender,
		favorite: d.book.favorite,
		year: d.book.year
	};
}

// Shelf Width
function getShelfWidth() {
	return Math.max(document.getElementById('shelf').clientWidth, 700)
}

function runner() {
	// Get Books info
	const books = initBooks();

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
	const bookWRange = [10, 60]; // Book width/thickness range
	const bookHRange = [60, storyH]; // Book Height Range

	// Two d3 Gs in the entire shelf, one for shelf bg, one for other elements
	const shelfG = d3.select('#shelf-svg').attr('width', divW).append('g');
	const g = d3.select('#shelf-svg').append('g');

	// Dimensions for each book
	const pages = books.map((d) => d.pages);
	

}

runner();