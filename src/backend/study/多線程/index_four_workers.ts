const express = require("express");
//const { Worker } = require("worker_threads");
import { Worker } from 'worker_threads';

const app = express();
const port = process.env.PORT || 3000;
const THREAD_COUNT = 4;

app.get("/non-blocking/", (req, res) => {
	res.status(200).send("This page is non-blocking");
});

function createWorker() {
	return new Promise(function (resolve, reject) {
//four_workers.ts的絕對路徑在"D:/_/mmf/PROGRAM/_Cak/voca/backend/src/study/多線程/four_workers.ts"
//當前文件的絕對路徑在D:\_\mmf\PROGRAM\_Cak\voca\backend\src\study\多線程\index_four_workers.ts
		const worker = new Worker("D:/_/mmf/PROGRAM/_Cak/voca/backend/src/study/多線程/four_workers.js", {  //爲什麼在這裏寫 "./four_workers.ts" 則找不到模塊?Error: Cannot find module 'D:\_\mmf\PROGRAM\_Cak\voca\four_workers.ts'
//new Worker 中的路徑是相对于当前执行 Node.js 进程的工作目录来解析的(即命令行中cd到的目錄)、而非ʃˋ調用之ʃ在。
			workerData: { thread_count: THREAD_COUNT },
		});
		worker.on("message", (data) => {
			resolve(data);
		});
		worker.on("error", (msg) => {
			reject(`An error ocurred: ${msg}`);
		});
	});
}

app.get("/blocking", async (req, res) => {
	const workerPromises:Promise<any>[] = [];
	for (let i = 0; i < THREAD_COUNT; i++) {
		workerPromises.push(createWorker());
	}
	const thread_results = await Promise.all(workerPromises).catch((err)=>{
		console.error(err)
	});
	const total =
		thread_results[0] +
		thread_results[1] +
		thread_results[2] +
		thread_results[3];
	res.status(200).send(`result is ${total}`);
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});