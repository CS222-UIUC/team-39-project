export function getEnvVariable<T = string>(key: string): T {
    const value = process.env[key];
    console.log(`Environment variable ${key}:`, value);
    if (value === undefined || value === null) {
        throw new Error(`${key} environment variable is not defined`);
    }
    try {
        // Attempt to parse JSON for list-like variables
        return JSON.parse(value) as T;
    } catch {
        // Return as string if not JSON
        return value as T;
    }
}