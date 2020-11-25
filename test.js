const cli = require('./utils/cli');

test('CLI function should return undefined', async () => {
	const cliPrompt = await cli('how to sort list in python', []);
	expect(typeof cliPrompt).toEqual('undefined');
});

test('Check user input for empty string without flags', async () => {
	const cliPrompt = await cli('', []);
	expect(cliPrompt).toEqual('You did not enter a question. Please enter one');
});

test('Check user input for empty string with flags', async () => {
	const cliPrompt = await cli('', ['--asc', '--votes']);
	expect(cliPrompt).toEqual('You did not enter a question. Please enter one');
});
