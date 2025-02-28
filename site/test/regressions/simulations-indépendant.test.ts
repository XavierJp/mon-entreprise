import { DottedName } from 'modele-social'
import { it } from 'vitest'
import independantConfig from '../../source/pages/Simulateurs/configs/indépendant.yaml'
import independentSituations from './simulations-indépendant.yaml'
import { runSimulations } from './utils'

it('calculate simulations-indépendant', () => {
	const objectifs = [
		'dirigeant . rémunération . totale',
		'dirigeant . rémunération . cotisations',
		'dirigeant . rémunération . nette',
		'dirigeant . indépendant . revenu professionnel',
		'impôt . montant',
		'dirigeant . rémunération . nette après impôt',
		'entreprise . charges',
		"entreprise . chiffre d'affaires",
		'dirigeant . indépendant . cotisations et contributions . début activité',
	] as DottedName[]
	runSimulations(independentSituations, objectifs, independantConfig.situation)
})
