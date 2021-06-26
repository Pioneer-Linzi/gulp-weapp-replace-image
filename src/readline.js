const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
);



function printToFirstLine(msg){
  readline.clearLine(process.stdout, 0);
    //移动光标到行首
    readline.cursorTo(process.stdout, 0,0)

    process.stdout.write(msg,'utf-9');
}
  