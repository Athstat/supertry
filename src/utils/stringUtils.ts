export function titleCase(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function alphabeticalComparator(a: string, b: string) {
    return a.localeCompare(b, undefined, { sensitivity: 'base' })
};