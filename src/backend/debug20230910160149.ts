require('module-alias/register');
import moment, { Moment } from "moment";
import SingleWord2 from "@shared/SingleWord2";
import dayjs from 'dayjs'
//import * as inspector from 'node:inspector/promises';
import v8 from 'v8'
import Tempus from "@shared/Tempus";

let t = new Tempus('0001-09-10T16:21:11+08:00')
let t2 = new Tempus('2023-09-10T16:21:16+08:00')

//console.log(Tempus.toRelyObj(t))
//console.log(Tempus.format(t, 'YYMMDD'))

let tempi:Tempus[] = [
	new Tempus(), new Tempus('2023-09-13T18:00:05+08:00'), new Tempus(), new Tempus('2023-09-09T18:00:11+08:00'), new Tempus()
]

let tempi2 = Tempus.getSort(tempi)
console.log(tempi2)
