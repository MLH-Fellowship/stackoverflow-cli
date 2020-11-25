const axios = require('axios');
const ora = require('ora');
const results = require('./results');
const handleError = require('node-cli-handle-error');

// base url
const baseUrl = 'https://api.stackexchange.com/2.2/search/advanced';
// default params
const site = 'stackoverflow';
const filter = '!)rTkraPXy17fPqpx7wE5';
const pageSize = 10;

/**
 *
 * @param encodedString - string to decode
 * @return decodedSring
 */
const decodeEntities = encodedString => {
	const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
	const translate = {
		nbsp: ' ',
		amp: '&',
		quot: '"',
		lt: '<',
		gt: '>'
	};
	return encodedString
		.replace(translate_re, (match, entity) => {
			return translate[entity];
		})
		.replace(/&#(\d+);/gi, (match, numStr) => {
			const num = parseInt(numStr, 10);
			return String.fromCharCode(num);
		});
};

/**
 *
 * @param question - user inputed question
 * @param flags - user provided flags
 */
module.exports = async (question, flags) => {
	// spinner
	const spinner = ora(`Fetching results for your query...`);

	// default params
	const order = flags.indexOf(`--asc`) >= 0 ? 'asc' : 'desc';
	let sort;
	if (flags.indexOf(`--activity`) >= 0) {
		sort = `activity`;
	} else if (flags.indexOf(`--votes`) >= 0) {
		sort = `votes`;
	} else if (flags.indexOf(`--creation`) >= 0) {
		sort = `creation`;
	} else {
		sort = `relevance`;
	}

	// check if question is empty string
	if (question === '') {
		return 'You did not enter a question. Please enter one';
	}

	// making API call
	try {
		console.log('');
		spinner.start();
		const { data } = await axios.get(
			`${baseUrl}?order=${order}&sort=${sort}&q=${question}&pageSize=${pageSize}&site=${site}&filter=${filter}`
		);
		spinner.succeed();
		console.log('');
		// decode html characters to regular chars
		for (const [key, value] of Object.entries(data['items'])) {
			let item = value['body_markdown'];
			data['items'][key]['body_markdown'] = decodeEntities(item).split(
				'\r\n'
			);

			// nullify the body for UX purposes (body prop not used)
			data['items'][key]['body'] = [];
		}
		let { items } = data;
		results(items, order, sort);
	} catch (err) {
		spinner.fail();
		handleError(`Something went wrong.`, err);
	}
};
