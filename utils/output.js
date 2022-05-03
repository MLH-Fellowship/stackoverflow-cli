const chalk = require('chalk');
const boxen = require('boxen');

String.prototype.replaceAt = function(start, stop, replacement) {
    return this.substring(0, start) + replacement + this.substring(stop);
}

var block = (string) => {
	var startArr=[];
	var j=0; var temp;

	while(1){
		if(string.indexOf('```')<0)
			break;
		temp = string.indexOf('```', startArr[j-1])+3;
		if(temp<3)
			break;
		startArr[j]= temp;
		j++;
	}

	if(startArr.length==0)
		return string;

	var final = []; var j=0;
	for (var i=0; i<startArr.length;i+=2){ // ```내부 문자열 배열에 저장
		final[j] = string.substring(startArr[i],startArr[i+1]-3)
		j++;
	}
	
	var result = ''; var n = 0; var dif = 0;
	for(var i=0;i<startArr.length;i+=2){
		var dif = result.length - string.length;
		if(i==0){
			result = string.replaceAt(startArr[i]-3, startArr[i+1], `\n${boxen(final[n])}\n`); 
		}else{
			result = result.replaceAt(startArr[i]-3+dif, startArr[i+1]+dif, `\n${boxen(final[n])}\n`); 
		}
		n++;
	}
	return result;
}

var inline = (string) => {
	var startArr=[];
	var j=0; var temp;

	while(1){
		if(string.indexOf('`')<0)
			break;
		temp = string.indexOf('`', startArr[j-1])+1;
		if(temp<1)
			break;
		startArr[j]= temp;
		j++;
	}

	if(startArr.length==0)
		return string;

	var final = []; var j=0;
	for (var i=0; i<startArr.length;i+=2){
		final[j] = string.substring(startArr[i],startArr[i+1]-1)
		j++;
	}
	
	var result = ''; var n = 0; var dif = 0;
	for(var i=0;i<startArr.length;i+=2){
		var dif = result.length - string.length;
		if(i==0){
			result = string.replaceAt(startArr[i]-1, startArr[i+1], `${chalk.hex(`#969696`).inverse(final[n])}`); 
		}else{
			result = result.replaceAt(startArr[i]-1+dif, startArr[i+1]+dif, `${chalk.hex(`#969696`).inverse(final[n])}`); 
		}
		n++;
	}
	return result;
}

module.exports = (string) => {
    return inline(block(string));
}