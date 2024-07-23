export function mergeErrStack(innerErr:Error, outErr:Error){
	innerErr.stack = '\n\n'+innerErr.stack + outErr.stack
	return innerErr
}