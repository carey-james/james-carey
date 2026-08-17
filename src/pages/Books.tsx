import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import { initBooks } from '../scripts/books'
import '../styles/main.scss'

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
			<div className='wrapper books-page'>
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
							<svg id='main-legend-svg' width='300'></svg>
							<svg id='genders-legend-svg' width='120'></svg>
							<svg id='genres-legend-svg' width='300'></svg>
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