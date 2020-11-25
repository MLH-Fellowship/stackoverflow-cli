// importing packages
const welcome = require('cli-welcome');
const { Input } = require('enquirer');
const meow = require('meow');
const meowHelp = require('cli-meow-help');
const updateNotifier = require('update-notifier');
const pkgJSON = require('../package.json');

/*
 *
 * get user question
 */
const getInput = async () => {
	const prompt = new Input({
		name: 'question',
		message: 'What is your question?'
	});

	let answer;

	try {
		answer = await prompt.run();
	} catch (error) {
		console.error(error);
	}
	return answer;
};

/**
 *
 *	generates cli help text
 */
const cliHelpText = () => {
	const commands = {
		none: { desc: `No commands available for ${pkgJSON.name}` }
	};

	const flags = {
		asc: {
			desc: `Order the results in ascending order`,
			default: 'desc'
		},
		activity: {
			desc: `Sort the results according to activity date`,
			default: 'relevance'
		},
		votes: {
			desc: `Sort the results according to the number of votes`,
			default: 'relevance'
		},
		creation: {
			desc: `Sort the results according to the creation date`,
			default: 'relevance'
		}
	};

	const helpText = meowHelp({
		name: `stack`,
		commands,
		flags
	});

	meow(helpText, { flags });
};

module.exports = async () => {
	cliHelpText() ||
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

	// Make sure user enters a question that's not an empty string
	let question = '';
	while (question === '') {
		question = await getInput();
	}

	// checks for CLI update
	updateNotifier({ pkg: pkgJSON }).notify();

	return question;
};
