import {RegexReplacePair} from 'Type';

/*
留: t,l,n,k,零,w,p,g,m,d,lh,
ʰr	hr
rh(清r)	hr
n̥	tʰ
ɫ͂	邪 後不帶r
l̃	亦是邪母
ʱɫ	船 後不帶r
ʰɫa	車
kɫ	車, >中古見
ŋɫ	午
ʔɫ	縊	併入 ʔ
xɫ	>中古曉
x	>中古曉
完全不對立者: ŋɫ ʔɫ w͂ gɫ kʰɫ h
前有w則後無-m、炎 除外
w不接o、幾不接u

後只接三等無r: l̃   { k: 'w͂', v: [ 'i', 'e' ] },  { k: 'l̃', v: [ 'ə', 'a', 'o' ] }, { k: 'ʰɫ', v: [ 'ə', 'a', 'o', 'u' ] }, { k: 'ʱɫ', v: [ 'ə', 'a', 'o', 'i', 'u' ] },
後不接r: kʰɫ ŋ̊ kɫ gɫ ŋw ŋɫ xɫ r͂ r̥ ɫ̥
後只接非三等無r  { k: 'ʔɫ', v: [ 'ˁo', 'ˁi' ] },    
後只接三等有r   { k: 'ʰ', v: [ 'rə', 'ra', 're', 'ri', 'ru', 'ro' ] },


*/

let replacePair:RegexReplacePair[] = [
	{regex:/t\-ŋ/gm, replacement:'tʰ'},
	{regex:/k\.r/gm, replacement:'r'},
	{regex:/θ/gm, replacement:'ts'},
	{regex:/wks/gm, replacement:'wk'},
	{regex:/sl/gm, replacement:'z'},
	{regex:/ml/gm, replacement:'ʑ'},
	{regex:/hl/gm, replacement:';'},
	{regex:/kʰl/gm, replacement:';'},
	{regex:/kl/gm, replacement:';'},
	{regex:/bl/gm, replacement:';'},
	{regex:/st/gm, replacement:';'},
	{regex:/sn/gm, replacement:';'},
	{regex:/sŋ/gm, replacement:'s'},
	{regex:/sd/gm, replacement:'z'},
	{regex:/ɫ̥/gm, replacement:';'}, //多
	{regex:/ʱɫ/gm, replacement:'ʑ'},
	{regex:/ɫ͂/gm, replacement:'z'},
	{regex:/l̃/gm, replacement:'z'},
	
	{regex:/tʃʰ/gm, replacement:'tsʰ'},
	{regex:/tʃ/gm, replacement:'ts'},
	{regex:/dʒ/gm, replacement:'dz'},

	{regex:/w͂/gm, replacement:';'},
	{regex:/w̥/gm, replacement:';'}, //多
	{regex:/kʰɫ/gm, replacement:';'},
	{regex:/ŋ̊/gm, replacement:';'},
	{regex:/kɫ/gm, replacement:';'},
	{regex:/ɡɫ/gm, replacement:';'},
	{regex:/ʰɫ/gm, replacement:';'},

	
	{regex:/ŋɫ/gm, replacement:';'},
	{regex:/xɫ/gm, replacement:';'},
	{regex:/r͂/gm, replacement:';'},
	{regex:/r̥/gm, replacement:';'},
	{regex:/ʔɫ/gm, replacement:';'},
	
	{regex:/ɫ/gm, replacement:'j'},
	{regex:/ɬ/gm, replacement:';'},

	{regex:/^ʰ/gm, replacement:'h'},
	{regex:/x/gm, replacement:'h'},
	{regex:/(kʰ|k|ɡ|ŋ|ʔ)w/gm, replacement:'$1ʷ'},
	{regex:/m̥/gm, replacement:','},
	{regex:/n̥/gm, replacement:'.'},
	

]

export=replacePair
