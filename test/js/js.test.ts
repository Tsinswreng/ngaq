function testTimeout(){
	setTimeout(() => {
		console.log('timeout')
	}, 1);
	let ans = 2
	for(let i = 1; i < 999999999; i++){
		if(i%2===0){
			ans*=i
		}else{
			ans /= i
		}
	}
	console.log(ans) //79266.54589266003
	
	
	ans = 2
	for(let i = 1; i < 999999999; i++){
		if(i%2===0){
			ans*=i
		}else{
			ans /= i
		}
	}
	console.log(ans) //79266.54589266003
	
	
}


function testIterEnum(){
	enum Em{
		a='a'
		,b='b'
		,c='c'
	}

	for(const e in Em){
		console.log(e)
	}
}

async function Main(){
	testIterEnum()
}
Main()