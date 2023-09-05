//[23.06.26-1951,]
const express = require("express");
//const { Worker } = require("worker_threads");
import { Worker } from 'worker_threads';
const app = express();
const port = process.env.PORT || 3000;
console.log(Worker)
app.get("/non-blocking/", (req, res) => {
  res.status(200).send("This page is non-blocking");
});

function calculateCount() {
  return new Promise((resolve, reject) => {
    let counter = 0;
    for (let i = 0; i < 12_000_000_000; i++) {
      counter++;
    }
    resolve(counter);
  });
}

app.get("/blocking", async (req, res) => {
	//const counter = await calculateCount();
	//res.status(200).send(`result is ${counter}`);
	const worker = new Worker("D:\\_\\mmf\\PROGRAM\\_Cak\\voca\\backend\\src\\study\\worker.ts");
	worker.on("message", (data) => {
		res.status(200).send(`result is ${data}`);
	});
	worker.on("error", (msg) => {
		res.status(404).send(`An error occurred: ${msg}`);
	});
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});