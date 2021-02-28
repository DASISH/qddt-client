import { Link, LinkMap } from './Link';

/** A container for a collection of Links */
export class RepresentationModel {
    links: LinkMap = {};

    addLink(relation: string, href: string): void {
        this.links[relation] = { href };
    }

    addLinks(linkMap: LinkMap) {
        for (const [relation, link] of Object.entries(linkMap)) {
            this.links[relation] = link;
        }
    }

    getLink(relation: string): Link | undefined {
        return this.links[relation];
    }

    hasLink(relation: string): boolean {
        return this.links[relation] !== undefined;
    }
}
