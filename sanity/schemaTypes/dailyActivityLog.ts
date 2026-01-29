import { defineField, defineType } from "sanity";

export const dailyActivityLog = defineType({
    name: "dailyActivityLog",
    title: "Daily Activity Log",
    type: "document",
    fields: [
        defineField({
            name: "date",
            title: "Date",
            type: "date",
            options: {
                dateFormat: "YYYY-MM-DD",
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "events",
            title: "Events",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        { name: "timestamp", type: "datetime" },
                        { name: "user", type: "string" },
                        { name: "action", type: "string" },
                        { name: "target", type: "string" },
                        { name: "details", type: "string" },
                        { name: "itemId", type: "string" },
                    ],
                    preview: {
                        select: {
                            title: "action",
                            subtitle: "user",
                        },
                    },
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: "date",
            subtitle: "events.length",
        },
        prepare(selection) {
            const { title, subtitle } = selection;
            return {
                title: title,
                subtitle: `${subtitle || 0} events`,
            };
        },
    },
});
