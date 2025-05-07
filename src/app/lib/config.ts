export function getEnvVariable<T = string>(key: string): T {
    const value = process.env[key];
    console.log(`Environment variable ${key}:`, value);
    if (value === undefined || value === null) {
        throw new Error(`${key} environment variable is not defined`);
    }
    return value as T;
}