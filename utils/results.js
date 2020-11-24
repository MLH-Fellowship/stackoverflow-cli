const keypress = require('keypress');
const logUpdate = require('log-update');
const chalk = require('chalk');

/**
 *
 * @param array - That has all the data
 */
const switchResult = info => {
	let thread = `${chalk.hex(`#14b514`).bold.inverse(`  TITLE   `)} ${
		info[0].title
	}\n\n${chalk.hex(`#14b514`).bold.inverse(` QUESTION `)} ${info[0].body}`;

	logUpdate(thread);

	let counter = 0;

	// switch the result back and forth from left and right arrow keys
	keypress(process.stdin);
	process.stdin.on('keypress', function (ch, key) {
		if (key.name === 'right' && counter !== info.length - 1) {
			counter++;
			thread = `${chalk.hex(`#14b514`).bold.inverse(`  TITLE   `)} ${
				info[counter].title
			}\n\n${chalk.hex(`#14b514`).bold.inverse(` QUESTION `)} ${
				info[counter].body
			}`;
			logUpdate(thread);
		}
		if (key.name === 'left' && counter !== 0) {
			counter--;
			thread = `${chalk.hex(`#14b514`).bold.inverse(`  TITLE   `)} ${
				info[counter].title
			}\n\n${chalk.hex(`#14b514`).bold.inverse(` QUESTION `)} ${
				info[counter].body
			}`;
			logUpdate(thread);
		}
	});

	process.stdin.setRawMode(true);
	process.stdin.resume();
};

module.exports = results => {
	let basicInfoOfQuestions = [];

	results.map(result => {
		const infoObj = {
			title: result.title,
			body: result.body_markdown
		};
		basicInfoOfQuestions.push(infoObj);
	});

	console.log('\n');
	switchResult(basicInfoOfQuestions);
};
