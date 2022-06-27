import { PopoverWithTrigger } from '@/design-system'
import { Link } from '@/design-system/typography/link'
import styled from 'styled-components'

const IframeContainer = styled.div`
	margin: 0 -3rem;
`

const Iframe = styled.iframe`
	width: 1px;
	min-width: 100%;
	height: 75vh;
	border: none;
`

const Container = styled.div`
	display: flex;
	justify-content: center;
`

export const JeDonneMonAvis = () => {
	const href =
		'https://jedonnemonavis.numerique.gouv.fr/Demarches/3226?&view-mode=formulaire-avis&nd_mode=en-ligne-enti%C3%A8rement&nd_source=button&key=e62c98db43a483b98032a17ddcc8d279'

	return (
		<Container>
			<PopoverWithTrigger
				trigger={(props) => (
					<Link
						{...props}
						onClick={(e) => {
							if (!e.ctrlKey) {
								e.preventDefault()
							}
						}}
						href={href}
					>
						<img
							src="https://jedonnemonavis.numerique.gouv.fr/static/bouton-blanc.svg"
							alt="Je donne mon avis"
						/>
					</Link>
				)}
			>
				<IframeContainer>
					<Iframe src={href} />
				</IframeContainer>
			</PopoverWithTrigger>
		</Container>
	)
}
