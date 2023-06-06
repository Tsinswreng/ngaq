"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import express from 'express'
/*TODO:{
  日誌模塊
  數據庫中null作0
}*/
const VocaRaw_1 = require("./VocaRaw"); //導包之後會立即執行某語句?
const moment = require('moment');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const querystring = require('querystring');
/*const eng = new VocaRaw();
eng.dbName = 'voca'
eng.tableName = 'eng'
const jap = new VocaRaw()
jap.dbName = 'voca'
jap.tableName = 'jap'*/
let vocaObjs = VocaRaw_1.default.getObjsByConfig(); //第0個昰英語 第1個是日語
class VocaServer {
    static main() {
        VocaServer.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "*");
            res.header("Access-Control-Allow-Headers", "*");
            next();
        });
        VocaServer.app.use(express.static('browser'));
        VocaServer.app.use(bodyParser.json()); //??{}??
        VocaServer.app.use(express.json({ limit: '65536mb' }));
        VocaServer.app.use(express.urlencoded({ limit: '65536mb', extended: true }));
        //VocaServer.app.use(cors)
        //eng.addSingleWordsToDb()
        VocaServer.app.get('/eng', (req, res) => {
            const db = vocaObjs[0].getDbConnection();
            db.query(`SELECT * FROM ${vocaObjs[0].tableName}`, (error, results, fields) => {
                //console.log('results:'+results)//RowDataPacket
                res.setHeader('content-type', 'text/html;charset=utf-8');
                res.end(JSON.stringify(results)); //TypeError [ERR_INVALID_ARG_TYPE]: The "chunk" argument must be of type string or an instance of Buffer or Uint8Array. Rceived an instance of Array
                //console.log(results['600']['wordShape'])
                //return results//蜮不效
            });
        });
        VocaServer.app.get('/jap', (req, res) => {
            let path = req.path;
            console.log('path:' + path); //t
            const db = vocaObjs[1].getDbConnection();
            db.query(`SELECT * FROM ${vocaObjs[1].tableName}`, (error, results, fields) => {
                //console.log('results:'+results)//RowDataPacket
                res.setHeader('content-type', 'text/html;charset=utf-8');
                res.end(JSON.stringify(results)); //TypeError [ERR_INVALID_ARG_TYPE]: The "chunk" argument must be of type string or an instance of Buffer or Uint8Array. Rceived an instance of Array
                //console.log(results['600']['wordShape'])
                //return results//蜮不效
            });
        });
        VocaServer.app.get('/', (req, res) => {
            console.log(req.ip);
            let path = req.path;
            console.log('path:' + path); //t
            //eng.addSingleWordsToDb()
            res.setHeader('content-type', 'text;charset=utf-8');
            res.sendFile(__dirname + '/browser/Voca.html');
            //res.end('114514')
        });
        VocaServer.app.post('/post', (req, res) => {
            console.log(req.body);
            VocaRaw_1.default.updateDb(req.body);
            //VocaRaw.updateDb(JSON.parse(req.body))
            const timeNow = moment().format(`YYYY.MM.DD-HH:mm:ss`);
            res.send('成功接收到数据' + timeNow);
        });
        VocaServer.app.post('/logIn', (req, res) => {
            console.log(req.body);
            if (req.body.tempPwd === '一') {
                console.log('密碼正確');
            }
            else {
                console.log('密碼錯誤');
            }
        });
        VocaServer.app.listen(1919, () => {
            console.log('at\nhttp://127.0.0.1:1919');
        });
    }
}
VocaServer.app = express();
VocaServer.main();
