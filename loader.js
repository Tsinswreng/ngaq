//@ts-check_
// import { resolve as resolveTs } from 'ts-node/esm'
// import * as tsConfigPaths from 'tsconfig-paths'
// import { pathToFileURL } from 'url'

// const { absoluteBaseUrl, paths } = tsConfigPaths.loadConfig()
// const matchPath = tsConfigPaths.createMatchPath(absoluteBaseUrl, paths)

// export function resolve (specifier, ctx, defaultResolve) {
//   const match = matchPath(specifier)
//   return match
//     ? resolveTs(pathToFileURL(`${match}`).href, ctx, defaultResolve)
//     : resolveTs(specifier, ctx, defaultResolve)
// }
// //console.log(12345)
// export { load, transformSource } from 'ts-node/esm'


// loader.js

import {
	resolve as resolveTs,
	getFormat,
	transformSource,
	load,
  } from "ts-node/esm";
  import * as tsConfigPaths from "tsconfig-paths"
  
  export { getFormat, transformSource, load };
  
  const { absoluteBaseUrl, paths } = tsConfigPaths.loadConfig()
  const matchPath = tsConfigPaths.createMatchPath(absoluteBaseUrl, paths)
  
  export function resolve(specifier, context, defaultResolver) {
	const mappedSpecifier = matchPath(specifier)
	if (mappedSpecifier) {
	  specifier = `${mappedSpecifier}.js`
	}
	return resolveTs(specifier, context, defaultResolver);
  }