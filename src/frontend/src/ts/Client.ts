import Ut, { lodashMerge } from "@shared/Ut";
import _ from "lodash";


export type ClientConfig = typeof Client.defaultConfig

export default class Client{

	private static _instance:Client

	public static getInstance(){
		if(Client._instance===void 0){
			Client._instance = new Client()
		}
		return Client._instance
	}

	public static readonly defaultConfig = {
		baseUrl: 'http://127.0.0.1:1919'
	}

	public constructor(config?:Partial<ClientConfig>){
		lodashMerge(this._config, config)
	}

	private _config:ClientConfig = Client.defaultConfig
	;public get config(){return this._config;};
}

