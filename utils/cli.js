const axios = require('axios');

// base url
const baseUrl = 'https://api.stackexchange.com/2.2/search/advanced';

module.exports = async question => {
	// default params
	const order = 'desc';
	const sort = 'relevance';
	const site = 'stackoverflow';
	const filter = '!)rTkraPXy17fPqpx7wE5';

	try {
		const { data } = await axios.get(
			`${baseUrl}?order=${order}&sort=${sort}&q=${question}&site=${site}&filter=${filter}`
		);
		const { items } = data;
		console.log(items);
	} catch (err) {
		console.error(`Error: ${err.response.data.error_message}`);
	}
};
