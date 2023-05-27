//[23.05.23-2118,]
const xml2js = require('xml2js')
const fs = require('fs')
const VocaRaw = require('./VocaRaw')
export default class Config{
	
	private _configFilePath:string = './config.xml'
	private _xmlSrc:string = ''
	private _dbUserName:string|undefined
	private _dbPassword:string|undefined
	
	constructor() {
		this.assign_xmlSrc();
	}
	
	
	get configFilePath(): string {
		return this._configFilePath;
	}
	
	private set configFilePath(value: string) {
		this._configFilePath = value;
	}
	
	get xmlSrc(): string {
		return this._xmlSrc;
	}
	
	private set xmlSrc(value: string) {
		this._xmlSrc = value;
	}
	
	get dbUserName(): string | undefined {
		return this._dbUserName;
	}
	
	set dbUserName(value: string | undefined) {
		this._dbUserName = value;
	}
	
	get dbPassword(): string | undefined {
		return this._dbPassword;
	}
	
	set dbPassword(value: string | undefined) {
		this._dbPassword = value;
	}
	
	public assign_xmlSrc():void{
		this.xmlSrc = fs.readFileSync(this.configFilePath, 'utf-8')
	}
	
	
	
}

function main(){
	//console.log(xml2js)
	let config = new Config();
	
	xml2js.parseString(config.xmlSrc, (err:any, result:any)=>{
		console.dir(result)
	})
}

main()