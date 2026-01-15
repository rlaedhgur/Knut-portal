// src/components/DataTable.tsx
import React from "react";

export type Column<T> = {
  key: string;
  header: React.ReactNode;
  render: (row: T) => React.ReactNode;
  className?: string;
};

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  selectedKey,
  minWidth = 1000,
  maxHeight,
  theme,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectedKey?: string | null;
  minWidth?: number;
  maxHeight?: number; // ✅ 필요하면 내부 스크롤
  theme?: "portal" | string; //추가
}) {
  return (
    <div
      className="border border-neutral-300 rounded bg-white overflow-auto"
      style={maxHeight ? { maxHeight } : undefined}
    >
      <table className="w-full text-sm border-separate border-spacing-0" style={{ minWidth }}>
        <thead className="sticky top-0 z-10">
          <tr>
            {columns.map((c, idx) => (
              <th
                key={c.key}
                className={[
                  "bg-neutral-100 text-neutral-900 font-semibold",
                  "px-3 py-2 text-center",
                  "border-b border-neutral-300",
                  "border-r border-neutral-300",
                  idx === columns.length - 1 ? "border-r-0" : "",
                  c.className || "",
                ].join(" ")}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => {
            const k = rowKey(r);
            const selected = !!selectedKey && selectedKey === k;

            return (
              <tr
                key={k}
                onClick={() => onRowClick?.(r)}
                className={[
                  onRowClick ? "cursor-pointer" : "",
                  selected ? "bg-[#dbeafe]" : "hover:bg-neutral-50",
                ].join(" ")}
              >
                {columns.map((c, idx) => (
                  <td
                    key={c.key}
                    className={[
                      "px-3 py-2 text-neutral-900 text-center",
                      "border-b border-neutral-200",
                      "border-r border-neutral-200",
                      idx === columns.length - 1 ? "border-r-0" : "",
                      c.className || "",
                    ].join(" ")}
                  >
                    {c.render(r)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
