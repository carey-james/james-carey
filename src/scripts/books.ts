import * as d3 from 'd3'
import _ from 'lodash'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

const MIN_SHELF_WIDTH = 250
const PUB_YEAR_HEIGHT_MIN = 1950
const PUB_YEAR_HEIGHT_MAX = 2030
const MAX_BOOK_HEIGHT = 100
const BOOK_WIDTH_RANGE: [number, number] = [10, 45]
const STORY_GAP = 40
const EDGE_WIDTH = 6
const DIVIDER_GAP_0 = 16
const DIVIDER_GAP_1 = 16
const SPINE_LINE_WIDTH = 2
const SPINE_LINE_DISTANCE_FROM_TOP = 10
const SPINE_LINE_GAP = 4 + SPINE_LINE_WIDTH
const GENRE_MARKER_FROM_BOT = 20
const GENRE_MARKER_WIDTH = 12
const GENRE_MARKER_HEIGHT = GENRE_MARKER_WIDTH

const SECOND_SORT_OPTIONS = {
	year: ['month', 'country', 'gender', 'genre'],
	year_desc: ['month', 'country', 'gender', 'genre'],
	country: ['year', 'year_desc', 'gender', 'genre'],
	gender: ['year', 'year_desc', 'country', 'genre'],
	genre: ['year', 'year_desc', 'country', 'gender'],
}

interface Book {
	title: string
	author: string
	date: Date
	form: string
	genre: string
	published: number
	pages: number
	country: string
	series?: string
	gender: string
	favorite?: string
	year: string
	year_desc: number
	month: number
	blurb?: string
	pretty_date: string
	id: number
}

// Used for fixing '01/01/2022' dates into Date objects and adding Year
// Also fixes the other numbers
function dateFixer(arr: Record<string, string>, index: number): Book {
	const parseTime = d3.utcParse('%m/%d/%Y')
	const formatDate = d3.utcFormat('%e %B %Y')
	const formatYear = d3.utcFormat('%Y')
	const formatMonth = d3.utcFormat('%m')
	const newDate = parseTime(arr.date)
	if (!newDate) {
		throw new Error(`Invalid date: ${arr.date}`)
	}
	return {
		...arr,
		date: newDate,
		pretty_date: formatDate(newDate),
		year: formatYear(newDate),
		year_desc: -Number(formatYear(newDate)),
		month: Number(formatMonth(newDate)),
		pages: Number(arr.pages),
		published: Number(arr.published),
		id: index,
		title: arr.title,
		author: arr.author,
		form: arr.form,
		genre: arr.genre,
		country: arr.country,
		gender: arr.gender,
		series: arr.series,
		favorite: arr.favorite,
		blurb: arr.blurb,
	}
}

// Floor/Ceiling Range
function getRange(arr: number[], by: number): [number, number] {
	return [
		Math.floor(_.min(arr) / by) * by,
		Math.ceil(_.max(arr) / by) * by,
	]
}

// Divider Logic
function getDivider(datum: Book, option: keyof Book): string | number {
	let val = datum[option]
	// Get Divider Labels
	if (option === 'year_desc') {
		return -Number(val)
	}
	if (option === 'month') {
		const months = [
			'-',
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		]
		return months[Number(val)]
	}
	if (typeof val === 'string') {
		return val
	}
	return val
}

// Borders for shelf story gaps
function borderToDashArray(
	dimensions: {
		width: number
		height: number
	},
	border: {
		top: boolean
		right: boolean
		bottom: boolean
		left: boolean
	}
): string {
	const sideLengths = {
		top: dimensions.width,
		right: dimensions.height,
		bottom: dimensions.width,
		left: dimensions.height,
	}
	const dashArray: number[] = []
	const borderOrder = ['top', 'right', 'bottom', 'left'] as const
	let lastSide = -1
	for (const side of borderOrder) {
		if (lastSide !== Number(border[side])) {
			if (side === 'top' && !border[side]) {
				dashArray.push(0)
			}
			dashArray.push(sideLengths[side])
		} else {
			dashArray[dashArray.length - 1] += sideLengths[side]
		}
		lastSide = Number(border[side])
	}
	return dashArray.join(',')
}

