import { MetadataSrc } from 'pages/Simulateurs/metadata-src'
import { LegalStatus } from '@/selectors/companyStatusSelectors'

export const LANDING_LEGAL_STATUS_LIST: Array<LegalStatus> = [
	'EI',
	'EIRL',
	'EURL',
	'SAS',
	'SARL',
	'SASU',
	'auto-entrepreneur',
	'auto-entrepreneur-EIRL',
	'SA',
]

const rawSitePathsFr = {
	index: '',
	créer: {
		index: '/créer',
		...(Object.fromEntries(
			LANDING_LEGAL_STATUS_LIST.map((statut) => [statut, `/${statut}`])
		) as { [statut in LegalStatus]: string }),
		après: '/après-la-création',
		guideStatut: {
			index: '/statut-juridique',
			liste: '/liste',
			soleProprietorship: '/responsabilité',
			directorStatus: '/dirigeant',
			autoEntrepreneur: '/auto-entrepreneur-ou-entreprise-individuelle',
			multipleAssociates: '/nombre-associés',
			minorityDirector: '/gérant-majoritaire-ou-minoritaire',
		},
	},
	gérer: {
		index: '/gérer',
		entreprise: '/:entreprise',
		embaucher: '/embaucher',
		sécuritéSociale: '/sécurité-sociale',
		'déclaration-charges-sociales-indépendant':
			'/declaration-charges-sociales-independant',
		déclarationIndépendant: {
			index: '/aide-declaration-independants',
			beta: '/beta',
			entreprise: '/beta/entreprise',
			imposition: '/beta/imposition',
			déclaration: '/beta/declaration',
			cotisations: '/beta/cotisations',
		},
		formulaireMobilité: '/demande-mobilité',
	},
	simulateurs: {
		index: '/simulateurs',
		'auto-entrepreneur': '/auto-entrepreneur',
		'entreprise-individuelle': '/entreprise-individuelle',
		eirl: '/eirl',
		sasu: '/sasu',
		eurl: '/eurl',
		indépendant: '/indépendant',
		comparaison: '/comparaison-régimes-sociaux',
		pamc: '/pamc',
		salarié: '/salaire-brut-net',
		'artiste-auteur': '/artiste-auteur',
		'profession-libérale': {
			index: '/profession-liberale',
			médecin: '/medecin',
			pharmacien: '/pharmacien',
			auxiliaire: '/auxiliaire-medical',
			'chirurgien-dentiste': '/chirurgien-dentiste',
			'sage-femme': '/sage-femme',
			avocat: '/avocat',
			'expert-comptable': '/expert-comptable',
		},
		'chômage-partiel': '/chômage-partiel',
		économieCollaborative: {
			index: '/économie-collaborative',
			votreSituation: '/votre-situation',
		},
		is: '/impot-societe',
		dividendes: '/dividendes',
		'exonération-covid': '/exonération-covid',
	},
	nouveautés: '/nouveautés',
	stats: '/stats',
	accessibilité: '/accessibilité',
	budget: '/budget',
	développeur: {
		index: '/développeur',
		iframe: '/iframe',
		library: '/bibliothèque-de-calcul',
		api: '/api',
		spreadsheet: '/tableur',
	},
	documentation: {
		index: '/documentation',
	},
} as const

const rawSitePathsEn = {
	...rawSitePathsFr,
	créer: {
		...rawSitePathsFr.créer,
		index: '/create',
		après: '/after-registration',
		guideStatut: {
			index: '/legal-status',
			liste: '/list',
			soleProprietorship: '/liability',
			directorStatus: '/director',
			autoEntrepreneur: '/auto-entrepreneur',
			multipleAssociates: '/multiple-associates',
			minorityDirector: '/chairman-or-managing-director',
		},
	},
	gérer: {
		index: '/manage',
		entreprise: '/:entreprise',
		embaucher: '/hiring',
		sécuritéSociale: '/social-security',
		'déclaration-charges-sociales-indépendant':
			'/declaration-social-charges-independent',
		déclarationIndépendant: {
			index: '/declaration-aid-independent',
			beta: '/beta',
			imposition: '/beta/taxation',
			entreprise: '/beta/company',
			déclaration: '/beta/declaration',
			cotisations: '/beta/contributions',
		},
		formulaireMobilité: '/posting-demand',
	},
	simulateurs: {
		index: '/calculators',
		indépendant: '/independant',
		'entreprise-individuelle': '/sole-proprietorship',
		'auto-entrepreneur': '/auto-entrepreneur',
		eirl: '/eirl',
		sasu: '/sasu',
		eurl: '/eurl',
		pamc: '/pamc',
		comparaison: '/social-scheme-comparaison',
		salarié: '/salary',
		'artiste-auteur': '/artist-author',
		'chômage-partiel': '/partial-unemployement',
		'profession-libérale': {
			index: '/liberal-profession',
			médecin: '/doctor',
			pharmacien: '/pharmacist',
			auxiliaire: '/medical-auxiliary',
			'chirurgien-dentiste': '/dental-surgeon',
			'sage-femme': '/midwife',
			avocat: '/lawyer',
			'expert-comptable': '/accountant',
		},
		économieCollaborative: {
			index: '/sharing-economy',
			votreSituation: '/your-situation',
		},
		is: '/corporate-tax',
		dividendes: '/dividends',
		'exonération-covid': '/exoneration-covid',
	},
	nouveautés: '/news',
	accessibilité: '/accessibility',
	développeur: {
		...rawSitePathsFr.développeur,
		index: '/developer',
		library: '/library',
		api: '/api',
		spreadsheet: '/spreadsheet',
	},
} as const

