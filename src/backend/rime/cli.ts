import * as rimeEnv from '@backend/rime/ENV'
import { StrmCntWordImpl } from './impl/StrmCntWordImpl'
const svc = rimeEnv.cntWordSvc

const ldbPath = `D:/Program Files/Rime/User_Data/_test/commitHistory.ldb`

await svc.Add(StrmCntWordImpl.fromPath(ldbPath))
console.log('done')