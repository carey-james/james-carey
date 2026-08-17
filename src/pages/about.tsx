import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '../styles/main.scss'

function About() {
	return (
		<header>
			<section className='back-link'>				
				<a className='back-link' href='/'>
					<span className='icon major fa-solid fa-arrow-left'></span>
				</a>
			</section>
			<section className='cvhead'>
				<h1>James Carey</h1>
				<br></br>
				<h3>
					<i>
						...works in policy at Yale University and is a lawyer in Washington, D.C. with a J.D. from Georgetown.
					</i>
				</h3>

				<h3>
					<i>
						In his spare time, he writes and reads mysteries, plays board games, or can be found taking long walks and bike rides through DC.
					</i>
				</h3>

				<h3>
					<i>
						This beautiful background is a photo he took during a summer spent as a legal researcher in Athens, Greece.
					</i>
				</h3>
			</section>
		</header>
	)
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<About />
	</StrictMode>
)