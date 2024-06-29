class Node{
	
}

class Routes{
	saveWords='/saveWords'
	addWords='/addWords'
	backupAll='/backupAll'
	backup='/backup'
	createTable='/creatTable' // 與舊Manage.ts 一致
	compileTs='/compileTs'
	wordsFromAllTables='/wordsFromAllTables'
	tables='/tables'
	words='/words'
	allTableWords='/allTableWords'
	
}

export const routes = new Routes()



class User{
	protected _userName:str
	get userName(){return this._userName}
	protected set userName(v){this._userName = v}

	constructor(userName:str){
		this._userName = userName
	}
}