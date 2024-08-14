export class StdinReader{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof StdinReader.new>){
		const z = this
		// 啟用標準輸入的可讀流
		process.stdin.resume();
		process.stdin.setEncoding('utf8');
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	//get This(){return StdinReader}
	async Read(){
		// 監聽 'data' 事件以讀取輸入
		return new Promise<string>((res, rej)=>{
			process.stdin.on('data', function (input) {
				res(input as unknown as string)
			});
		})
	}

	async Close(){
		// 監聽 'end' 事件以處理輸入結束
		return new Promise((res, rej)=>{
			process.stdin.on('end', function () {
				res(void 0)
			});
		})
	}
}



