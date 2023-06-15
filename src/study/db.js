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
const VocaRaw_1 = require("../VocaRaw");
let jap = new VocaRaw_1.default();
function main() {
    jap.tableName = 'jap';
    jap.getAllSingleWordsSync().then((result) => { console.log(1); console.log(result.length); });
}
main();
test();
fore();
fore();
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield jap.getAllSingleWordsSync();
        console.log(2);
        console.log(result.length);
    });
}
function fore() {
    for (let i = 0; i < 99; i++) {
        //console.log(i)
        process.stdout.write(i.toString() + ' ');
    }
    console.log();
}
