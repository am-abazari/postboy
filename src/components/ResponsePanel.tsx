'use client';

import {ExtendedTabItem} from '../types';

interface ResponsePanelProps {
    currentTab: ExtendedTabItem;
    clsCard: string;
    clsTerminal: string;
    isDark: boolean;
}

export default function ResponsePanel({currentTab, clsCard, clsTerminal, isDark}: ResponsePanelProps) {
    return (
        <div className={`rounded-xl border flex flex-col flex-1 min-h-[220px] overflow-hidden ${clsCard}`}>
            <div
                className={`flex justify-between items-center px-4 py-2.5 border-b ${isDark ? 'border-zinc-800 bg-zinc-900/30' : 'border-slate-200 bg-slate-50'}`}>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Response Panel</span>
                {currentTab.response && (
                    <div className="flex gap-4 text-[11px] font-mono">
                        <div>Status: <span
                            className={currentTab.response.status >= 200 && currentTab.response.status < 300 ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold'}>{currentTab.response.status} {currentTab.response.statusText}</span>
                        </div>
                        <div className="text-zinc-400">Time: <span
                            className="text-orange-500">{currentTab.response.time} ms</span></div>
                    </div>
                )}
            </div>

            <div className={`flex-1 p-3 overflow-auto font-mono text-xs ${clsTerminal}`}>
                {currentTab.loading && (
                    <div className="h-full flex items-center justify-center text-zinc-400 gap-2 text-xs">
                        <span
                            className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"/> Sending
                        Request...
                    </div>
                )}
                {!currentTab.loading && !currentTab.response && (
                    <div className="h-full flex items-center justify-center text-zinc-500 italic text-xs">Enter a valid
                        URL and click Send to see the actual server response.</div>
                )}
                {!currentTab.loading && currentTab.response && (
                    <pre
                        className={`w-full h-full p-1 overflow-x-auto whitespace-pre-wrap ${currentTab.response.error ? (isDark ? 'text-red-400 font-medium' : 'text-red-600 font-medium') : (isDark ? 'text-emerald-400' : 'text-emerald-700')}`}>
            {currentTab.response.error ? currentTab.response.error : JSON.stringify(currentTab.response.data, null, 2)}
          </pre>
                )}
            </div>
        </div>
    );
}