/**
 * Le but des types suivants est d'obtenir un typage statique des chaînes de caractères
 * comme "simulateurs.auto-entrepreneur" utilisés comme identifiants des routes (via les pathId dans metadat-src.ts).
 * Cela permet de ne pas avoir de faute dans les clés comme 'aide-embauche' au lieu de 'aides-embauche'
 */

// Transfrom string type like PathToType<'simulateurs.auto-entrepreneur', number>
// into { simulateurs : { auto-entrepreneur: number }}
type PathToType<T extends string, W> = T extends `${infer U}.${infer V}`
	? { [key in U]: V extends string ? PathToType<V, W> : never }
	: { [key in T]: W }

// Transform type A | B into A & B
type UnionToIntersection<T> = (
	T extends unknown ? (x: T) => void : never
) extends (x: infer R) => void
	? R
	: never

// Union of pathId
type PathIds = MetadataSrc[keyof MetadataSrc]['pathId']

type RequiredPath = Required<UnionToIntersection<PathToType<PathIds, string>>>

// If there is a type error here, check rawSitePathsFr object matches the metadata-src.ts pathId
const checkedSitePathsFr: RequiredPath & typeof rawSitePathsFr = rawSitePathsFr

// If there is a type error here, check rawSitePathsEn object matches the metadata-src.ts pathId
const checkedSitePathsEn: RequiredPath & typeof rawSitePathsEn = rawSitePathsEn

type SitePathsFr = typeof checkedSitePathsFr
type SitePathsEn = typeof checkedSitePathsEn

type SitePath = { [key: string]: string | SitePath } & { index: string }

type SitePathBuilt<T extends SitePath, Root extends string = ''> = {
	[K in keyof T]: T[K] extends string
		? K extends 'index'
			? `${Root}${T[K]}`
			: T extends { index: string }
			? `${Root}${T['index']}${T[K]}`
			: `${Root}${T[K]}`
		: SitePathBuilt<
				T[K] extends SitePath ? T[K] : never,
				T extends { index: string } ? `${Root}${T['index']}` : `${Root}`
		  >
}

function constructSitePaths<T extends SitePath>(
	obj: SitePath,
	root = ''
): SitePathBuilt<T> {
	const { index } = obj
	const entries = Object.entries(obj)

	return Object.fromEntries(
		entries.map(([k, value]) => [
			k,
			typeof value === 'string'
				? root + (k === 'index' ? value : index + value)
				: constructSitePaths(value, root + index),
		])
	) as SitePathBuilt<T>
}

export const constructLocalizedSitePath = <T extends 'fr' | 'en'>(
	language: T
) => {
	return constructSitePaths<T extends 'fr' ? SitePathsFr : SitePathsEn>(
		language === 'fr' ? checkedSitePathsFr : checkedSitePathsEn
	)
}

export type SitePathsType = ReturnType<typeof constructLocalizedSitePath>

type Obj = { [k: string]: string | Obj }

const deepReduce = (
	fn: (acc: string[], val: string, key: string) => string[],
	initialValue: string[],
	object: Obj
): string[] =>
	Object.entries(object).reduce(
		(acc, [key, value]) =>
			typeof value === 'object'
				? deepReduce(fn, acc, value)
				: fn(acc, value, key),
		initialValue
	)

type SiteMap = Array<string>

export const generateSiteMap = (sitePaths: SitePathsType): SiteMap =>
	deepReduce(
		(paths: Array<string>, path: string) =>
			/\/:/.test(path) ? paths : [...paths, ...[path]],
		[],
		sitePaths
	)

export const alternateLinks = () => {
	const basePathFr =
		import.meta.env.DEV && typeof window !== 'undefined'
			? `http://${window.location.host}/mon-entreprise`
			: import.meta.env.VITE_FR_BASE_URL ?? ''

	const basePathEn =
		import.meta.env.DEV && typeof window !== 'undefined'
			? `http://${window.location.host}/infrance`
			: import.meta.env.VITE_EN_BASE_URL ?? ''

	const enSiteMap = generateSiteMap(constructLocalizedSitePath('en')).map(
		(path) => basePathEn + path
	)
	const frSiteMap = generateSiteMap(constructLocalizedSitePath('fr')).map(
		(path) => basePathFr + path
	)

	return {
		en: Object.fromEntries(
			enSiteMap.map((key, i) => [key, { href: frSiteMap[i], hrefLang: 'fr' }])
		),
		fr: Object.fromEntries(
			frSiteMap.map((key, i) => [key, { href: enSiteMap[i], hrefLang: 'en' }])
		),
	}
}
