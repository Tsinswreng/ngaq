"use strict";
/**
 * [23.07.01-2123,]
 */
class Console {
}
console.log(114514);
const { spawn } = require('child_process');
// 启动另一个Node.js程序的文件路径和参数
const filePath = 'D:/_/mmf/PROGRAM/_Cak/voca/backend/src/debug.js';
const args = ['arg1', 'arg2'];
// 使用spawn方法启动新的终端或子进程
const childProcess = spawn('node', [filePath, ...args], {
    detached: true,
    stdio: 'ignore'
});
// 可选：监听子进程的关闭事件
childProcess.on('close', (code) => {
    console.log(`另一个程序退出，退出码: ${code}`);
});
// 可选：如果不需要等待子进程关闭，可以将子进程分离
childProcess.unref();
