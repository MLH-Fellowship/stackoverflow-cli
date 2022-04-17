#!/usr/bin/env node

/**
 *
 * Author Saad Irfan, Angelina Gasharova, Aneesh Kodali
 * GitHub <https://github.com/MLH-Fellowship/stackoverflow-cli>
 */
const init = require('./utils/init');
const cli = require('./utils/cli');

(module.exports = async () => {
	let flags = [];
	flags = [...process.argv.slice(2)]; //+) slice(start, end): start ~ end 전까지의 복사본을 새로운 배열 객체로 반환
	const question = await init();
	cli(question, flags);
})();
