import { defineField, defineType } from 'sanity';

// Category options - 3 main categories
const CATEGORY_OPTIONS = [
    { title: 'General', value: 'General' },
    { title: 'Biological', value: 'Biological' },
    { title: 'Equipment', value: 'Equipment' },
];

export const inventoryItem = defineType({
    name: 'inventoryItem',
    title: 'Inventory Item',
    type: 'document',
    fieldsets: [
        {
            name: 'orderTracking',
            title: 'Order Tracking',
            options: { collapsible: true, collapsed: true },
        },
        {
            name: 'equipmentDetails',
            title: 'Equipment Details',
            options: { collapsible: true, collapsed: false },
        },
    ],
    fields: [
        // ========================================
        // COMMON FIELDS (Always Visible)
        // ========================================
        defineField({
            name: 'name',
            title: 'Item Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'name', maxLength: 96 },
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: { list: CATEGORY_OPTIONS, layout: 'dropdown' },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'itemId',
            title: 'Lab ID',
            type: 'string',
            description: 'Auto-generated internal ID (CUI-LAB-xxxx). IDs are recycled when items are deleted.',
            validation: (Rule) => Rule.required(),
            readOnly: true,
        }),
        defineField({
            name: 'barcode',
            title: 'Barcode ID',
            type: 'string',
            description: 'The manufacturer or store barcode (e.g., UPCA/EAN).',
        }),
        defineField({
            name: 'location',
            title: 'Storage Location',
            type: 'string',
            description: 'Where is this item stored?',
        }),
        defineField({
            name: 'owner',
            title: 'Owner',
            description: 'Who owns this item? Select "Lab Stock" for shared items.',
            type: 'reference',
            to: [{ type: 'teamMember' }],
        }),

        // ========================================
        // STOCK FIELDS (Visible, after Owner)
        // ========================================
        defineField({
            name: 'stock',
            title: 'Current Stock',
            type: 'number',
            initialValue: 0,
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
            name: 'minStock',
            title: 'Low Stock Threshold',
            type: 'number',
            initialValue: 5,
            validation: (Rule) => Rule.min(0),
            description: 'Stock level at which status becomes "Low Stock".',
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: ['In Stock', 'Low Stock', 'Requested', 'Ordered', 'Out of Stock'],
            },
            initialValue: 'In Stock',
        }),

        // ========================================
        // OTHER COMMON FIELDS
        // ========================================
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: { layout: 'tags' },
            description: 'e.g., "Project A", "Urgent", "Grant XYZ"',
        }),
        defineField({
            name: 'expiryDate',
            title: 'Expiry Date',
            type: 'date',
        }),
        defineField({
            name: 'description',
            title: 'Description / Notes',
            type: 'text',
            rows: 3,
            description: 'Any additional details about this item.',
        }),
        defineField({
            name: 'image',
            title: 'Current Image',
            type: 'image',
            options: { hotspot: true },
            description: 'The latest image of this item.',
        }),
        defineField({
            name: 'images',
            title: 'Image History',
            type: 'array',
            description: 'All previous images with timestamps. Newest first.',
            of: [{
                type: 'image',
                options: { hotspot: true },
                fields: [
                    {
                        name: 'timestamp',
                        title: 'Captured At',
                        type: 'datetime',
                        options: { dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm' }
                    }
                ],
                preview: {
                    select: {
                        media: 'asset',
                        timestamp: 'timestamp'
                    },
                    prepare({ media, timestamp }) {
                        const date = timestamp ? new Date(timestamp).toLocaleString() : 'No timestamp';
                        return {
                            title: date,
                            media
                        };
                    }
                }
            }],
        }),
        defineField({
            name: 'notes',
            title: 'Lab Notes',
            type: 'array',
            description: 'Chronological notes added by lab members.',
            of: [{
                type: 'object',
                name: 'note',
                fields: [
                    { name: 'content', title: 'Content', type: 'text', rows: 3, validation: (Rule) => Rule.required() },
                    { name: 'timestamp', title: 'Time', type: 'datetime', validation: (Rule) => Rule.required() },
                    { name: 'author', title: 'Author', type: 'string' },
                ],
                preview: {
                    select: { title: 'content', subtitle: 'author', date: 'timestamp' },
                    prepare({ title, subtitle, date }) {
                        return {
                            title: title,
                            subtitle: `${subtitle || 'Unknown'} - ${date ? new Date(date).toLocaleDateString() : ''}`
                        };
                    }
                }
            }],
        }),

        // ========================================
        // ORDER TRACKING (Collapsible)
        // ========================================
        defineField({
            name: 'lastReceived',
            title: 'Last Received',
            type: 'datetime',
            fieldset: 'orderTracking',
        }),
        defineField({
            name: 'requestedAt',
            title: 'Requested At',
            type: 'datetime',
            fieldset: 'orderTracking',
        }),
        defineField({
            name: 'orderedAt',
            title: 'Ordered At',
            type: 'datetime',
            fieldset: 'orderTracking',
        }),
        defineField({
            name: 'requestedQuantity',
            title: 'Quantity Requested',
            type: 'number',
            fieldset: 'orderTracking',
        }),

        // ========================================
        // EQUIPMENT-SPECIFIC FIELDS
        // ========================================
        defineField({
            name: 'serialNumber',
            title: 'Serial Number',
            type: 'string',
            fieldset: 'equipmentDetails',
            hidden: ({ parent }) => parent?.category !== 'Equipment',
        }),
        defineField({
            name: 'equipmentStatus',
            title: 'Equipment Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Working', value: 'Working' },
                    { title: 'Finicky', value: 'Finicky' },
                    { title: 'Broken', value: 'Broken' },
                    { title: 'Repair Requested', value: 'Repair Requested' },
                ],
                layout: 'radio',
            },
            initialValue: 'Working',
            fieldset: 'equipmentDetails',
            hidden: ({ parent }) => parent?.category !== 'Equipment',
        }),
        defineField({
            name: 'requestNote',
            title: 'Request Note (Issue/Reason)',
            type: 'text',
            rows: 2,
            hidden: true, // Internal field for passing issue description to ordering page
        }),
        defineField({
            name: 'serviceDate',
            title: 'Last Service Date',
            type: 'date',
            fieldset: 'equipmentDetails',
            hidden: ({ parent }) => parent?.category !== 'Equipment',
        }),
        defineField({
            name: 'manualUrl',
            title: 'Manual URL',
            type: 'url',
            fieldset: 'equipmentDetails',
            hidden: ({ parent }) => parent?.category !== 'Equipment',
        }),
        defineField({
            name: 'repairedAt',
            title: 'Repaired At',
            type: 'datetime',
            fieldset: 'equipmentDetails',
            hidden: ({ parent }) => parent?.category !== 'Equipment',
        }),
        defineField({
            name: 'calendarUrl',
            title: 'Booking Calendar URL',
            type: 'url',
            fieldset: 'equipmentDetails',
            hidden: ({ parent }) => parent?.category !== 'Equipment',
        }),
        defineField({
            name: 'maintenanceLogs',
            title: 'Maintenance Logs',
            type: 'array',
            fieldset: 'equipmentDetails',
            hidden: ({ parent }) => parent?.category !== 'Equipment',
            of: [{
                type: 'object',
                name: 'logEntry',
                title: 'Log Entry',
                fields: [
                    { name: 'date', title: 'Date', type: 'date', validation: (Rule: any) => Rule.required() },
                    { name: 'description', title: 'Description', type: 'text', rows: 2 },
                    { name: 'performedBy', title: 'Performed By', type: 'string' },
                ],
                preview: {
                    select: { title: 'description', subtitle: 'date' },
                },
            }],
        }),
    ],

    // ========================================
    // PREVIEW
    // ========================================
    preview: {
        select: {
            title: 'name',
            category: 'category',
            location: 'location',
            media: 'image',
        },
        prepare({ title, category, location, media }) {
            return {
                title: title || 'Untitled',
                subtitle: `${category || 'No Category'} | ${location || 'No Location'}`,
                media,
            };
        },
    },
});
