// importing packages
const welcome = require('cli-welcome'); // Welcome header for Node.js CLI software.
const { Input } = require('enquirer'); // Stylish CLI prompts that are user-friendly, intuitive and easy to create.
const meow = require('meow'); // CLI app helper 
const meowHelp = require('cli-meow-help'); // Generate automatically formatted help text for meow CLI helper
const updateNotifier = require('update-notifier'); // Update notifications for your CLI app
const pkgJSON = require('../package.json');
const boxen = require('boxen');

/*
 *
 * get user question
 */
const getInput = async () => {
	const prompt = new Input({
		name: 'question',
		message: 'What is your question? check'
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
	const commands = { // COMMANDS
		none: { desc: `No commands available for ${pkgJSON.name}` }
	};

	const flags = { // OPTIONS
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

	const helpText = meowHelp({ // USAGE
		name: `stack`,
		commands,
		flags
	});

	meow(helpText, { flags });
};

module.exports = async () => {
	cliHelpText() ||
		welcome({
			title: `stackoverflow-cli`,
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
