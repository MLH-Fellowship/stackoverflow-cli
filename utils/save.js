const fs = require('fs');
const path = require('path');
const readline = require('readline');
const inquirer = require('inquirer');
const homedir = require('os').homedir();
var directory;
var content;
var fileName;
const regex = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gim;

const exist = (dir) => { // 폴더 존재 확인 함수
  try {
    fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch (e) {
    return false;
  }
};

const mkdirp = (dir) => { // 경로 생성 함수
  const dirname = path
    .relative('.', path.normalize(dir))
    .split(path.sep)
    .filter(p => !!p);
  dirname.forEach((d, idx) => {
    const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);
    if (!exist(pathBuilder)) {
      fs.mkdirSync(pathBuilder);
    }
  });
};;

const saveAsFile = () => { // 텍스트 파일 생성 함수
  mkdirp(directory);
  const pathToFile = path.join(directory, fileName);
  if (exist(pathToFile)) {
      console.error('이미 해당 파일이 존재합니다');
  } else {
      fs.writeFile(pathToFile, content, function (err) {
          if (err) {
              console.log('에러발생');
              console.dir(err);
              return;
          }
          });
      console.log(pathToFile, '\n저장 완료');
  }
};


module.exports = async (title, body, answer) => {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.clear();
  var date = new Date();
  var year = date.getFullYear();
  var month = ("0" + (1 + date.getMonth())).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  //console.log(title.replace(regex, "").replace(/ /g,"_"));
  // fileName = title+year+month+day+'.txt';
  fileName = year+month+day+'_'+title.replace(regex, "").replace(/ /g,"_")+'.txt';
  content = `
    ################################################## title ####################################################
    ${title}
    \n\n\n\n\n
    ################################################## body #####################################################
    ${body}
    \n\n\n\n\n
    ################################################# answer ####################################################
    ${answer}
    `;
  pathToSave().then(value => {
    directory = value;
    // console.log(typeof(directory));
    // console.log(directory);
    mkdirp(directory);
    
    // console.log(content);
    saveAsFile();
  });
};


const pathToSave = async () => {
	var directory;

  let result = await inquirer.prompt({
    type: "list",
    name: "choice",
    message: "저장할 경로를 선택하세요",
    choices: [
      { name: `(default) ${homedir}\\stackoverflow-cli`, value: homedir+'\\stackoverflow-cli' },
      { name: `현재 경로 ${__dirname}\\stackoverflow-cli`, value: __dirname+'\\stackoverflow-cli' },
      //{ name: "직접 경로 입력", value: 'createPath' }
    ]
  });
  directory = result.choice;
  // if (result.choice === 'createPath') {
  //   result = await inquirer.prompt([
  //     {
  //     //type: "input",
  //     name: "path",
  //     message: "저장할 경로를 입력하세요.",
  //   },
  // ])
  //   .then(answer => {
  //     console.log("입력한 경로: ", answer.path);
  //     directory = answer.path;
  //   });
  // }
  //console.log('return value: ',directory);
  return directory;
};