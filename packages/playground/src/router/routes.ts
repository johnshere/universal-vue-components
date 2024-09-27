import type {RouteConfig} from 'vue-router';

function createRoutes() {
    const routes: RouteConfig[] = [{path: '/', redirect: '/home'}];

    const viewsList = import.meta.glob('../views/**/index.vue');
    Object.entries(viewsList).forEach(([path, component]) => {
        const name = path.replace(/.*\/([^/]+)\/index\.vue$/, '$1');
        routes.push({
            name,
            path: `/${name}`,
            component,
        });
    });

    return routes;
}

export const routes = createRoutes();
