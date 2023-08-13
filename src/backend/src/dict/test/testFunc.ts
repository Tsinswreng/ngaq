import Util from "Util";


function filterUniquePairs<A,B>(arr: [A, B][]){
	const seenPairs = new Set<string>();
	const uniquePairs: [A, B][] = [];
	for (const pair of arr) {
	  if (pair[0] as any !== pair[1]) {
		const sortedPair = pair.slice().sort();
		const pairKey = `${sortedPair[0]},${sortedPair[1]}`;
  
		if (!seenPairs.has(pairKey)) {
		  seenPairs.add(pairKey);
		  uniquePairs.push(pair);
		}
	  }
	}
  
	return uniquePairs;
  }
  
  // 示例用法
  const inputArray: [number, number][] = [
	[1, 2],
	[3, 1],
	[2, 1],
	[2, 3],
	[4, 5],
	[5, 4],
	[1, 1],
  ];
  
  const result = filterUniquePairs(inputArray);
  console.log(result); // Output: [ [1, 2], [3, 1], [2, 3], [4, 5] ]