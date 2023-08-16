import { RegexReplacePair } from "Type"
export let replacePair:RegexReplacePair[] = 
		[
			//先轉大寫
			{regex:/'/gm, replacement:''},
			
			{regex:/(.)(.)(.)/gm, replacement:'首一$1首二腹一$2腹二尾一$3尾二'},
			//{regex:/首一(.)首二腹一([rsfx])/gm, replacement:'首一$1ʷ首二腹一$2'},//

			{regex:/首一(Y)首二腹一([QTIPHYCN])腹二尾一(.*?)尾二/gm, replacement:'首一j首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(Y)首二腹一([WGKLVMB])腹二尾一(.*?)尾二/gm, replacement:'首一w首二腹一$2腹二尾一$3尾二'},
			
			//脱脣
			{regex:/首一([PFBM])首二腹一(S)腹二尾一([QAZEDCT])尾二/gm, replacement:'首一$1首二腹一A腹二尾一$3尾二'},
			{regex:/首一([PFBM])首二腹一(L)腹二尾一([QAZ])尾二/gm, replacement:'首一$1首二腹一J腹二尾一$3尾二'},

			{regex:/首一([PFBM])首二腹一(O)腹二尾一([EDCYHN])尾二/gm, replacement:'首一$1首二腹一L腹二尾一$3尾二'},


//A
			{regex:/首一(.*?)首二腹一(A)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一jʔ尾二'},
			{regex:/首一(.*?)首二腹一(A)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一j尾二'},
			{regex:/首一(.*?)首二腹一(A)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一js尾二'},

			{regex:/首一(.*?)首二腹一(A)腹二尾一(B)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一ts尾二'},

			{regex:/首一(.*?)首二腹一(A)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(A)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(A)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(A)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(A)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(A)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(A)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(A)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一t尾二'},

			{regex:/首一(.*?)首二腹一(A)腹二尾一(R)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一mʔ尾二'},
			{regex:/首一(.*?)首二腹一(A)腹二尾一(F)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一m尾二'},
			{regex:/首一(.*?)首二腹一(A)腹二尾一(V)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一ms尾二'},
			{regex:/首一(.*?)首二腹一(A)腹二尾一(P)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一p尾二'},

			{regex:/首一(.*?)首二腹一(A)腹二尾一(U)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一wʔ尾二'},
			{regex:/首一(.*?)首二腹一(A)腹二尾一(J)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一w尾二'},
			{regex:/首一(.*?)首二腹一(A)腹二尾一(M)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一ws尾二'},
//B
			{regex:/首一(.*?)首二腹一(B)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一ʷa腹二尾一ʔ尾二'},
			{regex:/首一(.*?)首二腹一(B)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一ʷa腹二尾一尾二'},
			{regex:/首一(.*?)首二腹一(B)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一ʷa腹二尾一s尾二'},

			{regex:/首一(.*?)首二腹一(B)腹二尾一([B])尾二/gm, replacement:'首一$1首二腹一ʷa腹二尾一ts尾二'},

			{regex:/首一(.*?)首二腹一(B)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一ʷa腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(B)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一ʷa腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(B)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一ʷa腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(B)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一ʷa腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(B)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一ʷa腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(B)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一ʷa腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(B)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一ʷa腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(B)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一ʷa腹二尾一t尾二'},

			{regex:/首一(.*?)首二腹一(B)腹二尾一(R)尾二/gm, replacement:'首一$1首二腹一ʷa腹二尾一mʔ尾二'},
			{regex:/首一(.*?)首二腹一(B)腹二尾一(F)尾二/gm, replacement:'首一$1首二腹一ʷa腹二尾一m尾二'},
			{regex:/首一(.*?)首二腹一(B)腹二尾一(V)尾二/gm, replacement:'首一$1首二腹一ʷa腹二尾一ms尾二'},
			{regex:/首一(.*?)首二腹一(B)腹二尾一(P)尾二/gm, replacement:'首一$1首二腹一ʷa腹二尾一p尾二'},

//C
			{regex:/首一(.*?)首二腹一(C)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一o腹二尾一jʔ尾二'},
			{regex:/首一(.*?)首二腹一(C)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一o腹二尾一j尾二'},
			{regex:/首一(.*?)首二腹一(C)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一o腹二尾一js尾二'},

			{regex:/首一(.*?)首二腹一(C)腹二尾一(B)尾二/gm, replacement:'首一$1首二腹一o腹二尾一ts尾二'},

			{regex:/首一(.*?)首二腹一(C)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一ʷe腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(C)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一ʷe腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(C)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一ʷe腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(C)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一ʷe腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(C)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一o腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(C)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一o腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(C)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一o腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(C)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一o腹二尾一t尾二'},
//D
			{regex:/首一(.*?)首二腹一(D)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一rˁe腹二尾一ʔ尾二'},
			{regex:/首一(.*?)首二腹一(D)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一rˁe腹二尾一尾二'},
			{regex:/首一(.*?)首二腹一(D)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一rˁe腹二尾一s尾二'},

			{regex:/首一(.*?)首二腹一(D)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一rˁe腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(D)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一rˁe腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(D)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一rˁe腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(D)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一rˁe腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(D)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一rˁe腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(D)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一rˁe腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(D)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一rˁe腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(D)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一rˁe腹二尾一t尾二'},

			{regex:/首一(.*?)首二腹一(D)腹二尾一(R)尾二/gm, replacement:'首一$1首二腹一rˁe腹二尾一mʔ尾二'},
			{regex:/首一(.*?)首二腹一(D)腹二尾一(F)尾二/gm, replacement:'首一$1首二腹一rˁe腹二尾一m尾二'},
			{regex:/首一(.*?)首二腹一(D)腹二尾一(V)尾二/gm, replacement:'首一$1首二腹一rˁe腹二尾一ms尾二'},
			{regex:/首一(.*?)首二腹一(D)腹二尾一(P)尾二/gm, replacement:'首一$1首二腹一rˁe腹二尾一p尾二'},

//E

			{regex:/首一(.*?)首二腹一(E)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一ˁe腹二尾一ʔ尾二'},
			{regex:/首一(.*?)首二腹一(E)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一ˁe腹二尾一尾二'},
			{regex:/首一(.*?)首二腹一(E)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一ˁe腹二尾一s尾二'},

			{regex:/首一(.*?)首二腹一(E)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一ˁe腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(E)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一ˁe腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(E)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一ˁe腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(E)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一ˁe腹二尾一k尾二'},

			{regex:/首一([CVZS])首二腹一(E)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一ˁi腹二尾一nʔ尾二'},
			{regex:/首一([CVZS])首二腹一(E)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一ˁi腹二尾一n尾二'},
			{regex:/首一([CVZS])首二腹一(E)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一ˁi腹二尾一ns尾二'},
			{regex:/首一([CVZS])首二腹一(E)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一ˁi腹二尾一t尾二'},

			{regex:/首一(.*?)首二腹一(E)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一ˁe腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(E)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一ˁe腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(E)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一ˁe腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(E)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一ˁe腹二尾一t尾二'},

			{regex:/首一(.*?)首二腹一(E)腹二尾一(R)尾二/gm, replacement:'首一$1首二腹一ˁe腹二尾一mʔ尾二'},
			{regex:/首一(.*?)首二腹一(E)腹二尾一(F)尾二/gm, replacement:'首一$1首二腹一ˁe腹二尾一m尾二'},
			{regex:/首一(.*?)首二腹一(E)腹二尾一(V)尾二/gm, replacement:'首一$1首二腹一ˁe腹二尾一ms尾二'},
			{regex:/首一(.*?)首二腹一(E)腹二尾一(P)尾二/gm, replacement:'首一$1首二腹一ˁe腹二尾一p尾二'},

			{regex:/首一(.*?)首二腹一(E)腹二尾一(U)尾二/gm, replacement:'首一$1首二腹一ˁe腹二尾一wʔ尾二'},
			{regex:/首一(.*?)首二腹一(E)腹二尾一(J)尾二/gm, replacement:'首一$1首二腹一ˁe腹二尾一w尾二'},
			{regex:/首一(.*?)首二腹一(E)腹二尾一(M)尾二/gm, replacement:'首一$1首二腹一ˁe腹二尾一ws尾二'},

//F

			{regex:/首一(.*?)首二腹一(F)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一ʷrˁe腹二尾一ʔ尾二'},
			{regex:/首一(.*?)首二腹一(F)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一ʷrˁe腹二尾一尾二'},
			{regex:/首一(.*?)首二腹一(F)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一ʷrˁe腹二尾一s尾二'},

			{regex:/首一(.*?)首二腹一(F)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一ʷrˁe腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(F)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一ʷrˁe腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(F)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一ʷrˁe腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(F)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一ʷrˁe腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(F)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一ʷrˁe腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(F)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一ʷrˁe腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(F)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一ʷrˁe腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(F)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一ʷrˁe腹二尾一t尾二'},

			{regex:/首一(.*?)首二腹一(F)腹二尾一(R)尾二/gm, replacement:'首一$1首二腹一ʷrˁe腹二尾一mʔ尾二'},
			{regex:/首一(.*?)首二腹一(F)腹二尾一(F)尾二/gm, replacement:'首一$1首二腹一ʷrˁe腹二尾一m尾二'},
			{regex:/首一(.*?)首二腹一(F)腹二尾一(V)尾二/gm, replacement:'首一$1首二腹一ʷrˁe腹二尾一ms尾二'},
			{regex:/首一(.*?)首二腹一(F)腹二尾一(P)尾二/gm, replacement:'首一$1首二腹一ʷrˁe腹二尾一p尾二'},

//G


			{regex:/首一([PFBMKXGWQH])首二腹一(G)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一a腹二尾一jʔ尾二'},
			{regex:/首一([PFBMKXGWQH])首二腹一(G)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一a腹二尾一j尾二'},
			{regex:/首一([PFBMKXGWQH])首二腹一(G)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一a腹二尾一js尾二'},

			{regex:/首一(.*?)首二腹一(G)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一re腹二尾一ʔ尾二'},
			{regex:/首一(.*?)首二腹一(G)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一re腹二尾一尾二'},
			{regex:/首一(.*?)首二腹一(G)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一re腹二尾一s尾二'},

			{regex:/首一(.*?)首二腹一(G)腹二尾一(B)尾二/gm, replacement:'首一$1首二腹一re腹二尾一ts尾二'},

			{regex:/首一(.*?)首二腹一(G)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一re腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(G)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一re腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(G)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一re腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(G)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一re腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(G)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一re腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(G)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一re腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(G)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一re腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(G)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一re腹二尾一t尾二'},

			{regex:/首一(.*?)首二腹一(G)腹二尾一(R)尾二/gm, replacement:'首一$1首二腹一re腹二尾一mʔ尾二'},
			{regex:/首一(.*?)首二腹一(G)腹二尾一(F)尾二/gm, replacement:'首一$1首二腹一re腹二尾一m尾二'},
			{regex:/首一(.*?)首二腹一(G)腹二尾一(V)尾二/gm, replacement:'首一$1首二腹一re腹二尾一ms尾二'},
			{regex:/首一(.*?)首二腹一(G)腹二尾一(P)尾二/gm, replacement:'首一$1首二腹一re腹二尾一p尾二'},

			{regex:/首一(.*?)首二腹一(G)腹二尾一(U)尾二/gm, replacement:'首一$1首二腹一ra腹二尾一wʔ尾二'},
			{regex:/首一(.*?)首二腹一(G)腹二尾一(J)尾二/gm, replacement:'首一$1首二腹一ra腹二尾一w尾二'},
			{regex:/首一(.*?)首二腹一(G)腹二尾一(M)尾二/gm, replacement:'首一$1首二腹一ra腹二尾一ws尾二'},

//H
			{regex:/首一(.*?)首二腹一(H)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一a腹二尾一ʔ尾二'},
			{regex:/首一(.*?)首二腹一(H)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一a腹二尾一尾二'},
			{regex:/首一(.*?)首二腹一(H)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一a腹二尾一s尾二'},

			{regex:/首一([PFBMKXGWQH])首二腹一(H)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一o腹二尾一ŋʔ尾二'},
			{regex:/首一([PFBMKXGWQH])首二腹一(H)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一o腹二尾一ŋ尾二'},
			{regex:/首一([PFBMKXGWQH])首二腹一(H)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一o腹二尾一ŋs尾二'},
			{regex:/首一([PFBMKXGWQH])首二腹一(H)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一o腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(H)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一ro腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(H)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一ro腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(H)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一ro腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(H)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一ro腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(H)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一ru腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(H)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一ru腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(H)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一ru腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(H)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一ru腹二尾一t尾二'},

			{regex:/首一(.*?)首二腹一(H)腹二尾一(Y)尾二/gm, replacement:'首一$1首二腹一ru腹二尾一jʔ尾二'},
			{regex:/首一(.*?)首二腹一(H)腹二尾一(H)尾二/gm, replacement:'首一$1首二腹一ru腹二尾一j尾二'},
			{regex:/首一(.*?)首二腹一(H)腹二尾一(N)尾二/gm, replacement:'首一$1首二腹一ru腹二尾一js尾二'},
			
//I

			{regex:/首一(.*?)首二腹一(I)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一ʔ尾二'},
			{regex:/首一(.*?)首二腹一(I)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一尾二'},
			{regex:/首一(.*?)首二腹一(I)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一s尾二'},

			{regex:/首一(.*?)首二腹一(I)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(I)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(I)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(I)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(I)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一i腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(I)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一i腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(I)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一i腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(I)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一i腹二尾一t尾二'},

			{regex:/首一([KXGWQHCVZSJAEIOUL])首二腹一(I)腹二尾一(R)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一mʔ尾二'},
			{regex:/首一([KXGWQHCVZSJAEIOUL])首二腹一(I)腹二尾一(F)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一m尾二'},
			{regex:/首一([KXGWQHCVZSJAEIOUL])首二腹一(I)腹二尾一(V)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一ms尾二'},
			{regex:/首一([KXGWQHCVZSJAEIOUL])首二腹一(I)腹二尾一(P)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一p尾二'},

			{regex:/首一(.*?)首二腹一(I)腹二尾一(R)尾二/gm, replacement:'首一$1首二腹一i腹二尾一mʔ尾二'},
			{regex:/首一(.*?)首二腹一(I)腹二尾一(F)尾二/gm, replacement:'首一$1首二腹一i腹二尾一m尾二'},
			{regex:/首一(.*?)首二腹一(I)腹二尾一(V)尾二/gm, replacement:'首一$1首二腹一i腹二尾一ms尾二'},
			{regex:/首一(.*?)首二腹一(I)腹二尾一(P)尾二/gm, replacement:'首一$1首二腹一i腹二尾一p尾二'},

			{regex:/首一(.*?)首二腹一(I)腹二尾一(Y)尾二/gm, replacement:'首一$1首二腹一i腹二尾一jʔ尾二'},
			{regex:/首一(.*?)首二腹一(I)腹二尾一(H)尾二/gm, replacement:'首一$1首二腹一i腹二尾一j尾二'},
			{regex:/首一(.*?)首二腹一(I)腹二尾一(N)尾二/gm, replacement:'首一$1首二腹一i腹二尾一js尾二'},

			{regex:/首一(.*?)首二腹一(I)腹二尾一(U)尾二/gm, replacement:'首一$1首二腹一ri腹二尾一wʔ尾二'},
			{regex:/首一(.*?)首二腹一(I)腹二尾一(J)尾二/gm, replacement:'首一$1首二腹一ri腹二尾一w尾二'},
			{regex:/首一(.*?)首二腹一(I)腹二尾一(M)尾二/gm, replacement:'首一$1首二腹一ri腹二尾一ws尾二'},


//J
			{regex:/首一([PFBMKXGWQH])首二腹一(J)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一a腹二尾一ʔ尾二'},
			{regex:/首一([PFBMKXGWQH])首二腹一(J)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一a腹二尾一尾二'},
			{regex:/首一([PFBMKXGWQH])首二腹一(J)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一a腹二尾一s尾二'},

			{regex:/首一(.*?)首二腹一(J)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一ra腹二尾一ʔ尾二'},
			{regex:/首一(.*?)首二腹一(J)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一ra腹二尾一尾二'},
			{regex:/首一(.*?)首二腹一(J)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一ra腹二尾一s尾二'},

			{regex:/首一(.*?)首二腹一(J)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一rˁo腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(J)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一rˁo腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(J)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一rˁo腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(J)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一rˁo腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(J)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(J)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(J)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(J)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一t尾二'},

			{regex:/首一(.*?)首二腹一(J)腹二尾一(Y)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一jʔ尾二'},
			{regex:/首一(.*?)首二腹一(J)腹二尾一(H)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一j尾二'},
			{regex:/首一(.*?)首二腹一(J)腹二尾一(N)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一js尾二'},

//K

			{regex:/首一([KXGWQH])首二腹一(K)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一ʔ尾二'},
			{regex:/首一([KXGWQH])首二腹一(K)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一尾二'},
			{regex:/首一([KXGWQH])首二腹一(K)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一s尾二'},

			{regex:/首一(.*?)首二腹一(K)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一rə腹二尾一ʔ尾二'},
			{regex:/首一(.*?)首二腹一(K)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一rə腹二尾一尾二'},
			{regex:/首一(.*?)首二腹一(K)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一rə腹二尾一s尾二'},

			{regex:/首一([PFBMKXGWQH])首二腹一(K)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一ŋʔ尾二'},
			{regex:/首一([PFBMKXGWQH])首二腹一(K)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一ŋ尾二'},
			{regex:/首一([PFBMKXGWQH])首二腹一(K)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一ŋs尾二'},
			{regex:/首一([PFBMKXGWQH])首二腹一(K)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(K)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一rə腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(K)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一rə腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(K)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一rə腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(K)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一rə腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(K)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一ri腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(K)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一ri腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(K)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一ri腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(K)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一ri腹二尾一t尾二'},

			{regex:/首一([KXGWQH])首二腹一(K)腹二尾一(R)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一mʔ尾二'},
			{regex:/首一([KXGWQH])首二腹一(K)腹二尾一(F)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一m尾二'},
			{regex:/首一([KXGWQH])首二腹一(K)腹二尾一(V)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一ms尾二'},
			{regex:/首一([KXGWQH])首二腹一(K)腹二尾一(P)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一p尾二'},

			{regex:/首一([PFBMCVZSTRDN])首二腹一(K)腹二尾一(R)尾二/gm, replacement:'首一$1首二腹一rə腹二尾一mʔ尾二'},
			{regex:/首一([PFBMCVZSTRDN])首二腹一(K)腹二尾一(F)尾二/gm, replacement:'首一$1首二腹一rə腹二尾一m尾二'},
			{regex:/首一([PFBMCVZSTRDN])首二腹一(K)腹二尾一(V)尾二/gm, replacement:'首一$1首二腹一rə腹二尾一ms尾二'},
			{regex:/首一([PFBMCVZSTRDN])首二腹一(K)腹二尾一(P)尾二/gm, replacement:'首一$1首二腹一rə腹二尾一p尾二'},

			{regex:/首一(.*?)首二腹一(K)腹二尾一(R)尾二/gm, replacement:'首一$1首二腹一ri腹二尾一mʔ尾二'},
			{regex:/首一(.*?)首二腹一(K)腹二尾一(F)尾二/gm, replacement:'首一$1首二腹一ri腹二尾一m尾二'},
			{regex:/首一(.*?)首二腹一(K)腹二尾一(V)尾二/gm, replacement:'首一$1首二腹一ri腹二尾一ms尾二'},
			{regex:/首一(.*?)首二腹一(K)腹二尾一(P)尾二/gm, replacement:'首一$1首二腹一ri腹二尾一p尾二'},

			{regex:/首一([CVZS])首二腹一(K)腹二尾一(Y)尾二/gm, replacement:'首一$1首二腹一ri腹二尾一jʔ尾二'},
			{regex:/首一([CVZS])首二腹一(K)腹二尾一(H)尾二/gm, replacement:'首一$1首二腹一ri腹二尾一j尾二'},
			{regex:/首一([CVZS])首二腹一(K)腹二尾一(N)尾二/gm, replacement:'首一$1首二腹一ri腹二尾一js尾二'},

			{regex:/首一(.*?)首二腹一(K)腹二尾一(Y)尾二/gm, replacement:'首一$1首二腹一rə腹二尾一jʔ尾二'},
			{regex:/首一(.*?)首二腹一(K)腹二尾一(H)尾二/gm, replacement:'首一$1首二腹一rə腹二尾一j尾二'},
			{regex:/首一(.*?)首二腹一(K)腹二尾一(N)尾二/gm, replacement:'首一$1首二腹一rə腹二尾一js尾二'},

//L

			{regex:/首一([PFBMKXGWQH])首二腹一(L)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一o腹二尾一ʔ尾二'},
			{regex:/首一([PFBMKXGWQH])首二腹一(L)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一o腹二尾一尾二'},
			{regex:/首一([PFBMKXGWQH])首二腹一(L)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一o腹二尾一s尾二'},

			{regex:/首一(.*?)首二腹一(L)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一ro腹二尾一ʔ尾二'},
			{regex:/首一(.*?)首二腹一(L)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一ro腹二尾一尾二'},
			{regex:/首一(.*?)首二腹一(L)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一ro腹二尾一s尾二'},

			{regex:/首一(.*?)首二腹一(L)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一ˁə腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(L)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一ˁə腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(L)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一ˁə腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(L)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一ˁə腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(L)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一ˁə腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(L)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一ˁə腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(L)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一ˁə腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(L)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一ˁə腹二尾一t尾二'},

			{regex:/首一(.*?)首二腹一(L)腹二尾一(R)尾二/gm, replacement:'首一$1首二腹一ˁə腹二尾一mʔ尾二'},
			{regex:/首一(.*?)首二腹一(L)腹二尾一(F)尾二/gm, replacement:'首一$1首二腹一ˁə腹二尾一m尾二'},
			{regex:/首一(.*?)首二腹一(L)腹二尾一(V)尾二/gm, replacement:'首一$1首二腹一ˁə腹二尾一ms尾二'},
			{regex:/首一(.*?)首二腹一(L)腹二尾一(P)尾二/gm, replacement:'首一$1首二腹一ˁə腹二尾一p尾二'},

			
			{regex:/首一(.*?)首二腹一(L)腹二尾一(Y)尾二/gm, replacement:'首一$1首二腹一ˁə腹二尾一ʔ尾二'},
			{regex:/首一(.*?)首二腹一(L)腹二尾一(H)尾二/gm, replacement:'首一$1首二腹一ˁə腹二尾一尾二'},
			{regex:/首一(.*?)首二腹一(L)腹二尾一(N)尾二/gm, replacement:'首一$1首二腹一ˁə腹二尾一s尾二'},

//M


			{regex:/首一(w)首二腹一(M)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一ʷə腹二尾一ʔ尾二'},
			{regex:/首一(w)首二腹一(M)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一ʷə腹二尾一尾二'},
			{regex:/首一(w)首二腹一(M)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一ʷə腹二尾一s尾二'},

			{regex:/首一([CVZSJTRDN])首二腹一(M)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一ru腹二尾一ʔ尾二'},
			{regex:/首一([CVZSJTRDN])首二腹一(M)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一ru腹二尾一尾二'},
			{regex:/首一([CVZSJTRDN])首二腹一(M)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一ru腹二尾一s尾二'},



			{regex:/首一(.*?)首二腹一(M)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一u腹二尾一ʔ尾二'},
			{regex:/首一(.*?)首二腹一(M)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一u腹二尾一尾二'},
			{regex:/首一(.*?)首二腹一(M)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一u腹二尾一s尾二'},

			{regex:/首一([PFBMw])首二腹一(M)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一nʔ尾二'},
			{regex:/首一([PFBMw])首二腹一(M)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一n尾二'},
			{regex:/首一([PFBMw])首二腹一(M)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一ns尾二'},
			{regex:/首一([PFBMw])首二腹一(M)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一ə腹二尾一t尾二'},

			{regex:/首一(.*?)首二腹一(M)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一u腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(M)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一u腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(M)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一u腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(M)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一u腹二尾一t尾二'},


			{regex:/首一([CVZSJTRDN])首二腹一(M)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一ru腹二尾一ŋʔ尾二'},
			{regex:/首一([CVZSJTRDN])首二腹一(M)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一ru腹二尾一ŋ尾二'},
			{regex:/首一([CVZSJTRDN])首二腹一(M)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一ru腹二尾一ŋs尾二'},
			{regex:/首一([CVZSJTRDN])首二腹一(M)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一ru腹二尾一k尾二'},


			{regex:/首一(.*?)首二腹一(M)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一u腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(M)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一u腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(M)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一u腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(M)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一u腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(M)腹二尾一(Y)尾二/gm, replacement:'首一$1首二腹一ʷə腹二尾一jʔ尾二'},
			{regex:/首一(.*?)首二腹一(M)腹二尾一(H)尾二/gm, replacement:'首一$1首二腹一ʷə腹二尾一j尾二'},
			{regex:/首一(.*?)首二腹一(M)腹二尾一(N)尾二/gm, replacement:'首一$1首二腹一ʷə腹二尾一js尾二'},

//N

			{regex:/首一(.*?)首二腹一(N)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一u腹二尾一ʔ尾二'},
			{regex:/首一(.*?)首二腹一(N)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一u腹二尾一尾二'},
			{regex:/首一(.*?)首二腹一(N)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一u腹二尾一s尾二'},

			{regex:/首一(.*?)首二腹一(N)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一u腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(N)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一u腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(N)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一u腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(N)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一u腹二尾一k尾二'},

//O
			{regex:/首一(.*?)首二腹一(O)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一ʔ尾二'},
			{regex:/首一(.*?)首二腹一(O)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一尾二'},
			{regex:/首一(.*?)首二腹一(O)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一ˁa腹二尾一s尾二'},

			{regex:/首一(.*?)首二腹一(O)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一ˁu腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(O)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一ˁu腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(O)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一ˁu腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(O)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一ˁu腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(O)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一ˁu腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(O)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一ˁu腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(O)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一ˁu腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(O)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一ˁu腹二尾一t尾二'},

			{regex:/首一(.*?)首二腹一(O)腹二尾一(Y)尾二/gm, replacement:'首一$1首二腹一ˁu腹二尾一jʔ尾二'},
			{regex:/首一(.*?)首二腹一(O)腹二尾一(H)尾二/gm, replacement:'首一$1首二腹一ˁu腹二尾一j尾二'},
			{regex:/首一(.*?)首二腹一(O)腹二尾一(N)尾二/gm, replacement:'首一$1首二腹一ˁu腹二尾一js尾二'},

//P
			{regex:/首一(.*?)首二腹一(P)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一o腹二尾一ʔ尾二'},
			{regex:/首一(.*?)首二腹一(P)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一o腹二尾一尾二'},
			{regex:/首一(.*?)首二腹一(P)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一o腹二尾一s尾二'},

			{regex:/首一(.*?)首二腹一(P)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一ʷˁə腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(P)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一ʷˁə腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(P)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一ʷˁə腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(P)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一ʷˁə腹二尾一k尾二'},

//Q

			{regex:/首一(.*?)首二腹一(Q)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一æ腹二尾一ʔ尾二'},
			{regex:/首一(.*?)首二腹一(Q)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一æ腹二尾一尾二'},
			{regex:/首一(.*?)首二腹一(Q)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一æ腹二尾一s尾二'},

			{regex:/首一(.*?)首二腹一(Q)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一a腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(Q)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一a腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(Q)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一a腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(Q)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一a腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(Q)腹二尾一(R)尾二/gm, replacement:'首一$1首二腹一a腹二尾一mʔ尾二'},
			{regex:/首一(.*?)首二腹一(Q)腹二尾一(F)尾二/gm, replacement:'首一$1首二腹一a腹二尾一m尾二'},
			{regex:/首一(.*?)首二腹一(Q)腹二尾一(V)尾二/gm, replacement:'首一$1首二腹一a腹二尾一ms尾二'},
			{regex:/首一(.*?)首二腹一(Q)腹二尾一(P)尾二/gm, replacement:'首一$1首二腹一a腹二尾一p尾二'},

//R
			{regex:/首一(.*?)首二腹一(R)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一ʷˁe腹二尾一ʔ尾二'},
			{regex:/首一(.*?)首二腹一(R)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一ʷˁe腹二尾一尾二'},
			{regex:/首一(.*?)首二腹一(R)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一ʷˁe腹二尾一s尾二'},

			{regex:/首一(.*?)首二腹一(R)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一ʷˁe腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(R)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一ʷˁe腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(R)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一ʷˁe腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(R)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一ʷˁe腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(R)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一ʷˁe腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(R)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一ʷˁe腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(R)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一ʷˁe腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(R)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一ʷˁe腹二尾一t尾二'},

//S

			{regex:/首一(.*?)首二腹一(S)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一ˁo腹二尾一jʔ尾二'},
			{regex:/首一(.*?)首二腹一(S)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一ˁo腹二尾一j尾二'},
			{regex:/首一(.*?)首二腹一(S)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一ˁo腹二尾一js尾二'},

			{regex:/首一(.*?)首二腹一(S)腹二尾一([B])尾二/gm, replacement:'首一$1首二腹一ˁo腹二尾一ts尾二'},

			{regex:/首一(.*?)首二腹一(S)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一ʷˁa腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(S)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一ʷˁa腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(S)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一ʷˁa腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(S)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一ʷˁa腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(S)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一ˁo腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(S)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一ˁo腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(S)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一ˁo腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(S)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一ˁo腹二尾一t尾二'},

//T
			{regex:/首一(.*?)首二腹一(T)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一e腹二尾一ʔ尾二'},
			{regex:/首一(.*?)首二腹一(T)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一e腹二尾一尾二'},
			{regex:/首一(.*?)首二腹一(T)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一e腹二尾一s尾二'},

			{regex:/首一(.*?)首二腹一(T)腹二尾一(B)尾二/gm, replacement:'首一$1首二腹一e腹二尾一ts尾二'},

			{regex:/首一(.*?)首二腹一(T)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一e腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(T)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一e腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(T)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一e腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(T)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一e腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(T)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一e腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(T)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一e腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(T)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一e腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(T)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一e腹二尾一t尾二'},

			{regex:/首一([CVZSL])首二腹一(T)腹二尾一(R)尾二/gm, replacement:'首一$1首二腹一e腹二尾一mʔ尾二'},
			{regex:/首一([CVZSL])首二腹一(T)腹二尾一(F)尾二/gm, replacement:'首一$1首二腹一e腹二尾一m尾二'},
			{regex:/首一([CVZSL])首二腹一(T)腹二尾一(V)尾二/gm, replacement:'首一$1首二腹一e腹二尾一ms尾二'},
			{regex:/首一([CVZSL])首二腹一(T)腹二尾一(P)尾二/gm, replacement:'首一$1首二腹一e腹二尾一p尾二'},

			{regex:/首一(.*?)首二腹一(T)腹二尾一(R)尾二/gm, replacement:'首一$1首二腹一a腹二尾一mʔ尾二'},
			{regex:/首一(.*?)首二腹一(T)腹二尾一(F)尾二/gm, replacement:'首一$1首二腹一a腹二尾一m尾二'},
			{regex:/首一(.*?)首二腹一(T)腹二尾一(V)尾二/gm, replacement:'首一$1首二腹一a腹二尾一ms尾二'},
			{regex:/首一(.*?)首二腹一(T)腹二尾一(P)尾二/gm, replacement:'首一$1首二腹一a腹二尾一p尾二'},

			{regex:/首一([AEI])首二腹一(T)腹二尾一(U)尾二/gm, replacement:'首一$1首二腹一a腹二尾一wʔ尾二'},
			{regex:/首一([AEI])首二腹一(T)腹二尾一(J)尾二/gm, replacement:'首一$1首二腹一a腹二尾一w尾二'},
			{regex:/首一([AEI])首二腹一(T)腹二尾一(M)尾二/gm, replacement:'首一$1首二腹一a腹二尾一ws尾二'},

			{regex:/首一(.*?)首二腹一(T)腹二尾一(U)尾二/gm, replacement:'首一$1首二腹一e腹二尾一wʔ尾二'},
			{regex:/首一(.*?)首二腹一(T)腹二尾一(J)尾二/gm, replacement:'首一$1首二腹一e腹二尾一w尾二'},
			{regex:/首一(.*?)首二腹一(T)腹二尾一(M)尾二/gm, replacement:'首一$1首二腹一e腹二尾一ws尾二'},

//U
			{regex:/首一(.*?)首二腹一(U)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一ˁo腹二尾一ʔ尾二'},
			{regex:/首一(.*?)首二腹一(U)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一ˁo腹二尾一尾二'},
			{regex:/首一(.*?)首二腹一(U)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一ˁo腹二尾一s尾二'},

			{regex:/首一(.*?)首二腹一(U)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一ˁo腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(U)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一ˁo腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(U)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一ˁo腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(U)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一ˁo腹二尾一k尾二'},

//V
			{regex:/首一(.*?)首二腹一(V)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一ro腹二尾一jʔ尾二'},
			{regex:/首一(.*?)首二腹一(V)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一ro腹二尾一j尾二'},
			{regex:/首一(.*?)首二腹一(V)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一ro腹二尾一js尾二'},

			{regex:/首一(.*?)首二腹一(V)腹二尾一(B)尾二/gm, replacement:'首一$1首二腹一ro腹二尾一ts尾二'},

			{regex:/首一(.*?)首二腹一(V)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一ʷre腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(V)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一ʷre腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(V)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一ʷre腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(V)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一ʷre腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(V)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一ro腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(V)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一ro腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(V)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一ro腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(V)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一ro腹二尾一t尾二'},

//W

			{regex:/首一(.*?)首二腹一(W)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一ra腹二尾一jʔ尾二'},
			{regex:/首一(.*?)首二腹一(W)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一ra腹二尾一j尾二'},
			{regex:/首一(.*?)首二腹一(W)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一ra腹二尾一js尾二'},

			{regex:/首一(.*?)首二腹一(W)腹二尾一(B)尾二/gm, replacement:'首一$1首二腹一a腹二尾一ts尾二'},

			{regex:/首一([PFBMKXGWQH])首二腹一(W)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一a腹二尾一ŋʔ尾二'},
			{regex:/首一([PFBMKXGWQH])首二腹一(W)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一a腹二尾一ŋ尾二'},
			{regex:/首一([PFBMKXGWQH])首二腹一(W)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一a腹二尾一ŋs尾二'},
			{regex:/首一([PFBMKXGWQH])首二腹一(W)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一a腹二尾一k尾二'},//s,ts等要帶r、k等不用

			{regex:/首一(.*?)首二腹一(W)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一ra腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(W)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一ra腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(W)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一ra腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(W)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一ra腹二尾一k尾二'},//s,ts等要帶r、k等不用

			{regex:/首一(.*?)首二腹一(W)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一a腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(W)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一a腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(W)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一a腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(W)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一a腹二尾一t尾二'},

			{regex:/首一(.*?)首二腹一(W)腹二尾一(R)尾二/gm, replacement:'首一$1首二腹一a腹二尾一mʔ尾二'},
			{regex:/首一(.*?)首二腹一(W)腹二尾一(F)尾二/gm, replacement:'首一$1首二腹一a腹二尾一m尾二'},
			{regex:/首一(.*?)首二腹一(W)腹二尾一(V)尾二/gm, replacement:'首一$1首二腹一a腹二尾一ms尾二'},
			{regex:/首一(.*?)首二腹一(W)腹二尾一(P)尾二/gm, replacement:'首一$1首二腹一a腹二尾一p尾二'},

//X

			{regex:/首一(.*?)首二腹一(X)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一rˁo腹二尾一jʔ尾二'}, //暫不用ʷrˁa
			{regex:/首一(.*?)首二腹一(X)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一rˁo腹二尾一j尾二'},
			{regex:/首一(.*?)首二腹一(X)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一rˁo腹二尾一js尾二'},

			{regex:/首一(.*?)首二腹一(X)腹二尾一(B)尾二/gm, replacement:'首一$1首二腹一rˁo腹二尾一ts尾二'},

			{regex:/首一(.*?)首二腹一(X)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一rˁo腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(X)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一rˁo腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(X)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一rˁo腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(X)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一rˁo腹二尾一t尾二'},

			{regex:/首一(.*?)首二腹一(X)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一ʷrˁa腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(X)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一ʷrˁa腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(X)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一ʷrˁa腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(X)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一ʷrˁa腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(X)腹二尾一(Y)尾二/gm, replacement:'首一$1首二腹一rˁu腹二尾一jʔ尾二'},
			{regex:/首一(.*?)首二腹一(X)腹二尾一(H)尾二/gm, replacement:'首一$1首二腹一rˁu腹二尾一j尾二'},
			{regex:/首一(.*?)首二腹一(X)腹二尾一(N)尾二/gm, replacement:'首一$1首二腹一rˁu腹二尾一js尾二'},

//Y

			{regex:/首一(.*?)首二腹一(Y)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一o腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(Y)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一o腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(Y)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一o腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(Y)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一o腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(Y)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一u腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(Y)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一u腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(Y)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一u腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(Y)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一u腹二尾一t尾二'},

			{regex:/首一([KXGWQH])首二腹一(Y)腹二尾一(Y)尾二/gm, replacement:'首一$1首二腹一ʷi腹二尾一jʔ尾二'},
			{regex:/首一([KXGWQH])首二腹一(Y)腹二尾一(H)尾二/gm, replacement:'首一$1首二腹一ʷi腹二尾一j尾二'},
			{regex:/首一([KXGWQH])首二腹一(Y)腹二尾一(N)尾二/gm, replacement:'首一$1首二腹一ʷi腹二尾一js尾二'},

			{regex:/首一(.*?)首二腹一(Y)腹二尾一(Y)尾二/gm, replacement:'首一$1首二腹一u腹二尾一jʔ尾二'},
			{regex:/首一(.*?)首二腹一(Y)腹二尾一(H)尾二/gm, replacement:'首一$1首二腹一u腹二尾一j尾二'},
			{regex:/首一(.*?)首二腹一(Y)腹二尾一(N)尾二/gm, replacement:'首一$1首二腹一u腹二尾一js尾二'},



//Z

			{regex:/首一(.*?)首二腹一(Z)腹二尾一(Q)尾二/gm, replacement:'首一$1首二腹一rˁa腹二尾一jʔ尾二'},
			{regex:/首一(.*?)首二腹一(Z)腹二尾一(A)尾二/gm, replacement:'首一$1首二腹一rˁa腹二尾一j尾二'},
			{regex:/首一(.*?)首二腹一(Z)腹二尾一(Z)尾二/gm, replacement:'首一$1首二腹一rˁa腹二尾一js尾二'},

			{regex:/首一(.*?)首二腹一(Z)腹二尾一(B)尾二/gm, replacement:'首一$1首二腹一rˁa腹二尾一ts尾二'},

			{regex:/首一(.*?)首二腹一(Z)腹二尾一(W)尾二/gm, replacement:'首一$1首二腹一rˁa腹二尾一ŋʔ尾二'},
			{regex:/首一(.*?)首二腹一(Z)腹二尾一(S)尾二/gm, replacement:'首一$1首二腹一rˁa腹二尾一ŋ尾二'},
			{regex:/首一(.*?)首二腹一(Z)腹二尾一(X)尾二/gm, replacement:'首一$1首二腹一rˁa腹二尾一ŋs尾二'},
			{regex:/首一(.*?)首二腹一(Z)腹二尾一(K)尾二/gm, replacement:'首一$1首二腹一rˁa腹二尾一k尾二'},

			{regex:/首一(.*?)首二腹一(Z)腹二尾一(E)尾二/gm, replacement:'首一$1首二腹一rˁa腹二尾一nʔ尾二'},
			{regex:/首一(.*?)首二腹一(Z)腹二尾一(D)尾二/gm, replacement:'首一$1首二腹一rˁa腹二尾一n尾二'},
			{regex:/首一(.*?)首二腹一(Z)腹二尾一(C)尾二/gm, replacement:'首一$1首二腹一rˁa腹二尾一ns尾二'},
			{regex:/首一(.*?)首二腹一(Z)腹二尾一(T)尾二/gm, replacement:'首一$1首二腹一rˁa腹二尾一t尾二'},

			{regex:/首一(.*?)首二腹一(Z)腹二尾一(R)尾二/gm, replacement:'首一$1首二腹一rˁa腹二尾一mʔ尾二'},
			{regex:/首一(.*?)首二腹一(Z)腹二尾一(F)尾二/gm, replacement:'首一$1首二腹一rˁa腹二尾一m尾二'},
			{regex:/首一(.*?)首二腹一(Z)腹二尾一(V)尾二/gm, replacement:'首一$1首二腹一rˁa腹二尾一ms尾二'},
			{regex:/首一(.*?)首二腹一(Z)腹二尾一(P)尾二/gm, replacement:'首一$1首二腹一rˁa腹二尾一p尾二'},

			{regex:/首一(.*?)首二腹一(Z)腹二尾一(Y)尾二/gm, replacement:'首一$1首二腹一rˁə腹二尾一ʔ尾二'},
			{regex:/首一(.*?)首二腹一(Z)腹二尾一(H)尾二/gm, replacement:'首一$1首二腹一rˁə腹二尾一尾二'},
			{regex:/首一(.*?)首二腹一(Z)腹二尾一(N)尾二/gm, replacement:'首一$1首二腹一rˁə腹二尾一s尾二'},

			{regex:/首一(.*?)首二腹一(Z)腹二尾一(U)尾二/gm, replacement:'首一$1首二腹一rˁa腹二尾一wʔ尾二'},
			{regex:/首一(.*?)首二腹一(Z)腹二尾一(J)尾二/gm, replacement:'首一$1首二腹一rˁa腹二尾一w尾二'},
			{regex:/首一(.*?)首二腹一(Z)腹二尾一(M)尾二/gm, replacement:'首一$1首二腹一rˁa腹二尾一ws尾二'},

//聲母
			{regex:/首一(A)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一t首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(B)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一b首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(C)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一ts首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(D)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一d首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(E)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一tʰ首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(F)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一pʰ首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(G)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一ɡ首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(H)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一h首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(I)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一d首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(J)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一z首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(K)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一k首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(L)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一r首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(M)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一m首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(N)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一n首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(O)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一ɕ首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(P)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一p首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(Q)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一ʔ首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(R)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一tʰ首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(S)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一s首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(T)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一t首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(U)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一ʑ首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(V)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一tsʰ首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(W)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一ŋ首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(X)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一kʰ首二腹一$2腹二尾一$3尾二'},
			//{regex:/首一(Y)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一y首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(w)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一w首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(j)首二腹一ʷ/gm, replacement:'首一w首二腹一'},
			{regex:/首一(j)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一l首二腹一$2腹二尾一$3尾二'},
			{regex:/首一(Z)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'首一dz首二腹一$2腹二尾一$3尾二'},

			//{regex:/首一(tsʰ|ts|dz|z)首二腹一(ʷrˁa)腹二尾一(.*?)尾二/gm, replacement:'首一$1首二腹一rˁo腹二尾一$3尾二'},
			//{regex:/首一(tsʰ|ts|dz|z)首二腹一(ʷˁa)腹二尾一(.*?)尾二/gm, replacement:'首一$1首二腹一ˁo腹二尾一$3尾二'},

			{regex:/首一(wʷ)首二/gm, replacement:'首一w首二'},

			//{regex:/^(.)/gm, replacement:'〇$1'},
			{regex:/首一(.*?)首二腹一(.*?)腹二尾一(.*?)尾二/gm, replacement:'$1$2$3'},

		]
//export = replacePair