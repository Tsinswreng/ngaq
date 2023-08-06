import { RegexReplacePair } from "Type"
let replacePair:RegexReplacePair[] = [


	{regex:/rˁa/gm, replacement:'腹一U腹二'},
	{regex:/rˁe/gm, replacement:'腹一I腹二'},
	{regex:/rˁi/gm, replacement:'腹一O腹二'},
	{regex:/rˁo/gm, replacement:'腹一P腹二'},
	{regex:/rˁu/gm, replacement:'腹一J腹二'},
	{regex:/rˁə/gm, replacement:'腹一M腹二'},

	{regex:/ˁa/gm, replacement:'腹一Z腹二'},
	{regex:/ˁe/gm, replacement:'腹一X腹二'},
	{regex:/ˁi/gm, replacement:'腹一C腹二'},
	{regex:/ˁo/gm, replacement:'腹一V腹二'},
	{regex:/ˁu/gm, replacement:'腹一B腹二'},
	{regex:/ˁə/gm, replacement:'腹一N腹二'},

	{regex:/ra/gm, replacement:'腹一Q腹二'},
	{regex:/re/gm, replacement:'腹一W腹二'},
	{regex:/ri/gm, replacement:'腹一E腹二'},
	{regex:/ro/gm, replacement:'腹一R腹二'},
	{regex:/ru/gm, replacement:'腹一T腹二'},
	{regex:/rə/gm, replacement:'腹一Y腹二'},

	{regex:/a/gm, replacement:'腹一A腹二'},
	{regex:/e/gm, replacement:'腹一S腹二'},
	{regex:/i/gm, replacement:'腹一D腹二'},
	{regex:/o/gm, replacement:'腹一F腹二'},
	{regex:/u/gm, replacement:'腹一G腹二'},
	{regex:/ə/gm, replacement:'腹一H腹二'},

	{regex:/rja/gm, replacement:'腹一L腹二'},
	{regex:/ja/gm, replacement:'腹一K腹二'},

	{regex:/^(.*?)腹一/gm, replacement:'首一$1首二腹一'},

	{regex:/首一kʷ首二/gm, replacement:'首一kʷ首二'},

	{regex:/腹二(ts)/gm, replacement:'腹二尾一I尾二'},

	{regex:/腹二(ŋs)/gm, replacement:'腹二尾一X尾二'},
	{regex:/腹二(ŋʔ)/gm, replacement:'腹二尾一W尾二'},
	{regex:/腹二(ŋ)/gm, replacement:'腹二尾一S尾二'},
	{regex:/腹二(k)/gm, replacement:'腹二尾一K尾二'},

	{regex:/腹二(ns)/gm, replacement:'腹二尾一C尾二'},
	{regex:/腹二(nʔ)/gm, replacement:'腹二尾一E尾二'},
	{regex:/腹二(n)/gm, replacement:'腹二尾一D尾二'},
	{regex:/腹二(t)/gm, replacement:'腹二尾一T尾二'},

	{regex:/腹二(ms)/gm, replacement:'腹二尾一V尾二'},
	{regex:/腹二(mʔ)/gm, replacement:'腹二尾一F尾二'},
	{regex:/腹二(m)/gm, replacement:'腹二尾一R尾二'},
	{regex:/腹二(p)/gm, replacement:'腹二尾一P尾二'},

	{regex:/腹二(js)/gm, replacement:'腹二尾一N尾二'},
	{regex:/腹二(jʔ)/gm, replacement:'腹二尾一Y尾二'},
	{regex:/腹二(j)/gm, replacement:'腹二尾一H尾二'},

	{regex:/腹二(ws)/gm, replacement:'腹二尾一M尾二'},
	{regex:/腹二(wʔ)/gm, replacement:'腹二尾一U尾二'},
	{regex:/腹二(w)/gm, replacement:'腹二尾一J尾二'},

	{regex:/腹二(s)/gm, replacement:'腹二尾一Z尾二'},
	{regex:/腹二(ʔ)/gm, replacement:'腹二尾一Q尾二'},
	{regex:/腹二$/gm, replacement:'腹二尾一A尾二'},



	{regex:/首一(.*?)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'$1$2$3'},
]

export = replacePair