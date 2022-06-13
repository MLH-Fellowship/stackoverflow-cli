const keypress = require('keypress');
const logUpdate = require('log-update'); // Log by overwriting the previous output in the terminal.
const chalk = require('chalk');
const boxen = require('boxen');
const { info } = require('log-symbols'); // Colored symbols for various log levels
const end = require('./end');
const output = require('./output');
const save = require('./save');
const browser = require('./browser');
const inquirer = require('inquirer');
let check= "";

/**
 *
 * @param index - thread number
 * @return string - formated string
 */

const formatThread = (indexOfThread, indexOfAns, thread, order, sort) => {
	return `${check}${info} ${chalk.dim( // dim - Make the text have lower opacity
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
	let saveThread;
	let saveAnswer;

	console.log(formatThread(counterOfThread, 0, threads, order, sort))

	// switch the result back and forth from left and right arrow keys and exits with escape key
	keypress(process.stdin);
	process.stdin.on('keypress', function (ch, key) {
		if (key.name === 'right' && counterOfThread !== threads.length - 1) { // Thread가 끝나지 않았다면 ~하는 조건문
			console.clear()
			counterOfThread++;
			counterOfAnswer = 0;
			if(saveThread == counterOfThread && saveAnswer == 0){
				check = "< Selected Question & Answer >\n\n"
				console.log(boxen(formatThread(counterOfThread, 0, threads, order, sort)))
				check=""
			}else
				console.log(formatThread(counterOfThread, 0, threads, order, sort))
		}
		if (key.name === 'left' && counterOfThread !== 0) {
			console.clear()
			counterOfThread--;
			counterOfAnswer = 0;
			if(saveThread == counterOfThread && saveAnswer == 0){
				check = "< Selected Question & Answer >\n\n"
				console.log(boxen(formatThread(counterOfThread, 0, threads, order, sort)))
				check=""
			}else
				console.log(formatThread(counterOfThread, 0, threads, order, sort))
		}
		if (
			key.name === 'up' &&
			counterOfAnswer !== threads[counterOfThread].answers.length - 1
		) {
			console.clear()
			counterOfAnswer++;
			if(saveThread == counterOfThread && saveAnswer == counterOfAnswer){
				check = "< Selected Question & Answer >\n\n"
				console.log(boxen(formatThread(counterOfThread, counterOfAnswer, threads, order, sort)))
				check=""
			}else
				console.log(formatThread(counterOfThread, counterOfAnswer, threads, order, sort))
		}
		if (key.name === 'down' && counterOfAnswer !== 0) {
			console.clear()
			counterOfAnswer--;
			if(saveThread == counterOfThread && saveAnswer == counterOfAnswer){
				check = "< Selected Question & Answer >\n\n"
				console.log(boxen(formatThread(counterOfThread, counterOfAnswer, threads, order, sort)))
				check=""
			}else
				console.log(formatThread(counterOfThread, counterOfAnswer, threads, order, sort))
		}
		if (key.name === 'escape') {
			end();
			process.exit();
		}
		if (key.name === 's'){	//save
			check="< Selected Question & Answer >\n\n"
			saveThread = counterOfThread;
			saveAnswer = counterOfAnswer;
			console.log(boxen(formatThread(saveThread, saveAnswer, threads, order, sort)))
			check=""
			

			var selected_title = threads[saveThread].title;
			var selected_body = threads[saveThread].body;
			var selected_answer = threads[saveThread].answers[saveAnswer];
	
			saveConfirm()	
			.then((flag) => {
				if (flag == true)
				{
					save(selected_title, selected_body, selected_answer);
					// saveThread = null;
					// saveAnswer = null;
					// process.stdin.setRawMode(true);
					// process.stdin.resume();
				}
				else {
					console.clear();
					console.log(formatThread(saveThread, saveAnswer, threads, order, sort));
					saveThread = null;
					saveAnswer = null;
					process.stdin.setRawMode(true);
					process.stdin.resume();
				}
			});
		}
		if (key.name === 'b'){	// browser
			check="< Selected Question & Answer >\n\n"
			saveThread = counterOfThread;
			saveAnswer = counterOfAnswer;
			console.log(boxen(formatThread(saveThread, saveAnswer, threads, order, sort)))
			check=""
			

			var selected_title = threads[saveThread].title;
			var selected_body = threads[saveThread].body;
			var selected_answer = threads[saveThread].answers[saveAnswer];
	
			browserConfirm()	
			.then((flag) => {
				if (flag == true)
				{
					browser();
					// saveThread = null;
					// saveAnswer = null;
					// process.stdin.setRawMode(true);
					// process.stdin.resume();
				}
				else {
					console.clear();
					console.log(formatThread(saveThread, saveAnswer, threads, order, sort));
					saveThread = null;
					saveAnswer = null;
					process.stdin.setRawMode(true);
					process.stdin.resume();
				}
			});
		}
		if(key.name === 'c'){
			console.clear()
		}
	});
	process.stdin.setRawMode(true);
	process.stdin.resume();
};


const saveConfirm = async () => {
	var save_flag;
	await inquirer.prompt([{
		type: "confirm",
		name: "proceed",
		message: "Do you want to save currently selected box?"
	}])
	.then((answers) => {
		if (answers.proceed == true)
		{
			save_flag = true;
		}
		else {
			save_flag = false;
		}
	});
	return save_flag;
};


const browserConfirm = async () => {
	var save_flag;
	await inquirer.prompt([{
		type: "confirm",
		name: "proceed",
		message: "Do you want to open a browser?"
	}])
	.then((answers) => {
		if (answers.proceed == true)
		{
			save_flag = true;
		}
		else {
			save_flag = false;
		}
	});
	return save_flag;
};