"use client";

/** A sort dropdown that submits its surrounding GET form as soon as the choice changes. */
export function SortSelect({ name, value, options, label }: { name: string; value: string; options: { value: string; label: string }[]; label: string }) {
  return (
    <label className="flex items-center gap-3 text-[0.95rem]">
      <span className="text-slate">{label}</span>
      <select
        name={name}
        defaultValue={value}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="field cursor-pointer py-2 pr-8 font-medium"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
