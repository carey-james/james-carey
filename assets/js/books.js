'use strict';

async function initBooks() {

	// Get the books data from the Reading List repo
	// https://github.com/carey-james/Reading-List
	const data_2022 = await d3.dsv("|", "https://raw.githubusercontent.com/carey-james/Reading-List/main/2022/books.csv");
	const data_2023 = await d3.dsv("|", "https://raw.githubusercontent.com/carey-james/Reading-List/main/2023/books.csv");
	const data_2024 = await d3.dsv("|", "https://raw.githubusercontent.com/carey-james/Reading-List/main/2024/books.csv");
	const data = _.sortBy(data_2022.concat(data_2023.concat(data_2024)),['date']);
	console.log(data);
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
		date: d.book.date_finished,
		form: d.book.category,
		genre: d.book.genre,
		pages: d.book.pages,
		written: d.book.year_written,
		favorite: d.book.favorites,
		country: d.book.country,
		series: d.book.series,
		gender: b.book.gender
	};
}

// Shelf Width
function getShelfWidth() {
	return Math.max(document.getElementById('shelf').clientWidth, 700)
}

initBooks();

// Big Code Block
/*
(() => {

}
*/