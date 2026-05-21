export function formatFields(fields: string): Record<string, 1> {
    return Object.fromEntries(
        fields
            .split(",")
            .map((field) => field.trim())
            .filter(Boolean)
            .map((field) => [field, 1])
    );
}
