import * as sqlite3Temp from 'sqlite3'
const sqlite3 = sqlite3Temp.verbose()

class s20230706200156{
	static main(){

	}
}

s20230706200156.main()

function t20230712160017(){
		
	//const sqlite3 = require("sqlite3").verbose();
	const filepath = "./fish.db"; //此是相對當前終端ᵗ工作目錄、洏非相對當前文件所在ᵗ路徑

	function createDbConnection() {
		const db = new sqlite3.Database(filepath, (error) => {
			if (error) {
			return console.error(error.message);
			}
		});
		console.log("Connection with SQLite has been established");
		return db;
	}

	function createTable(db) {
		db.exec(`
		CREATE TABLE sharks
		(
		ID INTEGER PRIMARY KEY AUTOINCREMENT,
		name   VARCHAR(50) NOT NULL,
		color   VARCHAR(50) NOT NULL,
		weight INTEGER NOT NULL
		);
	`);
	}

	let db = createDbConnection();
	//createTable(db);
}


t20230712160017()
