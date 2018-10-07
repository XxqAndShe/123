import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment.prod';
import { AppModule } from './app/app.module';
/**
 * 设置全局对象
 * https://github.com/lodash/lodash/
 */
window['_']=require('lodash');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
