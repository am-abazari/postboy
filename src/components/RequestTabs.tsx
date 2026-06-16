"use client";

import { ExtendedTabItem } from "../types";

interface RequestTabsProps {
  tabs: ExtendedTabItem[];
  activeTabId: string;
  setActiveTabId: (id: string) => void;
  setTabs: (tabs: ExtendedTabItem[]) => void;
  handleAddNewTabFromSection: () => void;
  clsTabActive: string;
  isDark: boolean;
}

export default function RequestTabs({
  tabs,
  activeTabId,
  setActiveTabId,
  setTabs,
  handleAddNewTabFromSection,
  clsTabActive,
  isDark,
}: RequestTabsProps) {
  return (
    <div
      className={`flex items-center gap-1.5 border-b pb-1 overflow-x-auto ${isDark ? "border-zinc-800" : "border-slate-200"}`}
    >
      {tabs.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg border-t border-x text-xs font-medium cursor-pointer transition ${t.id === activeTabId ? clsTabActive : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-400"}`}
        >
          <span
            onClick={() => setActiveTabId(t.id)}
            className="truncate max-w-28"
          >
            {t.name}
          </span>
          {tabs.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const remaining = tabs.filter((tab) => tab.id !== t.id);
                setTabs(remaining);
                if (t.id === activeTabId) setActiveTabId(remaining[0].id);
              }}
              className="hover:text-red-500 text-[10px] ml-1"
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <button
        onClick={handleAddNewTabFromSection}
        className={`p-1 px-2.5 rounded text-xs transition ${isDark ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-400" : "bg-slate-200 hover:bg-slate-300 text-slate-600"}`}
      >
        +
      </button>
    </div>
  );
}
