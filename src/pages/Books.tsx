import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import { initBooks } from '../scripts/books'
import '../styles/main.scss'

// Used in the Genre Legend svg
const GENRES = [
	'Biography',
	'Economics',
	'Fantasy',
	'Historical',
	'Horror',
	'Humor',
	'Lit',
	'Science',
	'Music',
	'Mystery',
	'Philosophy',
	'SciFi',
	'Western',
] as const

function Books() {
	useEffect(() => {
		initBooks()
	}, [])

	return (
		<>
			<header>
				<section className='back-link'>				
					<a className='back-link' href='/'>
						<span className='icon major fa-solid fa-arrow-left'></span>
					</a>
				</section>
			</header>
			<section className='cvhead'>
				<header className='major'>
					<h1>Bookshelf</h1>
					<h3>Books read since 2022</h3>
				</header>
			</section>
			<div className='wrapper books'>
				<div className='container'>
					<div className='options'>
						<div className='field'>
							<label className='label'>Organize books by</label>
							<p className='control'>
								<span className='select is-small'>
									<select id='sort-0' defaultValue='year'>
										<option value='year'>Year Read (Old to New)</option>
										<option value='year_desc'>Year Read (New to Old)</option>
										<option disabled>────</option>
										<option value='genre'>Genre</option>
										<option value='gender'>Gender</option>
										<option value='country'>Country</option>
									</select>
								</span>
							</p>
						</div>
						<div className='field' id='option-1'>
							<label className='label'>then</label>
							<p className='control'>
								<span className='select is-small'>
									<select id='sort-1' defaultValue='month'>
										<option disabled value='year'>Year Read (Old to New)</option>
										<option disabled value='year_desc'>Year Read (New to Old)</option>
										<option disabled>────</option>
										<option value='month'>Month</option>
										<option disabled>────</option>
										<option value='genre'>Genre</option>
										<option value='gender'>Gender</option>
										<option value='country'>Country</option>
									</select>
								</span>
							</p>
						</div>
					</div>
					<div id='shelf' className='shelf-wrapper'>
						<svg id='shelf-svg'></svg>
					</div>
				</div>
				<div className='container'>
					<div className='content'>
						<div className='section'>
							<a id='visualization'></a>
							<svg id='main-legend-svg' width='300'>
								<defs>
									<marker id='head' orient='auto' markerWidth='3' markerHeight='4' refX='0.1' refY='2'>
										<path d='M0,0 V4 L2,2 Z' fill='$white' />
									</marker>
								</defs>
								<g>
									<text x='24' y='-32' transform='rotate(90, -4, 4)' className='line-label'>
										Year Published
									</text>
									<path id='arrow-line-year' markerEnd='url(#head)' strokeWidth='2' fill='none' stroke='$white' d='M 40, 90, 40 25,0'/>
									<path id='favorite' className='favorite' d='M 50 20 V 10 L 56 14 L 62 10 V 20 Z'/>
									<text x='72' y='14' className='favorite'>
										Favorite
									</text>
									<rect className='book-template' x='50' y='20' width='25' height='90' rx='1' ry='1'/>
									<line x1='50' y1='30' x2='75' y2='30' className='line-gender-Example'/>
									<path id='arrow-line-pages' markerEnd='url(#head)' strokeWidth='2' fill='none' stroke='$white' d='M50, 120, 75 120,0'/>

									<text x='50' y='126' className='line-label'>
										Pages
									</text>
									<line x1='90' y1='30' x2='115' y2='30' className='line-gender-Example' />
									<text x='34' y='-104' transform='rotate(90, -4, 4)' className='line-label'>
										Non-Fiction
									</text>
									<line x1='130' y1='30' x2='155' y2='30' className='line-gender-Example'/>
									<line x1='130' y1='34' x2='155' y2='34' className='line-gender-Example'/>
									<text x='38' y='-144' transform='rotate(90, -4, 4)' className='line-label'>
										Fiction
									</text>
									<line x1='170' y1='30' x2='195' y2='30' className='line-gender-Example'/>
									<line x1='170' y1='34' x2='195' y2='34' className='line-gender-Example'/>
									<line x1='170' y1='38' x2='195' y2='38' className='line-gender-Example'/>
									<text x='42' y='-184' transform='rotate(90, -4, 4)' className='line-label'>
										Comics
									</text>
									<line x1='210' y1='30' x2='235' y2='30' className='line-gender-Example line-form-dash'/>
									<line x1='210' y1='34' x2='235' y2='34' className='line-gender-Example line-form-dash'/>
									<text x='38' y='-224' transform='rotate(90, -4, 4)' className='line-label'>
										Poetry
									</text>
									<line x1='250' y1='30' x2='275' y2='30' className='line-gender-Example line-form-dash'/>
									<text x='34' y='-264' transform='rotate(90, -4, 4)' className='line-label'>
										Drama
									</text>
								</g>
							</svg>
							<svg id='genders-legend-svg' width='120'>
								<g>
									<line x1='0' y1='30' x2='25' y2='30' className='line-gender-Male'/>
									<text x='34' y='-14' transform='rotate(90, -4, 4)' className='line-label'>
										Male
									</text>
									<line x1='40' y1='30' x2='65' y2='30' className='line-gender-Female'/>
									<text x='34' y='-54' transform='rotate(90, -4, 4)' className='line-label'>
										Female
									</text>
									<line x1='80' y1='30' x2='105'y2='30' className='line-gender-NB'/>
									<text x='34' y='-94' transform='rotate(90, -4, 4)' className='line-label'>
										NB
									</text>
								</g>
							</svg>
							<svg id='genres-legend-svg' width='300'>
								<g>
									{GENRES.map((genre, index) => {
										const x = index * 20
										return (
											<g key={genre}>
												<rect className={`genre-square genre-icon-${genre}`} x={x} y='30' width='16' height='16' rx='1' ry='1'/>
												<image x={x + 2} y='32' width='12' height='12' href={`/icons/book-icons/${genre}.svg`}/>
												<text x='46' y={-10 - x} transform='rotate(90, -4, 4)' className='line-label'>
													{genre}
												</text>
											</g>
										)
									})}
								</g>
							</svg>
						</div>
					</div>
				</div>
			</div>
			{/* Book details modal */}
			<div id='modal' className='modal'>
				<div className='modal-background'></div>
				<div className='modal-card'>
					<header className='modal-card-head'>
						<p className='modal-card-title js-d-title'></p>
						<button
							id='modal-close'
							className='delete'
							aria-label='close'
							type='button'
						></button>
					</header>
					<section className='modal-card-body'>
						<div className='book-details'>
							<p><strong>Author</strong></p><p className='js-d-author'></p>
							<p><strong>Read</strong></p><p className='js-d-pretty_date'></p>
							<p><strong>Published</strong></p><p className='js-d-published'></p>
							<p><strong>Pages</strong></p><p className='js-d-pages'></p>
							<p><strong>Country</strong></p><p className='js-d-country'></p>
							<p><strong>Gender</strong></p><p className='js-d-gender'></p>
							<p><strong>Genre</strong></p><p><span className='tag js-d-genre'></span></p>
							<p><strong>Form</strong></p><p><span className='tag tag-form js-d-form'></span></p>
							<div className='js-d-series-wrapper'>
								<p><strong>Series</strong></p><p className='js-d-series'></p>
							</div>
							<div className='js-d-favorite-wrapper'>
								<p><strong>Favorite</strong></p><p><span className='tag tag-favorite js-d-favorite'></span></p>
							</div>
							<div className='book-blurb'>
								<p><strong>Blurb</strong></p><p className='js-d-blurb'></p>
							</div>
						</div>
					</section>
					<footer className='modal-card-foot'>
						<div className='modal-navigation'>
							<button className='button js-modal-prev' type='button'>
								Previous
							</button>
							<span className='js-modal-count'></span>
							<button className='button js-modal-next' type='button'>
								Next
							</button>
						</div>
					</footer>
				</div>
			</div>
		</>
	)
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Books />
	</StrictMode>
)