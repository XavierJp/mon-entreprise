import { Log } from '@/ATInternetTracking/Tracker'
import { ThemeColorsProvider } from '@/components/utils/colors'
import { IsEmbeddedProvider } from '@/components/utils/embeddedContext'
import Emoji from '@/components/utils/Emoji'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { PopoverWithTrigger } from '@/design-system'
import { Article } from '@/design-system/card'
import { Item, Select } from '@/design-system/field/Select'
import { Spacing } from '@/design-system/layout'
import { H1, H2, H3 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import urssafLogo from '@/images/Urssaf.svg'
import { Grid } from '@mui/material'
import { lazy, Suspense, useContext, useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Route } from 'react-router'
import { MemoryRouter } from 'react-router-dom'
import styled from 'styled-components'
import { TrackingContext, TrackPage } from '../../ATInternetTracking'
import { hexToHSL } from '../../hexToHSL'
import Créer from '../Creer'
import Documentation from '../Documentation'
import AssistantDéclarationRevenuIndépendant from '../gerer/declaration-revenu-independants'
import Iframes from '../Iframes'
import Simulateurs from '../Simulateurs'
import useSimulatorsData, { SimulatorData } from '../Simulateurs/metadata'
import './iframe.css'
import cciLogo from './images/cci.png'
import minTraLogo from './images/min-tra.jpg'
import poleEmploiLogo from './images/pole-emploi.png'
import { useSearchParams } from 'react-router-dom-v5-compat'

const LazyColorPicker = lazy(() => import('../Dev/ColorPicker'))

const checkIframe = (obj: SimulatorData[keyof SimulatorData]) =>
	'iframePath' in obj && obj.iframePath && !('private' in obj && obj.private)

const getFromSimu = <S extends SimulatorData, T extends string>(
	obj: S,
	key: T
) =>
	key in obj &&
	obj[key as keyof SimulatorData] &&
	checkIframe(obj[key as keyof SimulatorData])
		? obj[key as keyof SimulatorData]
		: undefined

function IntegrationCustomizer() {
	const simulatorsData = useSimulatorsData()
	const sitePaths = useContext(SitePathsContext)
	const [searchParams, setSearchParams] = useSearchParams()

	const defaultModuleFromUrl = searchParams.get('module') ?? ''

	const [currentModule, setCurrentModule] = useState(
		getFromSimu(simulatorsData, defaultModuleFromUrl)
			? defaultModuleFromUrl
			: 'salarié'
	)

	useEffect(() => {
		setSearchParams({ module: currentModule }, { replace: true })
	}, [currentModule, setSearchParams])

	const [color, setColor] = useState<string | undefined>()

	const currentSimulator = getFromSimu(simulatorsData, currentModule)

	const currentIframePath =
		(currentSimulator &&
			'iframePath' in currentSimulator &&
			currentSimulator.iframePath) ||
		''

	return (
		<>
			<H2>
				<Trans>Personnalisez l'intégration</Trans>
			</H2>

			<Grid container spacing={4} justifyContent={'space-between'}>
				<Grid item xl={4} lg={5} md>
					<H3>
						<Trans i18nKey="pages.développeur.module">Quel module ?</Trans>
					</H3>
					<Select
						label="Assistant ou simulateur"
						onSelectionChange={(val) => setCurrentModule(String(val))}
						selectedKey={currentModule}
					>
						{Object.entries(simulatorsData)
							.map(
								([module, s]) =>
									getFromSimu(simulatorsData, module) && (
										<Item
											key={module}
											textValue={s.shortName ?? ('title' in s ? s.title : '')}
										>
											{s.icône && (
												<>
													<Emoji emoji={s.icône} />
													&nbsp;
												</>
											)}
											{s.shortName ?? ('title' in s ? s.title : '')}
										</Item>
									)
							)
							.filter(((el) => Boolean(el)) as <T>(x: T | undefined) => x is T)}
					</Select>
				</Grid>
				<Grid item xs={'auto'}>
					<H3>
						<Trans i18nKey="pages.développeur.couleur">Quelle couleur ? </Trans>
						<Emoji emoji="🎨" />
					</H3>
					<Suspense fallback={<div>Chargement...</div>}>
						<LazyColorPicker color={color} onChange={setColor} />
					</Suspense>
				</Grid>
				<Grid item xs>
					<H3>
						<Trans i18nKey="pages.développeur.code.titre">
							Code d'intégration
						</Trans>
						<Emoji emoji="🛠" />
					</H3>
					<Body>
						<Trans i18nKey="pages.développeur.code.description">
							Voici le code à copier-coller sur votre site&nbsp;:
						</Trans>
					</Body>
					<IntegrationCode color={color} module={currentIframePath} />
				</Grid>
				<Grid item xs={12}>
					<H3>
						<Trans>Prévisualisation</Trans>
					</H3>

					<PrevisualisationContainer>
						<Previsualisation>
							<TrackingContext.Provider value={DummyTracker}>
								<MemoryRouter
									key={currentModule}
									initialEntries={[`/iframes/${currentIframePath}`]}
								>
									<ThemeColorsProvider
										color={color == null ? color : hexToHSL(color)}
									>
										<IsEmbeddedProvider isEmbeded>
											<Route
												path={sitePaths.simulateurs.index}
												component={Simulateurs}
											/>
											<Route path={sitePaths.créer.index} component={Créer} />
											<Route
												path={sitePaths.gérer.déclarationIndépendant.beta}
												component={AssistantDéclarationRevenuIndépendant}
											/>
											<Route
												path={sitePaths.documentation.index}
												component={Documentation}
											/>
											<Iframes />
										</IsEmbeddedProvider>
									</ThemeColorsProvider>
								</MemoryRouter>
							</TrackingContext.Provider>
						</Previsualisation>
					</PrevisualisationContainer>
				</Grid>
			</Grid>
		</>
	)
}
const DummyTracker = new Log()

const Previsualisation = styled.div`
	background-color: white;
	margin-top: 2rem;
	overflow: hidden;
`
const PrevisualisationContainer = styled.div`
	outline: 2px solid ${({ theme }) => theme.colors.extended.grey[300]};
	outline-offset: 1rem;
`

const Logo = styled.img`
	max-width: 100%;
	max-height: 3rem;
`

export default function Integration() {
	return (
		<>
			<TrackPage name="module_web" />
			<Trans i18nKey="pages.développeur.iframe.intro">
				<div>
					<H1>Intégrez le module Web</H1>
					<Intro>
						Nos simulateurs sont intégrables de manière transparente en ajoutant
						une simple ligne de code à votre page Web.
					</Intro>
					<Body>
						Vous pouvez choisir le simulateur à intégrer et{' '}
						<strong>personnaliser la couleur principale du module</strong> pour
						le fondre dans le thème visuel de votre page.
					</Body>
				</div>
				<IntegrationCustomizer />
				<Spacing lg />
				<Body>
					À noter que si votre site utilise une politique de sécurité de contenu
					via l'en-tête de réponse HTTP <i>Content-Security-Policy</i>, une
					erreur bénigne peut apparaître dans la console. <EnSavoirPlusCSP />
				</Body>
			</Trans>
			<section className="blocks" id="integrations">
				<H2>
					<Trans>Liste des intégrations</Trans>
				</H2>
				<Grid container id="integrationList" spacing={2}>
					<Grid item xs={12} md={6} xl={4}>
						<Article
							title="Urssaf"
							href="https://www.urssaf.fr/portail/home/utile-et-pratique/estimateur-de-cotisations-2019.html?ut=estimateurs"
							ctaLabel="Voir l'intégration"
						>
							<Logo src={urssafLogo} alt="urssaf.fr" />
						</Article>
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<Article
							title="CCI de France"
							href="http://les-aides.fr/embauche"
							ctaLabel="Voir l'intégration"
						>
							<Logo src={cciLogo} alt="Les-aides.fr" />
						</Article>
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<Article
							title="Code du travail numérique"
							href="https://code.travail.gouv.fr/outils/simulateur-embauche"
							ctaLabel="Voir le simulateur"
						>
							<Logo src={minTraLogo} alt="Ministère du travail" />
						</Article>
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<Article
							title="Pôle Emploi"
							href="https://entreprise.pole-emploi.fr/cout-salarie/"
							ctaLabel="Voir le simulateur"
						>
							<Logo src={poleEmploiLogo} alt="Pôle Emploi" />
						</Article>
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<Article
							title="Une idée&nbsp;?"
							href="mailto:contact@mon-entreprise.beta.gouv.fr?subject=Proposition de réutilisation"
							ctaLabel="Contactez-nous"
						>
							Vous avez un projet ou une idée à nous partager?
						</Article>
					</Grid>
				</Grid>
			</section>
		</>
	)
}

function EnSavoirPlusCSP() {
	const { t } = useTranslation()

	return (
		<PopoverWithTrigger
			trigger={(buttonProps) => (
				<Link {...buttonProps}>
					<Trans>En savoir plus</Trans>
				</Link>
			)}
			title={t(
				'pages.développeur.iframe.csp-title',
				'Intégration iframe et politique de sécurité de contenu'
			)}
			small
		>
			<Trans i18nKey="pages.développeur.iframe.csp-1">
				<Body>
					L'erreur ci-dessous qui s'affiche dans la console est liée à la
					communication entre la page parente et l'iframe pour le
					redimensionnement automatique au contenu affiché.
				</Body>
			</Trans>
			<blockquote>
				Failed to execute 'postMessage' on 'DOMWindow': The target origin
				provided ('https://mon-entreprise.urssaf.fr') does not match the
				recipient window's origin
			</blockquote>
			<Body>
				<Trans i18nKey="pages.développeur.iframe.csp-2">
					Vous pouvez la corriger avec la politique suivante :
				</Trans>
			</Body>
			<code>
				script-src 'self' 'unsafe-inline' https://mon-entreprise.urssaf.fr;
				<br />
				img-src 'self' https://mon-entreprise.urssaf.fr;
			</code>
		</PopoverWithTrigger>
	)
}

type IntegrationCodeProps = {
	module?: string
	color?: string
}

function IntegrationCode({
	module = 'simulateur-embauche',
	color,
}: IntegrationCodeProps) {
	const codeRef = useRef<HTMLDivElement>(null)
	const [secondClick, setSecondClick] = useState(false)
	const selectAllCode = () => {
		if (codeRef.current && !secondClick) {
			const range = document.createRange()
			range.selectNode(codeRef.current)
			window.getSelection()?.removeAllRanges()
			window.getSelection()?.addRange(range)
			setSecondClick(true)
		}
		if (secondClick) {
			setSecondClick(false)
		}
	}

	return (
		<code
			ref={codeRef}
			onClick={selectAllCode}
			css={`
				display: block;
				font-size: 80%;
				padding: 1em;
				background: #f8f8f8;
				margin: auto;
				margin-bottom: 1em;
				overflow: auto;
				line-height: 1.6em;
				box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05),
					-1px 1px 1px rgba(0, 0, 0, 0.02);

				em {
					font-weight: 300;
					color: black;
				}
			`}
		>
			<span>{'<'}</span>
			<em>script</em>
			<br />
			<em>data-module</em>="
			<span>{module}</span>"
			{color ? (
				<>
					<br />
					<em>data-couleur</em>="
					<span id="scriptColor">{color}</span>"
				</>
			) : (
				''
			)}
			<br />
			<em>src</em>
			="https://mon-entreprise.urssaf.fr/simulateur-iframe-integration.js"{'>'}
			<span>{'<'}</span>
			<span>/</span>
			<em>script</em>
			<span>{'>'}</span>
		</code>
	)
}
