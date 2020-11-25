const switchResult = require('./switch');

/**
 *
 * @param thread - stackoverflow thread for answers
 * @return - array of answers of the threads
 */
const threadAns = thread => {
	const temp = [];
	thread.map(ans => {
		temp.push(ans.body_markdown);
	});
	return temp;
};

/**
 *
 * @param results - stackoverflow threads
 * @param order - order of results
 * @param sort - sort of results
 */
module.exports = (results, order, sort) => {
	let basicInfoOfQuestions = [];

	results.map(result => {
		const infoObj = {
			title: result.title,
			body: result.body_markdown,
			answers: threadAns(result.answers)
		};
		basicInfoOfQuestions.push(infoObj);
	});

	switchResult(basicInfoOfQuestions, order, sort);
};
