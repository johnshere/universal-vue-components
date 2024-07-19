import type {App, Component} from 'vue3';
import * as components from './components';

function install(app: App) {
    Object.entries(components).forEach(([, component]) => {
        if ((component as any).install && (component as Component).name) {
            app.component((component as Component).name as string, component as Component);
        }
    });
}

export * from './components';

export default {
    install,
};
