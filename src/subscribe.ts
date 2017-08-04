import { ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

/**
 * Describes expected component interface when it uses Subscribe decorators.
 */
export interface WithSubscriptions {
    changeDetector: ChangeDetectorRef;
}

interface Shadow extends WithSubscriptions {
    __subs?: { [prop: string]: Subscription };
    __value?: { [prop: string]: any };
    __unsubscribeAll();
    __ngOnDestroy?();
}

function setValue(shadow: Shadow, prop: string, value: any) {
    if (!shadow.__value) shadow.__value = { };

    if (shadow.__value[prop] !== value) {
        shadow.__value[prop] = value;
        if (shadow.changeDetector) shadow.changeDetector.markForCheck();
    }
}

function getValue(shadow: Shadow, prop: string, defaultValue?: any): any {
    if (!shadow.__value) return defaultValue;

    return shadow.__value[prop];
}

function subscribe(shadow: Shadow, prop: string, obs: Observable<any>) {
    if (!shadow.__subs) shadow.__subs = { };

    shadow.__subs[prop] = obs.subscribe(value => setValue(shadow, prop, value));
}

function unsubscribe(shadow: Shadow, prop: string) {
    if (!shadow.__subs) return;

    const sub = shadow.__subs[prop];
    if (sub) {
        sub.unsubscribe();
        delete shadow.__subs[prop];
    }
}

function unsubscribeAll() {
    var self: Shadow = this;

    if (!self.__subs) return;

    for (let prop of Object.getOwnPropertyNames(self.__subs)) {
        self.__subs[prop].unsubscribe();
    }
}

function onDestroy() {
    const self: Shadow = this;

    if (self.__ngOnDestroy) self.__ngOnDestroy();
    self.__unsubscribeAll();
}

function likeObservable(maybeObservable: Observable<any>): boolean {
    return !!maybeObservable && typeof(maybeObservable.subscribe) === 'function';
}

/**
 * Will define property which will subscribe to the given Observable on set and will return last emited value on get.
 *
 * @param defaultValue Default value which will be used till observable will emit its value for the first time.
 */
export function Subscribe(defaultValue?: any): any {
    return function (target: any, propertyKey: string) {
        const proto = target.constructor.prototype;
        if (!proto['__unsubscribeAll']) {
            const ngOnDestroy = proto['ngOnDestroy'];
            if (ngOnDestroy) proto['__ngOnDestroy'] = ngOnDestroy;

            proto['__unsubscribeAll'] = unsubscribeAll;
            proto['ngOnDestroy'] = onDestroy;
        }

        const desc: PropertyDescriptor = {
            get: function() { return getValue(this, propertyKey, defaultValue); },
            set: function(value: any) {
                const self = this;

                unsubscribe(self, propertyKey);

                // looks like Observable?
                if (likeObservable(value)) {
                    subscribe(self, propertyKey, value);
                } else {
                    setValue(self, propertyKey, value);
                }
            }
        };

        return desc;
    };
}
