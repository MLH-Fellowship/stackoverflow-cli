const keypress = require('keypress');
const logUpdate = require('log-update');
const chalk = require('chalk');

/**
 *
 * @param index - thread number
 */
const formatThread = (index, thread, order, sort) => {
	return `${chalk.dim(
		`Thread #${index + 1} | Order: ${order} | Sort By: ${sort}`
	)}\n\n${chalk.hex(`#14b514`).bold.inverse(`  TITLE   `)} ${
		thread[index].title
	}\n\n${chalk.hex(`#14b514`).bold.inverse(` QUESTION `)} ${
		thread[index].body
	}\n\n${chalk.dim(`Press ESC to exit.`)}`;
};

/**
 *
 * @param array - That has all the data
 */
const switchResult = (threads, order, sort) => {
	let counter = 0;
	logUpdate(formatThread(counter, threads, order, sort));

	// switch the result back and forth from left and right arrow keys and exits with escape key
	keypress(process.stdin);
	process.stdin.on('keypress', function (ch, key) {
		if (key.name === 'right' && counter !== threads.length - 1) {
			counter++;
			logUpdate(formatThread(counter, threads, order, sort));
		}
		if (key.name === 'left' && counter !== 0) {
			counter--;
			logUpdate(formatThread(counter, threads, order, sort));
		}
		if (key.name === 'escape') {
			process.exit();
		}
	});

	process.stdin.setRawMode(true);
	process.stdin.resume();
};

module.exports = (results, order, sort) => {
	let basicInfoOfQuestions = [];

	results.map(result => {
		const infoObj = {
			title: result.title,
			body: result.body_markdown
		};
		basicInfoOfQuestions.push(infoObj);
	});

	switchResult(basicInfoOfQuestions, order, sort);
};
