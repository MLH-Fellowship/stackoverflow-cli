const chalk = require('chalk');
const { info } = require('log-symbols');

module.exports = () => {
	console.log('');
	console.log(
		info,
		chalk.hex('#FAD000').inverse(' STAR '),
		chalk.dim('https://github.com/MLH-Fellowship/stackoverflow-cli'),
		'\n'
	);
};
