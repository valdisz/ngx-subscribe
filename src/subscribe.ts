import { Observable, Subscription } from 'rxjs';

interface Shadow {
    __subs?: { [prop: string]: Subscription };
    __value?: { [prop: string]: any };
    __unsubscribeAll();
    __ngOnDestroy?();
}

function setValue(shadow: Shadow, prop: string, value: any) {
    if (!shadow.__value) shadow.__value = { };

    shadow.__value[prop] = value;
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
                if (value instanceof Observable) {
                    subscribe(self, propertyKey, value);
                } else {
                    setValue(self, propertyKey, value);
                }
            }
        };

        return desc;
    };
}