// Shelf Width
function getShelfWidth(): number {
	const shelf = document.getElementById('shelf')
	if (!shelf) {
		throw new Error('Could not find #shelf')
	}
	return Math.max(shelf.clientWidth, MIN_SHELF_WIDTH)
}

// Book height based on published year
function getPublishedHeight(year: number): number {
	if (year < 1900) {
		return (((1900 - PUB_YEAR_HEIGHT_MIN) / (PUB_YEAR_HEIGHT_MAX - PUB_YEAR_HEIGHT_MIN)) * (95 - 65) + 65)
	}
	return (
		((year - PUB_YEAR_HEIGHT_MIN) / (PUB_YEAR_HEIGHT_MAX - PUB_YEAR_HEIGHT_MIN)) * (95 - 65) + 65)
}

// Show Modal
function showModal(book: Book, index: number, count: number, list: Book[], entered?: string): void {
	const modal = d3.select('#modal')
	// Open modal
	modal.classed('is-active', true)
	// Previous button
	const prev = d3.select('.js-modal-prev')
	prev.classed('is-hidden', index <= 0).on('click', null)
	if (index > 0) {
		prev.on('click', () => {
			showModal(list[index - 1], index - 1, count, list, entered)
		})
	}
	// Next button
	const next = d3.select('.js-modal-next')
	next.classed('is-hidden', index >= count - 1).on('click', null)
	if (index < count - 1) {
		next.on('click', () => {
			showModal(list[index + 1], index + 1, count, list, entered)
		})
	}
	// Title
	d3.select('.js-d-title').html(book.title)
	// Genre
	d3.select('.js-d-genre')
		.attr('class', `tag js-d-genre tag-${book.genre}`)
	// Form
	d3.select('.js-d-form')
		.attr('class', 'tag tag-form js-d-form')
	// Modal counter
	d3.select('.js-modal-count').html(
		`${entered ? `Searched by <strong>${entered}</strong>, ` : ''}${index + 1}/${count}`
	)
	const bookInfo = {
		title: book.title,
		author: book.author,
		date: book.date,
		form: book.form,
		genre: book.genre,
		published: book.published,
		pages: book.pages,
		country: book.country,
		series: book.series || 'N/A',
		gender: book.gender,
		favorite: book.favorite || 'N/A',
		year: book.year,
		blurb: book.blurb,
		pretty_date: book.pretty_date,
	}
	_.each(bookInfo, (value, key) => {
		if (value) {
			if (key === 'favorite' || key === 'series') {
				d3.select(`.js-d-${key}-wrapper`).classed('is-hidden', value === 'N/A')
				d3.select(`.js-d-${key}`).attr('class', `tag tag-${key} js-d-${key}`)
			}
			d3.select(`.js-d-${key}`).html(String(value))
		}
	})
}

