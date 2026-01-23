import { client } from "@/sanity/client";
import { projectId } from "@/sanity/env";
import {
    ALL_PROJECTS_QUERY,
    LATEST_NEWS_QUERY,
    ALL_NEWS_QUERY,
    FEATURED_PROJECTS_QUERY,
    ALL_MEMBERS_QUERY,
    ALL_PUBLICATIONS_QUERY
} from "./queries";
import { MOCK_PROJECTS, MOCK_NEWS, MOCK_MEMBERS, MOCK_PUBLICATIONS } from "./mockData";

const IS_MOCK = projectId === "your-project-id";

export async function sanityFetch({ query, params = {} }: { query: string; params?: any }) {
    if (IS_MOCK) {

        if (query === ALL_PROJECTS_QUERY) return MOCK_PROJECTS;
        if (query === LATEST_NEWS_QUERY) return MOCK_NEWS;
        if (query === ALL_NEWS_QUERY) return MOCK_NEWS;
        if (query === FEATURED_PROJECTS_QUERY) return MOCK_PROJECTS.slice(0, 3);
        if (query === ALL_MEMBERS_QUERY) return MOCK_MEMBERS;
        if (query === ALL_PUBLICATIONS_QUERY) return MOCK_PUBLICATIONS;

        return [];
    }

    return client.fetch(query, params);
}
