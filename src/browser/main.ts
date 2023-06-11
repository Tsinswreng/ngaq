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
let originUi = new OriginUi(vocaB)
let newTestWords:SingleWordB[] = []

let testSingleWord = new SingleWordB()
// 註釋ʴᵗ函數ˇ刪˪
const eng = new VocaB()
const jap = new VocaB()
const lat = new VocaB()
let reviewed = new VocaB()
let 此次所忘 = new VocaB()
//前幾個ˇ皆未用及

let ling = new VocaB()
function main(){

}

function assignWordsFromServ(){
	let gotVal:string = $('input[name="ling"]:checked').val() as string;
	console.log(gotVal)
	ling = new VocaB()
	ling.ling = gotVal;
	let url:string = '/'+gotVal
	fetch(url)
		.then(response=>response.json())
		.then(data=>{
			let dataObj = data
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
				newTestWords.push(temp)
				//newTestWords.push(dataObj[i])
			}
			ling.setAllWords(newTestWords)
			//ling.setWordsToLearn(newTestWords)
			
			vocaB = ling
			console.log(ling)
			originUi = new OriginUi(vocaB)
		})
}
