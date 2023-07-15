
import OriginUi from "../ts/Ui";
import VocaB from "../ts/VocaB";
import { SingleWordB } from "../ts/VocaB";
import $ from 'jquery'

export class MainB{
	vocaB = new VocaB();
	originUi:OriginUi// = new OriginUi(vocaB)
	wordsToPush:SingleWordB[] = []
	lingVocaB:VocaB;
	main(){}
	assignWordsFromServ(){
		let gotVal:string = $('input[name="ling"]:checked').val() as string;
		console.log(gotVal)
		this.lingVocaB = new VocaB()
		this.lingVocaB.ling = gotVal;
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
					this.wordsToPush.push(temp) //push之故、可叶多語混學。
					//newTestWords.push(dataObj[i])
				}//endfor
				this.lingVocaB.setAllWords(this.wordsToPush)
				//ling.setWordsToLearn(newTestWords)
				
				this.vocaB = this.lingVocaB
				console.log(this.lingVocaB)
				this.originUi = new OriginUi(this.vocaB)
			})//endthen
	}//endfn
	
	toggle_curWordInfo() {
		let css = $('#curWordInfo').css('display')
		//console.log(css)
		if(css === 'none'){
			css = "block";
		}else{
			css = "none";
		}
		$('#curWordInfo').css('display' , css)
	}
	toggle_lastWordInfoCtainer(){
		let css = $('#lastWordInfoCtainer').css('display')
		//console.log(css)
		if(css === 'none'){
			css = "block";
		}else{
			css = "none";
		}
		$('#lastWordInfoCtainer').css('display' , css)
	}
	
	
}

const mainB = new MainB()

// if(1 <= 2){
//
// }
//
// let a = 1;
// if(a <= 2){
// 	a = 4
// }
//
// let out = 1;
// if(out <= 1){
// 	out = 1.01;
// }