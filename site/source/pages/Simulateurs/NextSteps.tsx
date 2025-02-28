import { Grid } from '@mui/material'
import { Condition } from '@/components/EngineValue'
import { useEngine } from '@/components/utils/EngineContext'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { H2 } from '@/design-system/typography/heading'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { FAQAutoEntrepreneurArticle } from '@/pages/Creer/CreationChecklist'
import { GuideURSSAFCard } from '@/pages/Simulateurs/cards/GuideURSSAFCard'
import { SimulatorRessourceCard } from '@/pages/Simulateurs/cards/SimulatorRessourceCard'
import { IframeIntegrationCard } from '@/pages/Simulateurs/cards/IframeIntegrationCard'
import { ExtractFromSimuData } from '@/pages/Simulateurs/metadata'

interface NextStepsProps {
	iframePath: ExtractFromSimuData<'iframePath'>
	nextSteps: ExtractFromSimuData<'nextSteps'>
}

export function NextSteps({ iframePath, nextSteps }: NextStepsProps) {
	const sitePaths = useContext(SitePathsContext)
	const { language } = useTranslation().i18n
	const engine = useEngine()

	const guideUrssaf = guidesUrssaf.find(
		({ associatedRule }) => engine.evaluate(associatedRule).nodeValue
	)

	if (!iframePath && !nextSteps && !guideUrssaf) {
		return null
	}

	return (
		<section className="print-hidden">
			<H2>
				<Trans>Ressources utiles</Trans>
			</H2>
			<Grid container spacing={3}>
				<Condition expression="dirigeant . auto-entrepreneur">
					<Grid item xs={12} sm={6} lg={4}>
						<FAQAutoEntrepreneurArticle />
					</Grid>
				</Condition>

				{guideUrssaf && language === 'fr' && (
					<Grid item xs={12} sm={6} lg={4}>
						<GuideURSSAFCard guideUrssaf={guideUrssaf} />
					</Grid>
				)}

				{nextSteps?.map((simulatorId) => (
					<Grid item xs={12} sm={6} lg={4} key={simulatorId}>
						<SimulatorRessourceCard simulatorId={simulatorId} />
					</Grid>
				))}

				{iframePath && (
					<Grid item xs={12} sm={6} lg={4}>
						<IframeIntegrationCard
							iframePath={iframePath}
							sitePaths={sitePaths}
						/>
					</Grid>
				)}
			</Grid>
		</section>
	)
}

const guidesUrssaf = [
	{
		url: 'https://www.urssaf.fr/portail/files/live/sites/urssaf/files/documents/PAM/Diaporama_Medecins.pdf',
		associatedRule: "dirigeant . indépendant . PL . métier = 'santé . médecin'",
		title: 'Guide Urssaf pour les médecins libéraux',
	},
	{
		url: 'https://www.urssaf.fr/portail/files/live/sites/urssaf/files/documents/Diaporama_PL_statuts_hors_AE_et_PAM.pdf',
		associatedRule: 'entreprise . activité . libérale réglementée',
		title: 'Guide Urssaf pour les professions libérales réglementées',
	},
	{
		url: 'https://www.autoentrepreneur.urssaf.fr/portail/files/Guides/Metropole/UrssafAutoEntrepreneurMetro.pdf',
		associatedRule: 'dirigeant . auto-entrepreneur',
		title: 'Guide Urssaf pour les auto-entrepreneurs',
	},
	{
		url: 'http://www.secu-artistes-auteurs.fr/sites/default/files/pdf/Guide%20pratique%20de%20d%C3%A9but%20d%27activit%C3%A9.pdf',
		associatedRule: "dirigeant = 'artiste-auteur'",
		title: 'Guide Urssaf pour les artistes-auteurs',
	},
	{
		url: 'https://www.urssaf.fr/portail/files/live/sites/urssaf/files/documents/Diaporama_TI_statuts_hors_AE.pdf',
		associatedRule: 'dirigeant',
		title: 'Guide Urssaf pour les indépendants',
	},
]
