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
const decodeEntities = encodedString => { //+) encodedString을 input으로 받음
	const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
	const translate = { // object
		"nbsp": ' ',
		"amp": '&',
		"quot": '"',
		"lt": '<',
		"gt": '>'
	};
	return encodedString
		.replace(translate_re, (match, entity) => {
			//console.log("trans: "+translate[entity])
			return translate[entity];
		})
		.replace(/&#(\d+);/gi, (match, numStr) => {
			const num = parseInt(numStr, 10);
			return String.fromCharCode(num);
		});
	//+) .replace("찾을 문자열", "변경할 문자열")
};

/**
 *
 * @param question - user inputed question
 * @param flags - user provided flags
 */
//+) cli.js를 import하면 해당 모듈을 사용할 수 있음
module.exports = async (question, flags) => {
	// spinner
	const spinner = ora(`Fetching results for your query...`);

	// default params
	//+) indexOf("문자열") -> return 문자열이 첫번째로 나타나는 위치 : 특정 문자 위치 찾는 함수   
	const order = flags.indexOf(`--asc`) >= 0 ? 'asc' : 'desc'; 
	let sort;
	if (flags.indexOf(`--activity`) >= 0) { // --activity라는 옵션이 있으면 ~ 
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
		//+) await: 자바스크립트의 비동기 처리 문법 -> http 통신을 하는 비동기 처리 코드 앞에 붙임
		const { data } = await axios.get( //+) axios.get(url, config): 데이터 조회 -> api 통신
			`${baseUrl}?order=${order}&sort=${sort}&q=${question}&pageSize=${pageSize}&site=${site}&filter=${filter}`
		);
		/*
		for(var key in data){
			console.log(data['items'][key])
		}*/
		//console.log("check" + Object.keys(data['items']))
		spinner.succeed();
		console.log('');
		// decode html characters to regular chars
		for (const [key, value] of Object.entries(data['items'])) {
			let item = value['body_markdown']; 
			//console.log("question : "+item+" //\n")
			data['items'][key]['body_markdown'] = decodeEntities(item).split(
				'\r\n' // 이거로 질문 구분되어 있음
			);
			for(const [ans_key, ans_value] of Object.entries(data['items'][key]['answers'])){
				let ans_item = ans_value['body_markdown'];

				data['items'][key]['answers'][ans_key]['body_markdown'] = decodeEntities(ans_item).split(
					'\r\n'
				);
				data['items'][key]['answers'][ans_key]['body'] = [];
			}
			// body_markdown: ``, &gt이런거 출력되는 질문내용, body: html태그 포함된 질문내용
			// nullify the body for UX purposes (body prop not used)
			data['items'][key]['body'] = [];
		}
		//console.log("question : "+JSON.stringify(data['items'][4]['body_markdown'])+" //\n")
		//console.log("answer : "+JSON.stringify(data['items'][2]['answers'][2]['body_markdown'])+" //\n")
		let { items } = data;
		results(items, order, sort);

	} catch (err) {
		spinner.fail();
		handleError(`Something went wrong.`, err);
	}
};
