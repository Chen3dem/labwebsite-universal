import { defineField, defineType } from 'sanity';
import { DynamicLocationInput } from '../components/DynamicLocationInput';

export const nfcTag = defineType({
    name: 'nfcTag',
    title: 'NFC Tag',
    type: 'document',
    fields: [
        defineField({
            name: 'tagId',
            title: 'Tag ID (Payload)',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'The string encoded on the NFC tag (e.g. loc-fridge-1).',
        }),
        defineField({
            name: 'type',
            title: 'Tag Action Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Location Inventory', value: 'location' },
                    { title: 'Receiving Station', value: 'receiving' },
                    { title: 'Equipment', value: 'equipment' },
                    { title: 'Protocol', value: 'protocol' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        // Conditional fields
        defineField({
            name: 'location',
            title: 'Target Location',
            type: 'string',
            components: {
                input: DynamicLocationInput
            },
            hidden: ({ document }) => document?.type !== 'location',
            description: 'Dynamically populated from existing Inventory Locations.',
        }),
        defineField({
            name: 'equipment',
            title: 'Target Equipment',
            type: 'reference',
            to: [{ type: 'inventoryItem' }],
            options: {
                filter: 'category == "Equipment"',
            },
            hidden: ({ document }) => document?.type !== 'equipment',
            description: 'Select an equipment item from inventory.',
        }),
        defineField({
            name: 'protocol',
            title: 'Target Protocol',
            type: 'reference',
            to: [{ type: 'protocol' }],
            hidden: ({ document }) => document?.type !== 'protocol',
            description: 'Select a protocol to open.',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'string',
        }),
    ],
    preview: {
        select: {
            title: 'tagId',
            subtitle: 'type',
        },
    },
});
