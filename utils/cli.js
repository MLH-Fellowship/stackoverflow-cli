const axios = require('axios');

// base url
const baseUrl = 'https://api.stackexchange.com/2.2/search/advanced';
// default params
const order = 'desc';
const sort = 'relevance';
const site = 'stackoverflow';
const filter = '!)rTkraPXy17fPqpx7wE5';

function decodeEntities(encodedString) {
    var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
    var translate = {
        "nbsp":" ",
        "amp" : "&",
        "quot": "\"",
        "lt"  : "<",
        "gt"  : ">"
    };
    return encodedString.replace(translate_re, function(match, entity) {
        return translate[entity];
    }).replace(/&#(\d+);/gi, function(match, numStr) {
        var num = parseInt(numStr, 10);
        return String.fromCharCode(num);
    });
}

module.exports = async question => {
	try {
		let { data } = await axios.get(
			`${baseUrl}?order=${order}&sort=${sort}&q=${question}&site=${site}&filter=${filter}`
		);
		// decode html characters to regular chars
		for (const [key, value] of Object.entries(data['items'])) {
			item = value["body_markdown"];
			data['items'][key]['body_markdown'] = decodeEntities(item);
		}
		
		let { items } = data;
		console.log(items);
	} catch (err) {
		console.error(`Error: ${err.response.data.error_message}`);
	}
};
