import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import * as Highcharts from 'highcharts';

// استيراد الموديولات من المسار الكامل مع الامتداد .js
import TreemapModule from 'highcharts/modules/treemap.js';
import TreegraphModule from 'highcharts/modules/treegraph.js';

// لازم تفعّل الـ Treemap قبل الـ Treegraph
TreemapModule(Highcharts);
TreegraphModule(Highcharts);

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
