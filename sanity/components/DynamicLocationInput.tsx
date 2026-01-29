
import { useCallback, useState, useEffect } from 'react';
import { Select, Card, Stack, Text, Spinner } from '@sanity/ui';
import { type StringInputProps, set, unset } from 'sanity';
import { useClient } from 'sanity';

export function DynamicLocationInput(props: StringInputProps) {
    const { value, onChange } = props;
    const client = useClient({ apiVersion: '2024-01-01' });
    const [locations, setLocations] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                // Fetch all locations from inventory items
                // Use a fast projection
                const result = await client.fetch<string[]>(
                    `*[_type == "inventoryItem" && defined(location)].location`
                );

                // Deduplicate and sort
                const uniqueLocations = Array.from(new Set(result)).sort();
                setLocations(uniqueLocations);
            } catch (err) {
                console.error("Failed to fetch locations", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, [client]);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const nextValue = event.currentTarget.value;
        onChange(nextValue ? set(nextValue) : unset());
    }, [onChange]);

    if (loading) {
        return (
            <Card padding={3}>
                <Stack space={2}>
                    <Spinner size={1} />
                    <Text size={1} muted>Loading locations...</Text>
                </Stack>
            </Card>
        );
    }

    return (
        <Card>
            <Select
                fontSize={2}
                padding={3}
                value={value || ''}
                onChange={handleChange}
            >
                <option value="">Select a location...</option>
                {locations.map((loc) => (
                    <option key={loc} value={loc}>
                        {loc}
                    </option>
                ))}
            </Select>
        </Card>
    );
}
