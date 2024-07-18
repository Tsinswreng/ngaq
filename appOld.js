//@ts-check
Error.stackTraceLimit = 99
// worked
//const express = require('express')
//console.log(express)
//const sqlite3 = require('sqlite3')
//console.log(sqlite3)
//const VocaServer = require(`./out/backend/VocaServer`)
import VocaServer from './out/backend/VocaServer'
VocaServer.main()
//VocaServer.default.main()
//console.log(VocaServer)
