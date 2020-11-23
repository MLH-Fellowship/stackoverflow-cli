// importing packages
const welcome = require('cli-welcome');
const { Input } = require('enquirer');
const pkgJSON = require('../package.json');

const prompt = new Input({
	name: 'question',
	message: 'What is your question?'
});

module.exports = async () => {
	welcome({
		title: pkgJSON.name,
		tagLine: `by ${pkgJSON.author.name}`,
		description: `${pkgJSON.description}`,
		bgColor: `#f48024`,
		color: `#FFFFFF`,
		bold: true,
		clear: true,
		version: `${pkgJSON.version}`
	});

	let answer;

	try {
		answer = await prompt.run();
	} catch (error) {
		console.error(error);
	}
	return answer;
};
