function App() {
	return (
		<>
			<section id='header'>
				<header className='major home-header'>
					<h1>James Carey</h1>
					<h3>
						<a href='./about.html'>about me</a>
					</h3>
					<ul className='icons-grid home-icons'>
						<li>
							<a href='./dc_map.html'>
								<span className='icon major fa-solid fa-plate-utensils'></span>
								<h3>DC Food & Drink Recs</h3>
							</a>
						</li>
						<li>
							<a href='./sf_map.html'>
								<span className='icon major fa-solid fa-signs-post'></span>
								<h3>SF Bay Area Recs</h3>
							</a>
						</li>
						<li>
							<a href='./books.html'>
								<span className='icon major fa-solid fa-books'></span>
								<h3>Bookshelf</h3>
							</a>
						</li>
						<li>
							<a href='./games.html'>
								<span className='icon major fa-solid fa-chess'></span>
								<h3>Game Library</h3>
							</a>
						</li>
					</ul>
				</header>
			</section>
		</>
	)
}

export default App