function runner(books: Book[]) {
	// Shelf setup
	let divW = getShelfWidth()
	const storyH = MAX_BOOK_HEIGHT
	const storyGap = STORY_GAP
	const bookWRange = BOOK_WIDTH_RANGE
	const bookHRange: [number, number] = [60, storyH]
	const shelfSvg = d3.select<SVGSVGElement, unknown>('#shelf-svg')
	const shelfG = shelfSvg.append('g')
	const g = shelfSvg.append('g')
	shelfSvg.attr('width', divW)
	// Book dimensions
	const pages = books.map((book) => book.pages)
	const pageRange = getRange(pages, 100)
	const bookW = d3
		.scaleLinear()
		.domain(pageRange)
		.range(bookWRange)
	const bookH = d3
		.scaleLinear()
		.domain([60, 100])
		.range(bookHRange)
	// Sort options
	let sortOptions: string[] = ['year', 'month']
	// Legend: first level
	function putLegend0(
		text: string | number,
		count: number,
		accW: number,
		accS: number,
		isInitial: boolean,
		gap: number
	) {
		const triangle = 5
		const pX = accW
		const pY = (accS - 1) * (storyH + storyGap)
		const wrapper = g
			.append('g')
			.attr('transform', `translate(${pX}, ${pY})`)
			.attr('class', `js-legends${isInitial ? '' : ' is-hidden'}`)
		wrapper
			.append('rect')
			.attr('x', -gap + 5)
			.attr('y', storyGap)
			.attr('width', gap - 5.5)
			.attr('height', storyH)
			.attr('class', 'legend-0-bg')
		wrapper
			.append('text')
			.attr('x', -gap + 5)
			.attr('y', storyGap - triangle * 3)
			.attr('dy', -4)
			.text(text)
			.attr('class', 'legend-0')
		wrapper
			.append('text')
			.attr('x', -gap + 5 + triangle * 1.2 + 4)
			.attr('y', storyGap - triangle - 2)
			.attr('class', 'legend-0-count')
			.attr('id', `legend-0-${count}`)
		g.append('path')
			.attr(
				'd',
				`M${pX - gap + 5} ${
					pY + storyGap - triangle * 2 - 2
				} l ${triangle * 1.2} ${triangle} l ${
					-triangle * 1.2
				} ${triangle} z`
			)
			.attr(
				'class',
				`legend-arrow js-legends${
					isInitial ? '' : ' is-hidden'
				}`
			)
	}
	// Legend: second level
	function putLegend1(
		text: string | number,
		count: number,
		accW: number,
		accS: number,
		isInitial: boolean,
		gap: number
	) {
		const pX = accW
		const pY = accS * (storyH + storyGap) - storyH
		const wrapper = g
			.append('g')
			.attr('transform', `translate(${pX}, ${pY})`)
			.attr(
				'class',
				`js-legends${isInitial ? '' : ' is-hidden'}`
			)
		wrapper
			.append('rect')
			.attr('x', -gap + 0.5)
			.attr('y', 0)
			.attr('width', gap - 1)
			.attr('height', storyH)
			.attr('class', 'legend-1-bg')
			.attr(
				'stroke-dasharray',
				borderToDashArray(
					{
						width: gap - 1,
						height: storyH,
					},
					{
						top: true,
						right: false,
						bottom: false,
						left: true,
					}
				)
			)
		wrapper
			.append('text')
			.attr('x', -4)
			.attr('y', 4)
			.text(text)
			.attr('transform', 'rotate(90, -4, 4)')
			.attr('class', 'legend-1')
		wrapper
			.append('text')
			.attr('y', 12)
			.attr('x', storyH - 18)
			.attr('class', 'legend-1-percent')
			.attr('id', `legend-1-percent-${count}`)
		wrapper
			.append('text')
			.attr('x', -4)
			.attr('y', storyH)
			.attr('dy', -4)
			.attr('class', 'legend-1-count')
			.attr('id', `legend-1-${count}`)
	}
	// Calculate book positions
	function getDimensions(
		sortedBooks: Book[],
		isInitial: boolean
	) {
		d3.selectAll('.js-legends').remove()
		d3.selectAll('.js-shelves').remove()
		if (sortedBooks.length === 0) {
			return []
		}
		let prevVals = sortOptions.map((option) =>
			getDivider(
				sortedBooks[0],
				option as keyof Book
			)
		)
		const gap0 = DIVIDER_GAP_0
		const gap1 = DIVIDER_GAP_1
		let accW = gap0
		let accS = 1
		const dimensions: {
			x: number
			y: number
			bookId: number
		}[] = []
		let counts = [0, 0, 0]
		let isNewLabels = [true, true]
		let labelCounts = [0, 0]
		const runningCounts = new Map<number, number>()
		_.each(sortedBooks, (d, i) => {
			const w = bookW(d.pages)
			const h = bookH(
				getPublishedHeight(d.published)
			)
			const dividers = sortOptions.map((option) =>
				getDivider(
					d,
					option as keyof Book
				)
			)
			// New first-level division
			if (dividers[0] !== prevVals[0]) {
				accW += gap0
				isNewLabels[0] = true
			} else if (
				dividers.length > 1 &&
				dividers[1] !== prevVals[1]
			) {
				accW += gap1
				isNewLabels[1] = true
			}
			// New shelf row
			if (
				accW + w > divW ||
				dividers[0] !== prevVals[0]
			) {
				accS++

				if (_.isEqual(prevVals, dividers)) {
					accW = 0
				} else if (
					prevVals[0] !== dividers[0]
				) {
					accW = gap0
				} else if (
					prevVals.length > 1 &&
					prevVals[1] !== dividers[1]
				) {
					accW = gap1
				}
			}
			dimensions.push({
				x: accW,
				y:
					(storyH + storyGap) * accS - h,
				bookId: d.id,
			})
			counts[0]++
			counts[1]++
			// First-level legend
			if (isNewLabels[0]) {
				putLegend0(
					dividers[0],
					labelCounts[0],
					accW,
					accS,
					isInitial,
					gap0
				)
				d3
					.select(
						`#legend-0-${labelCounts[0] - 1}`
					)
					.text(counts[0])
				runningCounts.forEach((value, key) => {
					const oldCountElement = d3.select(`#legend-0-${labelCounts[0] - 2}`)
					const percentElement = d3.select(`#legend-1-percent-${key}`)
					if (oldCountElement.empty() || percentElement.empty()) { return }
					const oldCount = Number(oldCountElement.text())
					if (key < counts[2] && counts[2] !== 0 && oldCount > 0) {
						percentElement.text(`${Math.floor((value / oldCount) * 100)}%`)
					} else if (counts[0] > 0) {
						percentElement.text(`${Math.floor((value / counts[0]) * 100)}%`)
					}
				})
				runningCounts.clear()
				counts[2] = labelCounts[1]
				counts[0] = 0
				labelCounts[0]++
			}
			// Second-level legend
			if (
				(isNewLabels[0] ||
					isNewLabels[1]) &&
				sortOptions.length === 2
			) {
				putLegend1(
					dividers[1],
					labelCounts[1],
					accW,
					accS,
					isInitial,
					gap1
				)
				d3
					.select(
						`#legend-1-${
							labelCounts[1] - 1
						}`
					)
					.text(counts[1])
				runningCounts.set(
					labelCounts[1] - 1,
					counts[1]
				)
				counts[1] = 0
				labelCounts[1]++
			}
			// Last book
			if (i === sortedBooks.length - 1) {
				d3
					.select(
						`#legend-0-${labelCounts[0] - 1}`
					)
					.text(counts[0] + 1)
				if (sortOptions.length === 2) {
					d3
						.select(
							`#legend-1-${
								labelCounts[1] - 1
							}`
						)
						.text(counts[1] + 1)
					runningCounts.set(
						labelCounts[1] - 1,
						counts[1]
					)
				}
			}
			accW += w
			prevVals = dividers
			isNewLabels = [false, false]
		})
		// Shelf height
		shelfSvg.attr(
			'height',
			accS * (storyGap + storyH) + storyGap
		)
		// Shelf gaps
		_.each(_.range(accS + 1), (i) => {
			shelfG
				.append('rect')
				.attr('x', 0)
				.attr('y', i * (storyH + storyGap))
				.attr('width', divW)
				.attr('height', storyGap)
				.attr('class', 'shelf-gap js-shelves')
				.attr(
					'stroke-dasharray',
					borderToDashArray(
						{
							width: divW,
							height: storyGap,
						},
						{
							top: true,
							right: false,
							bottom: false,
							left: true,
						}
					)
				)
		})
		return dimensions
	}
	// Move books after sorting
	function resizeShelf() {
		const sortedBooks = _.sortBy(books, sortOptions)
		const dimensions = getDimensions(sortedBooks, false)
		d3
			.selectAll<HTMLSelectElement, unknown>(
				'select'
			)
			.attr('disabled', true)
		_.each(dimensions, (dimension) => {
			const bg = d3.select<SVGGElement, Book>(
				`#book-${dimension.bookId}`
			)
			const currentY =
				bg.attr('prev-y') ??
				String(dimension.y)
			bg
				.attr('prev-y', dimension.y)
				.transition()
				.attr('transform', `translate(${dimension.x}, ${currentY})`)
				.duration(500)
				.on('end', function () {
					d3
						.select(this)
						.transition()
						.duration(500)
						.attr('transform', `translate(${dimension.x}, ${dimension.y})`)
						.on('end', () => {
							d3
								.selectAll('.js-legends')
								.classed('is-hidden', false)
							d3
								.selectAll<HTMLSelectElement, unknown>('select')
								.attr('disabled', null)
						})
				})
		})
	}
	// Initial layout
	const dimensions = getDimensions(books, true)
	// Draw books
	const bookGroups = g
		.selectAll<SVGGElement, Book>('.js-books')
		.data(books)
		.enter()
		.append('g')
		.attr(
			'transform',
			(d, i) =>
				`translate(${dimensions[i].x}, ${dimensions[i].y})`
		)
		.attr('class', 'js-books')
		.attr('id', (d) => `book-${d.id}`)
		.attr('prev-y', (d, i) => dimensions[i].y)
	// Book rectangles
	bookGroups
		.append('rect')
		.attr('x', 0)
		.attr('y', 0)
		.attr('width', (d) => bookW(d.pages))
		.attr(
			'height',
			(d) =>
				bookH(
					getPublishedHeight(
						d.published
					)
				)
		)
		.attr('rx', 1)
		.attr('ry', 1)
		.attr(
			'class',
			(d) =>
				`genre-${d.genre} book-${d.gender}`
		)
	// Favorite marker
	_.each(
		_.filter(books, (d) => Boolean(d.favorite)),
		(d) => {
			d3
				.select(`#book-${d.id}`)
				.append('path')
				.attr('d','M 0 0 V -10 L 6 -4 L 12 -10 V 0 Z')
				.attr('class','favorite')
		}
	)
	// Spine lines
	_.each(books, (book) => {
		const bookGroup = d3.select(`#book-${book.id}`)
		const width = bookW(book.pages)
		bookGroup
			.append('line')
			.style('stroke-width', SPINE_LINE_WIDTH)
			.attr('x1', 0)
			.attr('y1', SPINE_LINE_DISTANCE_FROM_TOP)
			.attr('x2', width)
			.attr('y2', SPINE_LINE_DISTANCE_FROM_TOP)
			.attr('class',`line-gender-${book.gender} line-form-${book.form}`)
		if (book.form === 'Fiction' || book.form === 'Comics' || book.form === 'Poetry') {
			bookGroup
				.append('line')
				.style('stroke-width', SPINE_LINE_WIDTH)
				.attr('x1', 0)
				.attr('y1', SPINE_LINE_DISTANCE_FROM_TOP + SPINE_LINE_GAP)
				.attr('x2', width)
				.attr('y2', SPINE_LINE_DISTANCE_FROM_TOP + SPINE_LINE_GAP)
				.attr('class', `line-gender-${book.gender} line-form-${book.form}`)
		}
		if (book.form === 'Comics') {
			bookGroup
				.append('line')
				.style('stroke-width', SPINE_LINE_WIDTH)
				.attr('x1', 0)
				.attr('y1', SPINE_LINE_DISTANCE_FROM_TOP + SPINE_LINE_GAP * 2)
				.attr('x2', width)
				.attr('y2', SPINE_LINE_DISTANCE_FROM_TOP + SPINE_LINE_GAP * 2)
				.attr('class', `line-gender-${book.gender} line-form-${book.form}`)
		}
	})
	// Genre icons
	_.each(books, (book) => {
		const width = bookW(book.pages)
		const height = bookH(getPublishedHeight(book.published))
		d3
			.select(`#book-${book.id}`)
			.append('image')
			.attr('x', width / 2 - GENRE_MARKER_WIDTH / 2)
			.attr('y', height - GENRE_MARKER_FROM_BOT)
			.attr('width', GENRE_MARKER_WIDTH)
			.attr('height', GENRE_MARKER_HEIGHT)
			.attr('href', `/assets/icons/book-icons/${book.genre}.svg`)
	})
	// Book hover + click
	bookGroups
		.on(
			'mouseover',
			function (_, book) {
				const element = d3.select(this)
				const transform = element.attr('transform')
				element.attr('data-original-transform', transform)
				const match = transform?.match(/translate\(([^,]+),\s*([^)]+)\)/)
				if (match) {
					const x = Number(match[1])
					const y = Number(match[2])
					element.attr('transform', `translate(${x}, ${y - 10})`)
				}
				tippy(
					this as HTMLElement,
					{
						content: `
							<strong>${book.title}</strong>
							<br>
							by ${book.author}
						`,
						allowHTML: true,
						arrow: true,
						duration: 0,
						placement: 'top',
					}
				)
			}
		)
		.on(
			'mouseout',
			function () {
				const element = d3.select(this)
				const original = element.attr('data-original-transform')
				if (original) {
					element.attr('transform', original)
				}
			}
		)
		.on(
			'click',
			function (_, book) {
				showModal(book, books.indexOf(book), books.length, books)
			}
		)
	// Sorting
	const sort0 = document.getElementById('sort-0') as HTMLSelectElement | null
	const sort1 = document.getElementById('sort-1') as HTMLSelectElement | null
	const option1 = document.getElementById('option-1')
	sort0?.addEventListener(
		'change',
		(event) => {
			const option =(event.target as HTMLSelectElement).value
			const allowed = SECOND_SORT_OPTIONS[option as keyof typeof SECOND_SORT_OPTIONS]
			if (!allowed) {
				sortOptions = [option]
				if (option1) {
					option1.classList.add('is-hidden')
				}
			} else {
				sortOptions = [option, allowed[0],]
				if (option1) {
					option1.classList.remove('is-hidden')
				}
				if (sort1) {
					Array.from(sort1.options).forEach(
						(optionElement) => {
							const enabled = allowed.includes(optionElement.value)
							optionElement.disabled = !enabled
						}
					)
					sort1.value = allowed[0]
				}
			}
			resizeShelf()
		}
	)
	sort1?.addEventListener(
		'change',
		(event) => {
			const option =(event.target as HTMLSelectElement).value
			sortOptions[1] = option
			resizeShelf()
		}
	)
	// Modal close
	function closeModal() {
		d3.select('#modal').classed('is-active', false)
	}
	d3.select('#modal-close').on('click', closeModal)
	d3.select('.modal-background').on('click', closeModal)
	// Escape key closes modal
	d3.select(document).on('keydown.modal', (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			closeModal()
		}
	})
	// Resize
	let resizeTimeout: number | undefined
	const handleResize = () => {
		window.clearTimeout(resizeTimeout)
		resizeTimeout = window.setTimeout(() => {
			const newWidth = getShelfWidth()
			if (newWidth !== divW) {
				divW = newWidth
				shelfSvg.attr('width', divW)
				resizeShelf()
			}
		}, 500)
	}
	window.addEventListener('resize', handleResize)
	return () => {
		window.removeEventListener('resize', handleResize)
		window.clearTimeout(resizeTimeout)
		d3.select(document).on('keydown.modal', null)
		d3.select('#modal-close').on('click', null)
		d3.select('.modal-background').on('click', null)
		d3.select('.js-modal-prev').on('click', null)
		d3.select('.js-modal-next').on('click', null)
		d3.select('#shelf-svg').selectAll('*').remove()
		d3.select('#modal').classed('is-active', false)
	}
}

export async function initBooks(): Promise<void> {
	try {
		// Get the books data from the Reading List repo
		// https://github.com/carey-james/Reading-List
		const data_2022 = await d3.dsv('|', 'https://raw.githubusercontent.com/carey-james/Reading-List/main/2022/books.csv')
		const data_2023 = await d3.dsv('|', 'https://raw.githubusercontent.com/carey-james/Reading-List/main/2023/books.csv')
		const data_2024 = await d3.dsv('|', 'https://raw.githubusercontent.com/carey-james/Reading-List/main/2024/books.csv')
		const data_2025 = await d3.dsv('|', 'https://raw.githubusercontent.com/carey-james/Reading-List/main/2025/books.csv')
		const data_2026 = await d3.dsv('|', 'https://raw.githubusercontent.com/carey-james/Reading-List/main/2026/books.csv')
		const raw_data = data_2022.concat(data_2023.concat(data_2024.concat(data_2025.concat(data_2026))))
		const data = _.sortBy(raw_data.map(dateFixer),['year','date'])
		runner(data)
	} catch (error) {
		console.error('Failed to load books:', error)
	}
}