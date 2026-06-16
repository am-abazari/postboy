"use client";

import { ExtendedTabItem } from "../types";

interface ParamsAndBodyPanelProps {
  currentTab: ExtendedTabItem;
  subTab: "params" | "headers" | "json" | "raw";
  setSubTab: (val: "params" | "headers" | "json" | "raw") => void;
  updateCurrentTab: (fields: Partial<ExtendedTabItem>) => void;
  updateRow: (
    type: "params" | "headers",
    index: number,
    field: "key" | "value",
    value: string,
  ) => void;
  removeRow: (type: "params" | "headers", index: number) => void;
  addRow: (type: "params" | "headers") => void;
  clsCard: string;
  clsInput: string;
  clsTabSubActive: string;
  isDark: boolean;
}

export default function ParamsAndBodyPanel({
  currentTab,
  subTab,
  setSubTab,
  updateCurrentTab,
  updateRow,
  removeRow,
  addRow,
  clsCard,
  clsInput,
  clsTabSubActive,
  isDark,
}: ParamsAndBodyPanelProps) {
  const isGet = currentTab.method === "GET";

  return (
    <div
      className={`rounded-xl border flex flex-col h-54 overflow-hidden ${clsCard}`}
    >
      <div
        className={`flex border-b overflow-x-auto ${isDark ? "border-zinc-800 bg-zinc-900/30" : "border-slate-200 bg-slate-50"}`}
      >
        <button
          onClick={() => setSubTab("params")}
          className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${subTab === "params" ? clsTabSubActive : "border-transparent text-zinc-500 hover:text-zinc-400"}`}
        >
          Parameters ({currentTab.params.filter((p) => p.key).length})
        </button>
        <button
          onClick={() => setSubTab("headers")}
          className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${subTab === "headers" ? clsTabSubActive : "border-transparent text-zinc-500 hover:text-zinc-400"}`}
        >
          Headers ({currentTab.headers.filter((h) => h.key).length})
        </button>
        <button
          onClick={() => {
            setSubTab("json");
            updateCurrentTab({ bodyType: "json" });
          }}
          className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${subTab === "json" ? clsTabSubActive : "border-transparent text-zinc-500 hover:text-zinc-400"} ${isGet ? "opacity-40 cursor-not-allowed" : ""}`}
          disabled={isGet}
        >
          Body JSON {isGet && "(Not for GET)"}
        </button>
        <button
          onClick={() => {
            setSubTab("raw");
            updateCurrentTab({ bodyType: "raw" });
          }}
          className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${subTab === "raw" ? clsTabSubActive : "border-transparent text-zinc-500 hover:text-zinc-400"} ${isGet ? "opacity-40 cursor-not-allowed" : ""}`}
          disabled={isGet}
        >
          Body Raw {isGet && "(Not for GET)"}
        </button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto">
        {subTab === "params" && (
          <div className="flex flex-col gap-1.5">
            {currentTab.params.map((param, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Key"
                  value={param.key}
                  onChange={(e) =>
                    updateRow("params", idx, "key", e.target.value)
                  }
                  className={`border rounded px-2.5 py-1 text-xs w-1/3 focus:outline-none font-mono ${clsInput}`}
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={param.value}
                  onChange={(e) =>
                    updateRow("params", idx, "value", e.target.value)
                  }
                  className={`border rounded px-2.5 py-1 text-xs flex-1 focus:outline-none font-mono ${clsInput}`}
                />
                <button
                  onClick={() => removeRow("params", idx)}
                  className="text-zinc-400 hover:text-red-500 p-1 text-xs transition"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => addRow("params")}
              className="text-[11px] text-orange-600 hover:text-orange-500 mt-1.5 self-start font-semibold"
            >
              + Add Parameter Row
            </button>
          </div>
        )}

        {subTab === "headers" && (
          <div className="flex flex-col gap-1.5">
            {currentTab.headers.map((header, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Header Key"
                  value={header.key}
                  onChange={(e) =>
                    updateRow("headers", idx, "key", e.target.value)
                  }
                  className={`border rounded px-2.5 py-1 text-xs w-1/3 focus:outline-none font-mono ${clsInput}`}
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={header.value}
                  onChange={(e) =>
                    updateRow("headers", idx, "value", e.target.value)
                  }
                  className={`border rounded px-2.5 py-1 text-xs flex-1 focus:outline-none font-mono ${clsInput}`}
                />
                <button
                  onClick={() => removeRow("headers", idx)}
                  className="text-zinc-400 hover:text-red-500 p-1 text-xs transition"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => addRow("headers")}
              className="text-[11px] text-orange-600 hover:text-orange-500 mt-1.5 self-start font-semibold"
            >
              + Add Header Row
            </button>
          </div>
        )}

        {subTab === "json" && (
          <textarea
            value={currentTab.bodyJson}
            onChange={(e) => updateCurrentTab({ bodyJson: e.target.value })}
            className={`w-full h-full font-mono text-xs p-2.5 rounded-lg border focus:outline-none resize-none transition-colors ${isDark ? "bg-zinc-950 border-zinc-800 text-emerald-400 focus:border-zinc-700" : "bg-white border-slate-200 text-emerald-700 focus:border-slate-300"}`}
            placeholder='{"key": "value"}'
          />
        )}

        {subTab === "raw" && (
          <textarea
            value={currentTab.bodyRaw}
            onChange={(e) => updateCurrentTab({ bodyRaw: e.target.value })}
            className={`w-full h-full font-mono text-xs p-2.5 rounded-lg border focus:outline-none resize-none transition-colors ${isDark ? "bg-zinc-950 border-zinc-800 text-zinc-200 focus:border-zinc-700" : "bg-white border-slate-200 text-slate-800 focus:border-slate-300"}`}
            placeholder="Enter plain/raw text payload here..."
          />
        )}
      </div>
    </div>
  );
}
