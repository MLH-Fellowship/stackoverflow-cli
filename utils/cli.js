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
			let item = value["body_markdown"];
			data['items'][key]['body_markdown'] = decodeEntities(item).split('\r\n');

			// nullify the body for UX purposes (body prop not used)
			data['items'][key]['body'] = []


			// Uncomment the code below in order to concat the body_markdown array into one string
			//let whole_string = '';
			//for(substring_key in data['items'][key]['body_markdown']){
			//	whole_string += data['items'][key]['body_markdown'][substring_key];
			//}
			//data['items'][key]['body_markdown'] = whole_string
		}
		
		let { items } = data;
		console.log(items);
	} catch (err) {
		console.error(`Error: ${err.response.data.error_message}`);
	}
};
