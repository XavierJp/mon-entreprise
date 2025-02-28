import { execOnFileChange } from './execOnFileChange.js'

console.log('Search for changed file...')

const results = await execOnFileChange({
	basePath: './',
	depsPath: '.deps.json',
	options: [
		{
			paths: [
				'./source/pages/Simulateurs/EconomieCollaborative/activités.yaml',
				'./source/pages/Simulateurs/EconomieCollaborative/activités.en.yaml',
			],
			run: 'yarn build:yaml-to-dts',
		},
	],
})

results
	.filter(<T>(x: null | T): x is T => !!x)
	.forEach(({ fileChanged, run, result }) => {
		console.log('Changed file detected:', fileChanged)
		console.log('Execute:', run, '\n')

		if (result.stdout) {
			console.log(result.stdout)
		}
		if (result.stderr) {
			console.error(result.stderr)
		}
	})
