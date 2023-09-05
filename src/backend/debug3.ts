/* // 定义一些示例函数

function add(x: number, y: number): number {
	return x + y;
  }
  
  function double(x: number): number {
	return x * 2;
  }
  
  function square(x: number): number {
	return x * x;
  }
  
  // 使用管道操作符来链式调用函数
  
  const result = 5
	|> add(3)       // 将 5 与 3 相加
	|> double       // 将结果乘以 2
	|> square;      // 将结果平方
  
  console.log(result); // 输出 64 (5 + 3 = 8, 8 * 2 = 16, 16 * 16 = 64) */