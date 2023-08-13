import Util from "Util";
function permute(elements: any[], m: number): any[][] {
	const result: any[][] = [];
  
	function backtrack(tempArr: any[]) {
	  if (tempArr.length === m) {
		result.push([...tempArr]);
		return;
	  }
  
	  for (let i = 0; i < elements.length; i++) {
		if (!tempArr.includes(elements[i])) {
		  tempArr.push(elements[i]);
		  backtrack(tempArr);
		  tempArr.pop();
		}
	  }
	}
  
	backtrack([]);
	return result;
  }
  
  const n = [1, 2, 3, 4]; // 输入的n个元素
  const m = 3; // 取出m个元素的排列
  
  const result = permute(n, m);
  console.log(result);