import process from 'process';
import consola from 'consola';

export function errorAndExit(err: Error | string): never {
    if (typeof err === 'string') {
        err = new Error(err);
    }
    consola.error(err);
    process.exit(1);
}
