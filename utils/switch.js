const keypress = require('keypress');
const logUpdate = require('log-update'); // Log by overwriting the previous output in the terminal.
const chalk = require('chalk');
const { info } = require('log-symbols'); // Colored symbols for various log levels
const end = require('./end');
const output = require('./output');
const save = require('./save');
//const index = require('../new');

/**
 *
 * @param index - thread number
 * @return string - formated string
 */
// TITLE, QUESTION, ANSWER #n이 아예 안뜰때도 있음 -> 터미널 화면보다 출력되는 값이 더 크면 잘리는 상황 -> console.log는 괜찮고 logUpdate만 그럼

const formatThread = (indexOfThread, indexOfAns, thread, order, sort) => {
	return `${info} ${chalk.dim( // dim - Make the text have lower opacity
		`Thread #${indexOfThread + 1} | Order: ${order} | Sort By: ${sort}`
	)}\n\n${chalk.hex(`#14b514`).bold.inverse(`   TITLE    `)} ${ // inverse- Invert background and foreground colors.
		thread[indexOfThread].title
	}\n\n${chalk.hex(`#14b514`).bold.inverse(`  QUESTION  `)} ${
		output(thread[indexOfThread].body)
	}\n\n${chalk
		.hex(`#14b514`)
		.bold.inverse(`  ANSWER #${indexOfAns + 1}  \n`)} ${
		output(thread[indexOfThread].answers[indexOfAns])
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
	logUpdate(formatThread(counterOfThread, 0, threads, order, sort))
	console.log(formatThread(counterOfThread, 0, threads, order, sort))

	// switch the result back and forth from left and right arrow keys and exits with escape key
	keypress(process.stdin);
	process.stdin.on('keypress', function (ch, key) {
		if (key.name === 'right' && counterOfThread !== threads.length - 1) { // Thread가 끝나지 않았다면 ~하는 조건문
			counterOfThread++;
			counterOfAnswer = 0;
			//logUpdate(formatThread(counterOfThread, 0, threads, order, sort))
			console.log(formatThread(counterOfThread, 0, threads, order, sort))
		}
		if (key.name === 'left' && counterOfThread !== 0) {
			counterOfThread--;
			counterOfAnswer = 0;
			//logUpdate(formatThread(counterOfThread, 0, threads, order, sort))
			console.log(formatThread(counterOfThread, 0, threads, order, sort))
		}
		if (
			key.name === 'up' &&
			counterOfAnswer !== threads[counterOfThread].answers.length - 1
		) {
			counterOfAnswer++;
			//logUpdate(formatThread(counterOfThread, counterOfAnswer, threads, order, sort))
			console.log(formatThread(counterOfThread, counterOfAnswer, threads, order, sort))
		}
		if (key.name === 'down' && counterOfAnswer !== 0) {
			counterOfAnswer--;
			//logUpdate(formatThread(counterOfThread, counterOfAnswer, threads, order, sort))
			console.log(formatThread(counterOfThread, counterOfAnswer, threads, order, sort))
		}
		if (key.name === 'escape') {
			end();
			process.exit();
		}
		if (key.name === 'r'){
			index();
		}
		if (key.name === 's') {
			console.log('현재 스레드 저장을 원하십니까?');
			//console.log(counterOfThread);
			var selected_title = threads[counterOfThread].title;
			//console.log(threads[counterOfThread].title);
			//console.log(selected_title);
			//console.log(counterOfAnswer);
			var selected_body = threads[counterOfThread].body;
			//console.log(threads[counterOfThread].body);
			//console.log(threads[counterOfThread].answers[counterOfAnswer]);
			var selected_answer = threads[counterOfThread].answers[counterOfAnswer];
			save(selected_title, selected_body, selected_answer);
		}
	});
	process.stdin.setRawMode(true);
	process.stdin.resume();
};
