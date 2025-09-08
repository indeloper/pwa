import BaseCollection from '@/models/BaseCollection';
import BaseResourceCollection from '@/models/BaseResourceCollection';

export interface CollectableOptions {
    collectionClass?: typeof BaseCollection;
}

export function Collectable(options?: CollectableOptions) {
    return function (target: any) {
        const collectionCtor = options?.collectionClass || BaseResourceCollection;

        // static: Model.collect(items)
        if (!('collect' in target)) {
            Object.defineProperty(target, 'collect', {
                value: function(items: any[]) {
                    const Ctor = (this as any).collection || collectionCtor;
                    return new Ctor(items);
                },
                writable: true,
                configurable: true,
            });
        }

        // static: Model.createEmpty()
        if (!('createEmpty' in target)) {
            Object.defineProperty(target, 'createEmpty', {
                value: function() { return new (this as any)(); },
                writable: true,
                configurable: true,
            });
        }

        // clone оставляем в @Model

        // static: Model.collection (default)
        if (!('collection' in target)) {
            Object.defineProperty(target, 'collection', {
                value: collectionCtor,
                writable: true,
                configurable: false,
            });
        }
    };
}


