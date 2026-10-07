/** Edit attributes added to content in preview: `entity.$.<field>` is spread onto an element so the CMS's editor can find the field. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Tags = Record<string, any>;
export type Tagged = { $?: Tags };

/** The edit attributes of one field of an entity (`{}` outside preview): `<h1 {...tag(post, "title")}>`. */
export const tag = (entity: Tagged | undefined, field: string): Tags => entity?.$?.[field] ?? {};
