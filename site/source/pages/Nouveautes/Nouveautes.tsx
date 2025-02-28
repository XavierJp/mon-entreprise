import { Grid } from '@mui/material'
import { determinant, hideNewsBanner } from '@/components/layout/NewsBanner'
import MoreInfosOnUs from '@/components/MoreInfosOnUs'
import Emoji from '@/components/utils/Emoji'
import { MarkdownWithAnchorLinks } from '@/components/utils/markdown'
import Meta from '@/components/utils/Meta'
import { ScrollToTop } from '@/components/utils/Scroll'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { Item, Select } from '@/design-system/field/Select'
import { Container } from '@/design-system/layout'
import { H1 } from '@/design-system/typography/heading'
import { GenericButtonOrLinkProps, Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Navigate, useMatch, useNavigate } from 'react-router-dom-v5-compat'
import styled from 'styled-components'
import { TrackPage } from '../../ATInternetTracking'

const slugify = (name: string) => name.toLowerCase().replace(' ', '-')

type ReleasesData = Array<{
	name: string
	description: string
}>

export default function Nouveautés() {
	// The release.json file may be big, we don't want to include it in the main
	// bundle, that's why we only fetch it on this page.
	const [data, setData] = useState<ReleasesData>([])
	useEffect(() => {
		import('@/data/releases.json')
			.then(({ default: data }) => {
				setData(data)
			})
			.catch((err) =>
				// eslint-disable-next-line no-console
				console.error(err)
			)
	}, [])
	const navigate = useNavigate()
	const sitePaths = useContext(SitePathsContext)
	const slug = useMatch(`${sitePaths.nouveautés}/:slug`)?.params?.slug
	useEffect(hideNewsBanner, [])

	const releasesWithId = useMemo(
		() => data && data.map((v, id) => ({ ...v, id })),
		[data]
	)

	if (data.length === 0) {
		return null
	}

	const selectedRelease = data.findIndex(({ name }) => slugify(name) === slug)

	const getPath = (index: number) =>
		`${sitePaths.nouveautés}/${slugify(data[index].name)}`

	if (!slug || selectedRelease === -1) {
		return <Navigate to={getPath(0)} />
	}

	const releaseName = data[selectedRelease].name.toLowerCase()

	return (
		<>
			<TrackPage chapter1="informations" name="nouveautes" />
			<Meta
				page="nouveautés"
				title="Nouveautés"
				description="Nous améliorons le site en continu à partir de vos retours. Découvrez les dernières nouveautés"
			/>
			<ScrollToTop key={selectedRelease} />

			<Container>
				<H1>
					Les nouveautés <Emoji emoji="✨" />
				</H1>
				<Body>
					Nous améliorons le site en continu à partir de{' '}
					<Link to={sitePaths.stats + '#demandes-utilisateurs'}>
						vos retours
					</Link>
					. Découvrez les{' '}
					{selectedRelease === 0
						? 'dernières nouveautés'
						: `nouveautés ${determinant(releaseName)}${releaseName}`}
					&nbsp;:
				</Body>

				<Grid container spacing={2}>
					<Grid item xs={12} sx={{ display: { xs: 'block', lg: 'none' } }}>
						<Select
							label="Date de la newsletter"
							value={selectedRelease}
							items={releasesWithId}
							onSelectionChange={(id) => {
								navigate(getPath(Number(id)))
							}}
						>
							{(release) => (
								<Item textValue={release.name}>{release.name}</Item>
							)}
						</Select>
					</Grid>
					<Grid item lg={3} sx={{ display: { xs: 'none', lg: 'block' } }}>
						<Sidebar>
							{data.map(({ name }, index) => (
								<li key={name}>
									<SidebarLink to={getPath(index)}>{name}</SidebarLink>
								</li>
							))}
						</Sidebar>
					</Grid>
					<Grid item xs={12} lg={9}>
						<MainBlock>
							<MarkdownWithAnchorLinks renderers={{ text: TextRenderer }}>
								{data[selectedRelease].description}
							</MarkdownWithAnchorLinks>

							<NavigationButtons>
								{selectedRelease + 1 < data.length ? (
									<Link to={getPath(selectedRelease + 1)}>
										← {data[selectedRelease + 1].name}
									</Link>
								) : (
									<span /> // For spacing
								)}
								{selectedRelease > 0 && (
									<Link to={getPath(selectedRelease - 1)}>
										{data[selectedRelease - 1].name} →
									</Link>
								)}
							</NavigationButtons>
						</MainBlock>
					</Grid>
				</Grid>
				<MoreInfosOnUs />
			</Container>
		</>
	)
}

const removeGithubIssuesReferences = (text: string) =>
	text.replace(/#[0-9]{1,5}/g, '')

const TextRenderer = ({ children }: { children: string }) => (
	<Emoji emoji={removeGithubIssuesReferences(children)} />
)

const NewsSection = styled.section`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;

	@media (min-width: 1250px) {
		margin-left: -175px;
	}
`

const SidebarLink = styled(Link)<GenericButtonOrLinkProps>`
	display: block;
	border-radius: 0;
	padding: 0.5rem 1rem;
	border-bottom: 1px solid #e6e9ec;
	&:hover {
		background-color: ${({ theme }) => theme.colors.bases.primary[100]};
	}
`

const Sidebar = styled.ul`
	display: flex;
	flex-direction: column;
	position: sticky;
	top: 20px;
	margin-right: 25px;
	padding-left: 0;
	font-size: 0.9em;
	border-right: 1px solid var(--lighterColor);

	li {
		list-style-type: none;
		list-style-position: inside;
		padding: 0;
		margin: 0;
	}
`

const MainBlock = styled.div`
	flex: 1;

	> h1:first-child,
	h2:first-child,
	h3:first-child {
		margin-top: 0px;
	}

	img {
		max-width: 100%;
	}
`

const NavigationButtons = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: 40px;

	a {
		cursor: pointer;
		background: var(--lightestColor);
		padding: 20px 30px;
	}
`
