import './polyfills.ts';

import { platformBrowser }    from '@angular/platform-browser';
// import { AppModuleNgFactory } from '../aot/src/app/app.module.ngfactory';
/**
 * 设置全局对象
 * https://github.com/lodash/lodash/
 */
window['_']=require('lodash');

console.log('Running AOT compiled');
// platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
