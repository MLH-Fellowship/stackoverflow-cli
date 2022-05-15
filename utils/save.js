const fs = require('fs');
const path = require('path');
var directory = '.';
var content;

const exist = (dir) => {
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
  };

  const makeTemplate = () => { // 텍스트 파일 생성 함수
    mkdirp(directory);
    const pathToFile = path.join(directory, `sample.txt`);
    if (exist(pathToFile)) {
        console.error('이미 해당 파일이 존재합니다');
    } else {
        fs.writeFile(pathToFile, content, function (err) {
            if (err) {
                console.log('에러발생');
                console.dir(err);
                return;
            }
            console.log('파일쓰기완료'); 
           });
        console.log(pathToFile, '생성 완료');
    }
  };
  

module.exports = async (title, body, answer) => {
	mkdirp(directory);
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
    console.log(content);
    makeTemplate();
};
