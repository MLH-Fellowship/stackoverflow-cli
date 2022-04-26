const keypress = require('keypress');
const logUpdate = require('log-update'); // Log by overwriting the previous output in the terminal.
const chalk = require('chalk');
const { info } = require('log-symbols'); // Colored symbols for various log levels
const end = require('./end');
const boxen = require('boxen');

/**
 *
 * @param index - thread number
 * @return string - formated string
 */
// TITLE, QUESTION, ANSWER #n이 아예 안뜰때도 있음 -> 수정 예정
String.prototype.replaceAt = function(start, stop, replacement) {
    return this.substring(0, start) + replacement + this.substring(stop);
}

var func1 = (string) => {
	var startArr=[];
	var j=0; var temp;

	while(1){
		if(string.indexOf('```')<0)
			break;
		temp = string.indexOf('```', startArr[j-1])+3;
		if(temp<3)
			break;
		startArr[j]= temp;
		j++;
	}

	if(startArr.length==0)
		return string;

	var final = []; var j=0;
	for (var i=0; i<startArr.length;i+=2){ // ```내부 문자열 배열에 저장
		final[j] = string.substring(startArr[i],startArr[i+1]-3)
		j++;
	}
	console.log(startArr);
	
	var result = ''; var n = 0; var dif = 0;
	for(var i=0;i<startArr.length;i+=2){
		var dif = result.length - string.length;
		if(i==0){
			result = string.replaceAt(startArr[i]-3, startArr[i+1], `\n${boxen(final[n])}\n`); 
		}else{
			result = result.replaceAt(startArr[i]-3+dif, startArr[i+1]+dif, `\n${boxen(final[n])}\n`); 
		}
		n++;
	}
	return result;
}

var func2 = (string) => {
	var startArr=[];
	var j=0; var temp;

	while(1){
		if(string.indexOf('`')<0)
			break;
		temp = string.indexOf('`', startArr[j-1])+1;
		if(temp<1)
			break;
		startArr[j]= temp;
		j++;
	}

	if(startArr.length==0)
		return string;

	var final = []; var j=0;
	for (var i=0; i<startArr.length;i+=2){
		final[j] = string.substring(startArr[i],startArr[i+1]-1)
		j++;
	}
	
	var result = ''; var n = 0; var dif = 0;
	for(var i=0;i<startArr.length;i+=2){
		var dif = result.length - string.length;
		if(i==0){
			result = string.replaceAt(startArr[i]-1, startArr[i+1], `${chalk.hex(`#969696`).inverse(final[n])}`); 
		}else{
			result = result.replaceAt(startArr[i]-1+dif, startArr[i+1]+dif, `${chalk.hex(`#969696`).inverse(final[n])}`); 
		}
		n++;
	}
	return result;
}

const formatThread = (indexOfThread, indexOfAns, thread, order, sort) => {
	return `${info} ${chalk.dim( // dim - Make the text have lower opacity
		`Thread #${indexOfThread + 1} | Order: ${order} | Sort By: ${sort}`
	)}\n\n${chalk.hex(`#14b514`).bold.inverse(`   TITLE    `)} ${ // inverse- Invert background and foreground colors.
		thread[indexOfThread].title
	}\n\n${chalk.hex(`#14b514`).bold.inverse(`  QUESTION  `)} ${
		thread[indexOfThread].body
	}\n\n${chalk
		.hex(`#14b514`)
		.bold.inverse(`  ANSWER #${indexOfAns + 1}  \n`)} ${
		func2(func1(thread[indexOfThread].answers[indexOfAns]), thread[indexOfThread].answers[indexOfAns])
		//thread[indexOfThread].answers[indexOfAns]
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
	console.log(formatThread(counterOfThread, 0, threads, order, sort));

	// switch the result back and forth from left and right arrow keys and exits with escape key
	keypress(process.stdin);
	process.stdin.on('keypress', function (ch, key) {
		if (key.name === 'right' && counterOfThread !== threads.length - 1) { // Thread가 끝나지 않았다면 ~하는 조건문
			counterOfThread++;
			counterOfAnswer = 0;
			console.log(formatThread(counterOfThread, 0, threads, order, sort));
		}
		if (key.name === 'left' && counterOfThread !== 0) {
			counterOfThread--;
			counterOfAnswer = 0;
			console.log(formatThread(counterOfThread, 0, threads, order, sort));
		}
		if (
			key.name === 'up' &&
			counterOfAnswer !== threads[counterOfThread].answers.length - 1
		) {
			counterOfAnswer++;
			console.log(formatThread(counterOfThread, counterOfAnswer, threads, order, sort));
		}
		if (key.name === 'down' && counterOfAnswer !== 0) {
			counterOfAnswer--;
			console.log(formatThread(counterOfThread, counterOfAnswer, threads, order, sort));
		}
		if (key.name === 'escape') {
			end();
			process.exit();
		}
	});

	process.stdin.setRawMode(true);
	process.stdin.resume();
};
