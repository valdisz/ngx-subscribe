[![npm version](https://badge.fury.io/js/ngx-subscribe.svg)](https://badge.fury.io/js/ngx-subscribe)

ngx-subscribe
=============

Subscribe decorator to be used in Angular 2+ components, it will automatically subscribe and cleanup observables to component properties.


Motivation
----------

Allows to avoid boilerplate code when working with many observables. Decorator will subscribe to observable and unsubscribe from it when component will be destroyed. No need to use `async` pipe in the views. Supports inheritance.


Installation
------------

    npm install ngx-subscribe --save


Dependancies
------------

`ngx-subscribe` requires `rxjs` of version `5.0.0` and above as peer dependacny and, to function 100% correctly, must be used within Angular
components only.


Usage
-----

### `demo.component.ts`

```typescript
import { Component, ChangeDetectorRef } from '@angular/core';
import { Http } from '@angular/http';
import { Subscribe } from 'ngx-subscribe';

@Component({
    select: 'demo',
    templateUrl: 'demo.component.html'
})
export class DemoComponent implements Subscribable {
    constructor(
        public changeDetector: ChangeDetectorRef,   // need that for OnPush change detection strategy to work correctly
        private _http: Http
    ) {
    }

    @Subscribe() pagesCount = this._http
        .get('http://example.com/pages/count')
        .map(response => response.json());

    // with default value
    @Subscribe(1) currentPage = this._http
        .get('http://example.com/pages/current')
        .map(response => response.json());
}
```

### `demo.component.html`

```html
Current page is {{ currentPage }} out of {{ pagesCount }} pages.

```
