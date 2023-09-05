
import { Worker } from 'worker_threads';
 
const worker = new Worker('./worker.js', {
  workerData: {
    path: './worker.ts'
  }
});

worker.on('', (data)=>{
	
})