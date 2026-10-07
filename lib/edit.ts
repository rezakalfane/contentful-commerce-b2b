/** Edit tags added to content in preview: `entry.$.<field>` spreads Visual Editor `data-blok-*` attributes onto an element. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Tags = Record<string, any>;
export type Tagged = { $?: Tags };
