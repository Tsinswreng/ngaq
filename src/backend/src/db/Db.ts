import { Database } from 'sqlite3';

class Db{

	
}

function tDb(){
	const db = new Database('db.sqlite');
	db.get(
		'SELECT RANDOM() % 100 as result',
		(_, res) => console.log(res)
	);
}

tDb()