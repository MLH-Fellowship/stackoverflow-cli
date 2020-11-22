// importing packages
const welcome = require('cli-welcome');
const pkgJSON = require('../package.json');

module.exports = () => {
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
};
