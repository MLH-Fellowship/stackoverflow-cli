const keypress = require('keypress');
const logUpdate = require('log-update'); // Log by overwriting the previous output in the terminal.
const chalk = require('chalk');
const { info } = require('log-symbols'); // Colored symbols for various log levels
const end = require('./end');

/**
 *
 * @param index - thread number
 * @return string - formated string
 */
// TITLE, QUESTION, ANSWER #n이 아예 안뜰때도 있음 왜?
const formatThread = (indexOfThread, indexOfAns, thread, order, sort) => {
	//console.log("check : "+indexOfThread+", "+indexOfAns+", "+thread[0].answers[2]);
	return `${info} ${chalk.dim( // dim - Make the text have lower opacity
		`Thread #${indexOfThread + 1} | Order: ${order} | Sort By: ${sort}`
	)}\n\n${chalk.hex(`#14b514`).bold.inverse(`   TITLE    `)} ${ // inverse- Invert background and foreground colors.
		thread[indexOfThread].title
	}\n\n${chalk.hex(`#14b514`).bold.inverse(`  QUESTION  `)} ${
		thread[indexOfThread].body
	}\n\n${chalk
		.hex(`#14b514`)
		.bold.inverse(`  ANSWER #${indexOfAns + 1}  \n`)} ${
		thread[indexOfThread].answers[indexOfAns]
	}\n\n${chalk.dim(
		`GUIDE: \n - Press Up Arrow key to see next answer.\n - Press Down Arrow key to see previous answer. \n - Press Right Arrow key to see next thread.\n - Press Left Arrow key to see preview thread.\n - Press ESC to exit the CLI.\n`
	)}`;
};

/**
 *
 * @param threads - That has all the data
 * @param order - order of results
 * @param sort - sort of results
 */
module.exports = (threads, order, sort) => {
	let counterOfThread = 0;
	let counterOfAnswer = 0;
	logUpdate(formatThread(counterOfThread, 0, threads, order, sort));

	// switch the result back and forth from left and right arrow keys and exits with escape key
	keypress(process.stdin);
	process.stdin.on('keypress', function (ch, key) {
		if (key.name === 'right' && counterOfThread !== threads.length - 1) { // Thread가 끝나지 않았다면 ~하는 조건문
			counterOfThread++;
			counterOfAnswer = 0;
			logUpdate(formatThread(counterOfThread, 0, threads, order, sort));
		}
		if (key.name === 'left' && counterOfThread !== 0) {
			counterOfThread--;
			counterOfAnswer = 0;
			logUpdate(formatThread(counterOfThread, 0, threads, order, sort));
		}
		if (
			key.name === 'up' &&
			counterOfAnswer !== threads[counterOfThread].answers.length - 1
		) {
			counterOfAnswer++;
			logUpdate(formatThread(counterOfThread, counterOfAnswer, threads, order, sort));
		}
		if (key.name === 'down' && counterOfAnswer !== 0) {
			counterOfAnswer--;
			logUpdate(formatThread(counterOfThread, counterOfAnswer, threads, order, sort));
		}
		if (key.name === 'escape') {
			end();
			process.exit();
		}
	});

	process.stdin.setRawMode(true);
	process.stdin.resume();
};
