import { RepresentationModel } from './RepresentationModel';

/** A resource that’s backed by a singular object or concept */
export class EntityModel<T> extends RepresentationModel {
    entity: T;

    constructor(entity: T) {
        super();
        this.entity = entity;
    }

    getEntity(): T {
        return this.entity;
    }

    serialize(): any {
        return {
            ...this.entity,
            _links: this.links,
        };
    }

    static deserialize<T>(json: any): EntityModel<T> {
        const { _links, ...entity } = json;
        const model = new EntityModel(entity);
        model.addLinks(_links);
        return model;
    }
}
