"use strict";
//[23.06.26-1952,]
//The first line loads the worker_threads module and extracts the parentPort class. The class provides methods you can use to send messages to the main thread. 
const { parentPort } = require("worker_threads");
let counter = 0;
for (let i = 0; i < 20000000000; i++) {
    counter++;
}
parentPort.postMessage(counter);
