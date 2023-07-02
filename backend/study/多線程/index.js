"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//[23.06.26-1951,]
const express = require("express");
//const { Worker } = require("worker_threads");
const worker_threads_1 = require("worker_threads");
const app = express();
const port = process.env.PORT || 3000;
console.log(worker_threads_1.Worker);
app.get("/non-blocking/", (req, res) => {
    res.status(200).send("This page is non-blocking");
});
function calculateCount() {
    return new Promise((resolve, reject) => {
        let counter = 0;
        for (let i = 0; i < 12000000000; i++) {
            counter++;
        }
        resolve(counter);
    });
}
app.get("/blocking", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const counter = await calculateCount();
    //res.status(200).send(`result is ${counter}`);
    const worker = new worker_threads_1.Worker("D:\\_\\mmf\\PROGRAM\\_Cak\\voca\\backend\\src\\study\\worker.ts");
    worker.on("message", (data) => {
        res.status(200).send(`result is ${data}`);
    });
    worker.on("error", (msg) => {
        res.status(404).send(`An error occurred: ${msg}`);
    });
}));
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
