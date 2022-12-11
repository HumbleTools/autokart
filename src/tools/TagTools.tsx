import { NavLink } from "react-router-dom";

export const parseTags = (tagsString?: string) => {
    if(!tagsString) {
        return [];
    }
    const tags = tagsString
        .split(/[\s,|;:/\\-]+/g)
        .filter(it => !!it.trimStart())
        .map(it => it.toLowerCase());
    return Array.from(new Set<string>(tags));
};

export const displayTags = (tags: string[]) => {
    return <>
        {tags?.map(mapTag)}
    </>;
};

const mapTag = (tag: string, index: number) => {
    return <NavLink className="tag no-link" key={index} to={`/search/tag/${tag}`}>{tag}</NavLink>;
}