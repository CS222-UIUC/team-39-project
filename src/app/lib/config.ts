export function getEnvVariable(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} environment variable is not defined`);
    }
    return value;
}