"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//[23.05.23-2118,]
const xml2js = require('xml2js');
const fs = require('fs');
const VocaRaw = require('./VocaRaw');
class Config {
    constructor() {
        this._configFilePath = './config.xml';
        this._xmlSrc = '';
        this.assign_xmlSrc();
    }
    get configFilePath() {
        return this._configFilePath;
    }
    set configFilePath(value) {
        this._configFilePath = value;
    }
    get xmlSrc() {
        return this._xmlSrc;
    }
    set xmlSrc(value) {
        this._xmlSrc = value;
    }
    get dbUserName() {
        return this._dbUserName;
    }
    set dbUserName(value) {
        this._dbUserName = value;
    }
    get dbPassword() {
        return this._dbPassword;
    }
    set dbPassword(value) {
        this._dbPassword = value;
    }
    assign_xmlSrc() {
        this.xmlSrc = fs.readFileSync(this.configFilePath, 'utf-8');
    }
}
exports.default = Config;
function main() {
    //console.log(xml2js)
    let config = new Config();
    xml2js.parseString(config.xmlSrc, (err, result) => {
        console.dir(result);
    });
}
//main()
