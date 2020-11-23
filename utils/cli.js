const axios = require('axios');
const ora = require('ora');

// base url
const baseUrl = 'https://api.stackexchange.com/2.2/search/advanced';
// default params
const site = 'stackoverflow';
const filter = '!)rTkraPXy17fPqpx7wE5';

module.exports = async (question, flags) => {
	// spinner
	const spinner = ora();

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

	// making API call
	try {
		console.log('');
		spinner.start();
		const { data } = await axios.get(
			`${baseUrl}?order=${order}&sort=${sort}&q=${question}&site=${site}&filter=${filter}`
		);
		const { items } = data;
		console.log(items[0]);
		spinner.stop();
	} catch (err) {
		spinner.stop();
		console.error(`Error: ${err.response.data.error_message}`);
	}
};
