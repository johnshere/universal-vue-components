import path from 'path';

export const PROJECT_ROOT_PATH = path.resolve(__dirname, '../../');

export const PROJECT_OUTPUT_PATH = path.resolve(PROJECT_ROOT_PATH, 'output');

export const PACKAGES_ROOT_PATH = path.resolve(PROJECT_ROOT_PATH, 'packages');

export const COMPONENTS_SRC_PKG_PATH = path.resolve(
    PACKAGES_ROOT_PATH,
    'src'
);
