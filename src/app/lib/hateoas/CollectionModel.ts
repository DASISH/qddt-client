import { EntityModel } from './EntityModel';
import { RepresentationModel } from './RepresentationModel';

/** A collection of EntityModel instances */
export class CollectionModel<T> extends RepresentationModel {
    collection: Array<EntityModel<T>> = [];

    getCollection(): Array<EntityModel<T>> {
        return this.collection;
    }

    addEntityModel(entityModel: EntityModel<T>) {
        this.collection.push(entityModel);
    }

    serialize(collectionName: string): any {
        const result = {
            _embedded: {} as any,
            _links: this.links,
        };

        result._embedded[collectionName] = this.collection.map((entityModel) =>
            entityModel.serialize()
        );

        return result;
    }

    static deserialize<T>(
        json: any,
        collectionName: string
    ): CollectionModel<T> {
        const { _links, _embedded } = json;

        // create a blank CollectionModel
        const collectionModel = new CollectionModel<T>();

        // initialize links
        collectionModel.links = _links;

        // add entity models
        const embeddedCollection = _embedded[collectionName];
        embeddedCollection.forEach((entityJson: any) =>
            collectionModel.addEntityModel(
                EntityModel.deserialize<T>(entityJson)
            )
        );

        return collectionModel;
    }
}
