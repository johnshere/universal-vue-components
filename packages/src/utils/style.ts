const CLASS_NAME_SPACE = 'uni';

export function classNs(className: string) {
    return `${CLASS_NAME_SPACE}-${className}`;
}
