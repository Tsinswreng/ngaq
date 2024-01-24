import 'tsconfig-paths/register'
import * as fse from 'fs-extra'
import * as ut from '@shared/Ut'

const cwd = process.cwd()
const shared = cwd+'/src/shared'
const frontend_shared = cwd+'/src/frontend/shared'

fse.copySync(shared, frontend_shared, {overwrite:true})
console.log(`${shared}\nto\n${frontend_shared}`)