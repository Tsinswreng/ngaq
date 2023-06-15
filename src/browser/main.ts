/* 
function testPostData(url:any, obj:any){
	
	window.fetch(url, {
		method : 'POST',
		headers: {'Content-Type':'application/json'},
		body: JSON.stringify(obj),
	})
		 .then((response:any)=>{
			 console.log('數據發送成功', response);
		 })
		 .catch((err:any)=>{
			 console.log('出錯', err);
		 })
} */

/* function testPostBtn(){
	testPostData('http://localhost:1919', vocaB.allWords);
} */


let vocaB = new VocaB();
let originUi:OriginUi// = new OriginUi(vocaB)
let wordsToPush:SingleWordB[] = []


// 註釋ʴᵗ函數ˇ刪˪

//前幾個ˇ皆未用及

let lingVocaB:VocaB;
function main(){}


function assignWordsFromServ(){
	let gotVal:string = $('input[name="ling"]:checked').val() as string;
	console.log(gotVal)
	lingVocaB = new VocaB()
	lingVocaB.ling = gotVal;
	let url:string = '/'+gotVal
	fetch(url)
		.then(response=>response.json()) //?[]?
		.then(data=>{
			let dataObj:any[] = data
			for(let i = 0; i < dataObj.length; i++){
				let temp = new SingleWordB();
				temp.ling = gotVal??'';
				temp.id = dataObj[i].id
				temp.wordShape = dataObj[i].wordShape
				temp.fullComments = JSON.parse(dataObj[i].fullComments)//坑:  忘记用JSON.parse 直接把字符串赋给类型为字符串数组的变量 ts编译器居然没发现, , ,
				temp.addedDates = JSON.parse(dataObj[i].addedDates)
				temp.datesFormats = JSON.parse(dataObj[i].datesFormats)
				//temp.addedTimes = dataObj[i].addedTimes
				temp.rmbDates = JSON.parse(dataObj[i].rememberedDates)
				//temp.rmbTimes = dataObj[i].rememberedTimes
				//temp.reviewedTimes = dataObj[i].reviewedTimes
				temp.fgtDates = JSON.parse(dataObj[i].forgottenDates)
				//temp.fgtTimes = dataObj[i].forgottenTimes
				wordsToPush.push(temp) //push之故、可叶多語混學。
				//newTestWords.push(dataObj[i])
			}//endfor
			lingVocaB.setAllWords(wordsToPush)
			//ling.setWordsToLearn(newTestWords)
			
			vocaB = lingVocaB
			console.log(lingVocaB)
			originUi = new OriginUi(vocaB)
		})//endthen
}//endfn

