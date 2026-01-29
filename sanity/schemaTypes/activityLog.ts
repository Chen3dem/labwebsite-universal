import { defineField, defineType } from 'sanity';

export const activityLog = defineType({
    name: 'activityLog',
    title: 'Activity Log',
    type: 'document',
    fields: [
        defineField({
            name: 'user',
            title: 'User',
            type: 'string', // Storing Clerk User ID or Name
        }),
        defineField({
            name: 'action',
            title: 'Action',
            type: 'string', // e.g., "Created Item", "Received Stock"
        }),
        defineField({
            name: 'target',
            title: 'Target Item',
            type: 'string', // Name or ID of the item affected
        }),
        defineField({
            name: 'details',
            title: 'Details',
            type: 'text',
        }),
        defineField({
            name: 'timestamp',
            title: 'Timestamp',
            type: 'datetime',
        }),
    ],
    preview: {
        select: {
            title: 'action',
            subtitle: 'user',
            timestamp: 'timestamp'
        },
        prepare(selection) {
            const { title, subtitle, timestamp } = selection;
            return {
                title: `${title} by ${subtitle}`,
                subtitle: new Date(timestamp).toLocaleString()
            };
        }
    }
});
