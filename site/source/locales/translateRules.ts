import { Rule } from 'publicodes'

type Translation = Record<string, string>
type translateAttribute = (
	prop: string,
	rule: Rule,
	translation: Translation,
	lang: string
) => Rule

/* Traduction */
const translateSuggestion: translateAttribute = (
	prop,
	rule,
	translation,
	lang
) => ({
	...rule,
	suggestions: Object.entries(rule.suggestions!).reduce(
		(acc, [name, value]) => ({
			...acc,
			[translation[`${prop}.${name}.${lang}`]?.replace(/^\[automatic\] /, '')]:
				value,
		}),
		{}
	),
})

export const attributesToTranslate = [
	'titre',
	'description',
	'question',
	'résumé',
	'suggestions',
	'note',
	'identifiant court',
]

const translateProp =
	(lang: string, translation: Translation) => (rule: Rule, prop: string) => {
		if (prop === 'suggestions' && rule?.suggestions) {
			return translateSuggestion(prop, rule, translation, lang)
		}
		let propTrans = translation[prop + '.' + lang]
		propTrans = propTrans?.replace(/^\[automatic\] /, '')

		return propTrans ? { ...rule, [prop]: propTrans } : rule
	}

function translateRule<Names extends string>(
	lang: string,
	translations: { [Name in Names]: Translation },
	name: Names,
	rule: Rule
): Rule {
	const ruleTrans = translations[name]
	if (!ruleTrans) {
		return rule
	}

	return attributesToTranslate.reduce(
		translateProp(lang, ruleTrans),
		rule ?? {}
	)
}

export default function translateRules<Names extends string>(
	lang: string,
	translations: Record<Names, Translation>,
	rules: Record<Names, Rule>
): Record<Names, Rule> {
	const translatedRules = Object.fromEntries(
		Object.entries<Rule>(rules).map(([name, rule]) => [
			name,
			rule && typeof rule === 'object'
				? translateRule(lang, translations, name, rule)
				: rule,
		])
	)

	return translatedRules as Record<Names, Rule>
}
