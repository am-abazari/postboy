"use client";

import { ExtendedTabItem } from "../types";

interface UrlPanelProps {
  currentTab: ExtendedTabItem;
  updateCurrentTab: (fields: Partial<ExtendedTabItem>) => void;
  handleClearAll: () => void;
  handleSend: () => void;
  clsCard: string;
  isDark: boolean;
}

export default function UrlPanel({
  currentTab,
  updateCurrentTab,
  handleClearAll,
  handleSend,
  clsCard,
  isDark,
}: UrlPanelProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={`flex gap-2 p-1.5 rounded-xl border ${clsCard}`}>
        <select
          value={currentTab.method}
          onChange={(e) => updateCurrentTab({ method: e.target.value })}
          className={`rounded-lg px-3.5 py-1.5 font-bold text-xs focus:outline-none cursor-pointer uppercase ${isDark ? "bg-zinc-800 border border-zinc-700 text-orange-400 focus:border-orange-500" : "bg-slate-100 border border-slate-200 text-orange-600 focus:border-orange-600"}`}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
        <input
          type="text"
          value={currentTab.url}
          onChange={(e) => updateCurrentTab({ url: e.target.value })}
          placeholder="Enter Request URL (e.g. https://api.example.com/v1/resource)"
          className="flex-1 bg-transparent px-2 text-xs focus:outline-none font-mono"
        />
        <button
          onClick={handleClearAll}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${isDark ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
        >
          Reset
        </button>
        <button
          onClick={handleSend}
          disabled={currentTab.loading}
          className="bg-orange-600 hover:bg-orange-500 disabled:bg-orange-800 transition-colors px-5 py-1.5 rounded-lg font-semibold text-xs text-white shadow flex items-center gap-2"
        >
          {currentTab.loading ? (
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Send"
          )}
        </button>
      </div>
      {currentTab.validationError && (
        <p className="text-[11px] text-red-500 font-medium px-2">
          ⚠️ {currentTab.validationError}
        </p>
      )}
    </div>
  );
}
