import path from 'path';
import {dest, src} from 'gulp';
import gulpStylus from 'gulp-stylus';
import nib from 'nib';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import consola from 'consola';
import chalk from 'chalk';
import {distPath, stylesPath} from '../utils/paths';

const distBundle = path.resolve(distPath, 'styles');

/**
 * 对 stylus 进行处理
 */
export async function buildStylus() {
    return (
        src([
            path.resolve(stylesPath, './src/**/*.styl'),
            '!' + path.resolve(stylesPath, './src/common/*.styl'),
            '!' + path.resolve(stylesPath, './src/mixins/*.styl'),
        ])
            .pipe(
                gulpStylus({
                    // @ts-ignore
                    use: [nib()],
                })
            )
            .pipe(autoprefixer({cascade: false}))
            // 使用 clean-css 减小 css 大小
            .pipe(
                cleanCSS({}, details => {
                    consola.success(
                        `${chalk.cyan(details.name)}: ${chalk.yellow(
                            details.stats.originalSize / 1000
                        )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
                    );
                })
            )
            .pipe(dest(distBundle))
    );
}

/**
 * 拷贝源码
 */
export function copyStylusSource() {
    return src(path.resolve(stylesPath, './src/**/*')).pipe(
        dest(path.resolve(distBundle, 'src'))
    );
}
