const axios = require('axios');
const ora = require('ora');

// base url
const baseUrl = 'https://api.stackexchange.com/2.2/search/advanced';
// default params
const order = 'desc';
const sort = 'relevance';
const site = 'stackoverflow';
const filter = '!)rTkraPXy17fPqpx7wE5';

module.exports = async question => {
	// spinner
	const spinner = ora();

	// making API call
	try {
		console.log('');
		spinner.start();
		const { data } = await axios.get(
			`${baseUrl}?order=${order}&sort=${sort}&q=${question}&site=${site}&filter=${filter}`
		);
		const { items } = data;
		console.log(items);
		spinner.stop();
	} catch (err) {
		spinner.stop();
		console.error(`Error: ${err.response.data.error_message}`);
	}
};
