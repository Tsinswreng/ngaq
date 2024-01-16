//	\{regex:/(.*?)/gm, replacement:'(.*?)'\},?	- xform/$1/$2/
import { RegexReplacePair } from "@shared/Ut"
export let replacePair:RegexReplacePair[] = [
	//{regex:/waj/gm, replacement:'test'},


	{regex:/g/gm, replacement:'ɡ'},
	{regex:/ˤ/gm, replacement:'ˁ'},
	//{regex:/jʷ/gm, replacement:'w'},
	{regex:/ʷʰ/gm, replacement:'ʰʷ'},

	{regex:/rr/gm, replacement:'r'},
	{regex:/dz/gm, replacement:'從'},
	{regex:/ml/gm, replacement:'ʑ'},
	//令邪接無r三等、船接帶r三等
	{regex:/ʑ/gm, replacement:'ʑr'},
	{regex:/從/gm, replacement:'dz'},

	//以下ˇ當 獨ᵈ先処。否則三等無r之a轉A後恐混。
	{regex:/rˁ(æ|A)/gm, replacement:'腹一.腹二'},
	{regex:/ˁ(æ|A)/gm, replacement:'腹一,腹二'},
	{regex:/r(æ|A)/gm, replacement:'腹一H腹二'},
	{regex:/ˡa/gm, replacement:'腹一N腹二'},
	{regex:/(æ|A)/gm, replacement:'腹一N腹二'},


	{regex:/rˁa/gm, replacement:'腹一Y腹二'},
	{regex:/rˁe/gm, replacement:'腹一P腹二'},
	{regex:/rˁi/gm, replacement:'腹一I腹二'},
	{regex:/rˁo/gm, replacement:'腹一O腹二'},
	{regex:/rˁu/gm, replacement:'腹一U腹二'},
	{regex:/rˁə/gm, replacement:'腹一M腹二'},
	

	{regex:/ˁa/gm, replacement:'腹一Z腹二'},
	{regex:/ˁe/gm, replacement:'腹一X腹二'},
	{regex:/ˁi/gm, replacement:'腹一C腹二'},
	{regex:/ˁo/gm, replacement:'腹一V腹二'},
	{regex:/ˁu/gm, replacement:'腹一B腹二'},
	{regex:/ˁə/gm, replacement:'腹一L腹二'},
	

	{regex:/ra/gm, replacement:'腹一Q腹二'},
	{regex:/re/gm, replacement:'腹一W腹二'},
	{regex:/ri/gm, replacement:'腹一E腹二'},
	{regex:/ro/gm, replacement:'腹一R腹二'},
	{regex:/ru/gm, replacement:'腹一T腹二'},
	{regex:/rə/gm, replacement:'腹一K腹二'},
	
	

	//{regex:/(ɔ|O)/gm, replacement:'腹一,腹二'},
	//{regex:/r(ɔ|O)/gm, replacement:'腹一.腹二'},

	

	{regex:/a/gm, replacement:'腹一A腹二'},
	{regex:/e/gm, replacement:'腹一S腹二'},
	{regex:/i/gm, replacement:'腹一D腹二'},
	{regex:/o/gm, replacement:'腹一F腹二'},
	{regex:/u/gm, replacement:'腹一G腹二'},
	{regex:/ə/gm, replacement:'腹一J腹二'},
	

	{regex:/^(.*?)腹一/gm, replacement:'首一$1首二腹一'},

	//{regex:/首一(p|pʰ|m)ʷ首二/gm, replacement:'首一$1首二'},
	//{regex:/首一(ts|tsʰ|dz)ʷ首二/gm, replacement:'首一$1首二'},
	{regex:/首一(kʰ|k|ɡ|ŋ|ʔ|h|s)ʷ首二/gm, replacement:'首一$1合首二'},
	{regex:/首一(.*)ʷ首二/gm, replacement:'首一$1首二'},
	{regex:/首一(.*)合首二/gm, replacement:'首一$1ʷ首二'},
	

	//{regex:/首一ŋʷ首二/gm, replacement:'首一;首二'},
	//{regex:/首一(jʷ)首二/gm, replacement:'首一W首二'},
	

	{regex:/首一kw首二/gm, replacement:'首一kʷ首二'},



	{regex:/腹二(ps)/gm, replacement:'腹二尾一B尾二'},
	{regex:/腹二(ts)/gm, replacement:'腹二尾一I尾二'},
	{regex:/腹二(ks)/gm, replacement:'腹二尾一G尾二'},

	{regex:/腹二(ŋs)/gm, replacement:'腹二尾一X尾二'},
	{regex:/腹二(ŋʔ)/gm, replacement:'腹二尾一W尾二'},
	{regex:/腹二(ŋ)/gm, replacement:'腹二尾一S尾二'},
	{regex:/腹二(k)/gm, replacement:'腹二尾一K尾二'},

	{regex:/腹二(ns)/gm, replacement:'腹二尾一C尾二'},
	{regex:/腹二(nʔ)/gm, replacement:'腹二尾一E尾二'},
	{regex:/腹二(n)/gm, replacement:'腹二尾一D尾二'},
	{regex:/腹二(t)/gm, replacement:'腹二尾一T尾二'},

	{regex:/腹二(ms)/gm, replacement:'腹二尾一V尾二'},
	{regex:/腹二(mʔ)/gm, replacement:'腹二尾一R尾二'},
	{regex:/腹二(m)/gm, replacement:'腹二尾一F尾二'},
	{regex:/腹二(p)/gm, replacement:'腹二尾一P尾二'},

	{regex:/腹二(js)/gm, replacement:'腹二尾一N尾二'},
	{regex:/腹二(jʔ)/gm, replacement:'腹二尾一Y尾二'},
	{regex:/腹二(j)/gm, replacement:'腹二尾一H尾二'},

	{regex:/腹二(wks)/gm, replacement:'腹二尾一,尾二'},
	{regex:/腹二(wk)/gm, replacement:'腹二尾一,尾二'},

	{regex:/腹二(ws)/gm, replacement:'腹二尾一M尾二'},
	{regex:/腹二(wʔ)/gm, replacement:'腹二尾一U尾二'},
	{regex:/腹二(w)/gm, replacement:'腹二尾一J尾二'},

	{regex:/腹二(ls)/gm, replacement:'腹二尾一.尾二'},
	{regex:/腹二(lʔ)/gm, replacement:'腹二尾一O尾二'},
	{regex:/腹二(l)/gm, replacement:'腹二尾一L尾二'},

	{regex:/腹二(s)/gm, replacement:'腹二尾一Z尾二'},
	{regex:/腹二(ʔ)/gm, replacement:'腹二尾一Q尾二'},
	{regex:/腹二$/gm, replacement:'腹二尾一A尾二'},


	{regex:/首一kl首二/gm, replacement:'首一I首二'},
	{regex:/首一ɡl首二/gm, replacement:'首一U首二'},
	{regex:/首一ɡj首二/gm, replacement:'首一U首二'},
	{regex:/首一ŋj首二/gm, replacement:'首一U首二'},
	{regex:/首一hʷ首二/gm, replacement:'首一.首二'},
	{regex:/首一lʰ首二/gm, replacement:'首一O首二'},
	{regex:/首一nʰ首二/gm, replacement:'首一,首二'},
	{regex:/首一mʰ首二/gm, replacement:'首一.首二'},
	{regex:/首一sn首二/gm, replacement:'首一,首二'},
	{regex:/首一sŋ首二/gm, replacement:'首一;首二'},
	{regex:/首一stʰ首二/gm, replacement:'首一;首二'},
	{regex:/首一st首二/gm, replacement:'首一;首二'},
	{regex:/首一sk首二/gm, replacement:'首一K首二'},
	{regex:/首一sʷ首二/gm, replacement:'首一,首二'},
	{regex:/首一ʍ首二/gm, replacement:'首一,首二'},
	{regex:/首一ɦ首二/gm, replacement:'首一U首二'},
	{regex:/首一rʰ首二/gm, replacement:'首一E首二'},
	{regex:/首一(kj)首二/gm, replacement:'首一I首二'},
	{regex:/首一(kʰl)首二/gm, replacement:'首一A首二'},
	{regex:/首一(sl)首二/gm, replacement:'首一J首二'},
	{regex:/首一(ʔ)首二/gm, replacement:'首一Q首二'},
	{regex:/首一(ŋ)首二/gm, replacement:'首一W首二'},
	{regex:/首一(tʰ)首二/gm, replacement:'首一E首二'},
	{regex:/首一(j)首二/gm, replacement:'首一R首二'},
	{regex:/首一(t)首二/gm, replacement:'首一T首二'},
	{regex:/首一(w)首二/gm, replacement:'首一Y首二'},
	{regex:/首一(ɡʷ)首二/gm, replacement:'首一U首二'},
	{regex:/首一(ŋʷ)首二/gm, replacement:'首一U首二'},
	{regex:/首一(ʔʷ)首二/gm, replacement:'首一A首二'},
	{regex:/首一(kʰʷ)首二/gm, replacement:'首一A首二'},
	{regex:/首一(kʷ)首二/gm, replacement:'首一I首二'},
	
	{regex:/首一(kʰj)首二/gm, replacement:'首一A首二'},
	{regex:/首一(ɕ)首二/gm, replacement:'首一O首二'},
	{regex:/首一(l̥)首二/gm, replacement:'首一O首二'},
	{regex:/首一(p)首二/gm, replacement:'首一P首二'},
	
	{regex:/首一(s)首二/gm, replacement:'首一S首二'},
	{regex:/首一(d)首二/gm, replacement:'首一D首二'},
	{regex:/首一(pʰ)首二/gm, replacement:'首一F首二'},
	{regex:/首一(ɡ)首二/gm, replacement:'首一G首二'},
	{regex:/首一(h)首二/gm, replacement:'首一H首二'},
	{regex:/首一(dz)首二/gm, replacement:'首一Z首二'},
	{regex:/首一(z)首二/gm, replacement:'首一J首二'},
	{regex:/首一(ʑ)首二/gm, replacement:'首一J首二'},
	{regex:/首一(ŋʷ)首二/gm, replacement:'首一J首二'},

	{regex:/首一(kʰ)首二/gm, replacement:'首一X首二'},
	{regex:/首一(l)首二/gm, replacement:'首一L首二'},
	

	
	{regex:/首一(k)首二/gm, replacement:'首一K首二'},
	{regex:/首一(tsʰ)首二/gm, replacement:'首一V首二'},
	{regex:/首一(ts)首二/gm, replacement:'首一C首二'},
	{regex:/首一(b)首二/gm, replacement:'首一B首二'},
	{regex:/首一(n)首二/gm, replacement:'首一N首二'},
	{regex:/首一(m)首二/gm, replacement:'首一M首二'},

	
	{regex:/首一(.*)ʷ首二/gm, replacement:'首一$1首二'},
	{regex:/首一(r)首二/gm, replacement:'首一R首二'},
	{regex:/首一()首二/gm, replacement:'首一R首二'},

	{regex:/首一(.*?)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'$1$2$3'},
]



//export = replacePair