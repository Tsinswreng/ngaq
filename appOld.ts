//@ts-check
// require('module-alias/register');
// require('tsconfig-paths/register');
// Error.stackTraceLimit = 99
// // worked
// //const express = require('express')
// //console.log(express)
// //const sqlite3 = require('sqlite3')
// //console.log(sqlite3)
// const VocaServer = require(`./src/backend/VocaServer`)
// VocaServer.default.main()
// //console.log(VocaServer)
import "reflect-metadata";
Error.stackTraceLimit = 99
//import VocaServer from './out/backend/VocaServer'
import VocaServer from "./src/backend/VocaServer"
VocaServer.main()
