'use client';

import {CollectionItem, HistoryItem} from '../types';

interface SidebarProps {
    collections: CollectionItem[];
    history: HistoryItem[];
    expandedCols: Record<string, boolean>;
    editingColId: string | null;
    editingColName: string;
    editingReqId: string | null;
    editingReqName: string;
    newCollectionName: string;
    setNewCollectionName: (val: string) => void;
    toggleCollection: (id: string) => void;
    handleCreateCollection: () => void;
    handleDeleteCollection: (id: string, e: React.MouseEvent) => void;
    handleStartRenameCollection: (id: string, name: string, e: React.MouseEvent) => void;
    handleSaveCollectionName: (id: string, e: React.MouseEvent) => void;
    setEditingColId: (id: string | null) => void;
    setEditingColName: (val: string) => void;
    handleDeleteRequest: (colId: string, reqId: string, e: React.MouseEvent) => void;
    handleStartRenameRequest: (id: string, name: string, e: React.MouseEvent) => void;
    handleSaveRequestName: (colId: string, reqId: string, e: React.MouseEvent) => void;
    setEditingReqId: (id: string | null) => void;
    setEditingReqName: (val: string) => void;
    addRequestToCollection: (colId: string) => void;
    loadSavedRequest: (req: any, colId?: string) => void;
    exportCollections: () => void;
    handleImportCollections: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isDark: boolean;
    clsAside: string;
    clsInput: string;
    clsMuted: string;
}

export default function Sidebar({
                                    collections,
                                    history,
                                    expandedCols,
                                    editingColId,
                                    editingColName,
                                    editingReqId,
                                    editingReqName,
                                    newCollectionName,
                                    setNewCollectionName,
                                    toggleCollection,
                                    handleCreateCollection,
                                    handleDeleteCollection,
                                    handleStartRenameCollection,
                                    handleSaveCollectionName,
                                    setEditingColId,
                                    setEditingColName,
                                    handleDeleteRequest,
                                    handleStartRenameRequest,
                                    handleSaveRequestName,
                                    setEditingReqId,
                                    setEditingReqName,
                                    addRequestToCollection,
                                    loadSavedRequest,
                                    exportCollections,
                                    handleImportCollections,
                                    isDark,
                                    clsAside,
                                    clsInput,
                                    clsMuted
                                }: SidebarProps) {
    return (
        <aside
            className={`w-full md:w-80 border-b md:border-b-0 md:border-r p-4 flex flex-col gap-4 h-auto md:h-full shrink-0 ${clsAside}`}>
            <div
                className={`p-3 rounded-lg border flex flex-col gap-2 shrink-0 ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <span className={`text-xs font-semibold block mb-1 ${clsMuted}`}>مدیریت مجموعه‌ها (JSON)</span>
                <div className="flex gap-2">
                    <button onClick={exportCollections}
                            className={`flex-1 py-1.5 px-2 rounded text-xs transition ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>خروجی
                        (Export)
                    </button>
                    <label
                        className={`flex-1 py-1.5 px-2 rounded text-xs text-center cursor-pointer transition ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                        ورود (Import)
                        <input type="file" accept=".json" onChange={handleImportCollections} className="hidden"/>
                    </label>
                </div>
            </div>

            <div className="flex flex-col gap-2 flex-initial min-h-0 overflow-hidden">
                <span className={`text-xs font-semibold ${clsMuted}`}>مجموعه‌ها (Collections)</span>
                <div className="flex gap-1.5 shrink-0">
                    <input type="text" placeholder="نام مجموعه جدید..." value={newCollectionName}
                           onChange={e => setNewCollectionName(e.target.value)}
                           className={`border rounded px-2.5 py-1 text-xs flex-1 focus:outline-none ${clsInput}`}/>
                    <button onClick={handleCreateCollection}
                            className="bg-orange-600 hover:bg-orange-500 text-white px-3 rounded text-xs transition">+
                    </button>
                </div>

                <div className="flex flex-col gap-2 mt-1 flex-1 overflow-y-auto pr-1">
                    {collections.map(col => {
                        const isExpanded = !!expandedCols[col.id];
                        const isEditingThisCol = editingColId === col.id;

                        return (
                            <div key={col.id}
                                 className={`p-2 rounded border ${isDark ? 'bg-zinc-950/40 border-zinc-850' : 'bg-white border-slate-200'}`}>
                                <div className="flex justify-between items-center mb-1 group">
                                    {isEditingThisCol ? (
                                        <div className="flex items-center gap-1 flex-1">
                                            <input type="text" value={editingColName}
                                                   onChange={e => setEditingColName(e.target.value)}
                                                   className={`text-[11px] px-1.5 py-0.5 rounded border focus:outline-none flex-1 ${clsInput}`}
                                                   autoFocus/>
                                            <button onClick={(e) => handleSaveCollectionName(col.id, e)}
                                                    className="text-xs text-emerald-500 px-1 font-bold">✓
                                            </button>
                                            <button onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingColId(null);
                                            }} className="text-xs text-red-500 px-1">✕
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button onClick={() => toggleCollection(col.id)}
                                                    className="flex items-center gap-1.5 text-xs font-medium focus:outline-none hover:text-orange-500 transition truncate flex-1 text-right">
                                                <span
                                                    className="text-[9px] text-zinc-500">{isExpanded ? '▼' : '►'}</span>
                                                <span className="truncate">📁 {col.name}</span>
                                            </button>
                                            <div
                                                className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0">
                                                <button
                                                    onClick={(e) => handleStartRenameCollection(col.id, col.name, e)}
                                                    className="text-[10px] hover:text-orange-500">✏️
                                                </button>
                                                <button onClick={(e) => handleDeleteCollection(col.id, e)}
                                                        className="text-[10px] hover:text-red-500">🗑️
                                                </button>
                                            </div>
                                            <button onClick={() => addRequestToCollection(col.id)}
                                                    className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded transition shrink-0 ${isDark ? 'bg-zinc-800 text-orange-400 hover:bg-zinc-700' : 'bg-slate-100 text-orange-600 hover:bg-slate-200'}`}>+
                                            </button>
                                        </>
                                    )}
                                </div>
                                {isExpanded && !isEditingThisCol && (
                                    <div
                                        className={`pl-3 border-l flex flex-col gap-1 mt-1.5 ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                                        {col.requests.map(req => {
                                            const isEditingThisReq = editingReqId === req.id;
                                            return (
                                                <div key={req.id}
                                                     className="flex justify-between items-center group/req py-0.5">
                                                    {isEditingThisReq ? (
                                                        <div className="flex items-center gap-1 flex-1">
                                                            <input type="text" value={editingReqName}
                                                                   onChange={e => setEditingReqName(e.target.value)}
                                                                   className={`text-[10px] px-1 py-0.5 rounded border focus:outline-none flex-1 ${clsInput}`}
                                                                   autoFocus/>
                                                            <button
                                                                onClick={(e) => handleSaveRequestName(col.id, req.id, e)}
                                                                className="text-[10px] text-emerald-500 font-bold">✓
                                                            </button>
                                                            <button onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditingReqId(null);
                                                            }} className="text-[10px] text-red-500">✕
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <button onClick={() => loadSavedRequest(req, col.id)}
                                                                    className={`text-left text-[11px] hover:text-orange-500 truncate flex-1 block ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                                                                <span
                                                                    className="text-orange-500 font-mono text-[9px] mr-1 inline-block w-8 uppercase">{req.method}</span> {req.name}
                                                            </button>
                                                            <div
                                                                className="flex items-center gap-1 opacity-0 group-hover/req:opacity-100 transition-opacity ml-1 shrink-0">
                                                                <button
                                                                    onClick={(e) => handleStartRenameRequest(req.id, req.name, e)}
                                                                    className="text-[9px] hover:text-orange-500">✏️
                                                                </button>
                                                                <button
                                                                    onClick={(e) => handleDeleteRequest(col.id, req.id, e)}
                                                                    className="text-[9px] hover:text-red-500">🗑️
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {col.requests.length === 0 && <span
                                            className="text-[10px] text-zinc-500 italic">درخواستی ایجاد نشده</span>}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div
                className="flex flex-col gap-1.5 flex-1 min-h-[160px] border-t pt-3 border-dashed border-zinc-850 overflow-hidden">
                <span className={`text-[11px] font-bold tracking-wide uppercase ${clsMuted}`}>تاریخچه (History)</span>
                <div
                    className={`rounded-lg p-1.5 border flex-1 overflow-y-auto flex flex-col gap-1 ${isDark ? 'bg-zinc-950/50 border-zinc-850' : 'bg-white border-slate-200 shadow-sm'}`}>
                    {history.map(hist => (
                        <button key={hist.id} onClick={() => loadSavedRequest({
                            method: hist.method,
                            url: hist.url,
                            name: 'New Request'
                        })}
                                className={`w-full text-left p-1 rounded flex flex-col border transition group ${isDark ? 'hover:bg-zinc-900 border-transparent hover:border-zinc-800' : 'hover:bg-slate-50 border-transparent hover:border-slate-200'}`}>
                            <div className="flex justify-between items-center w-full">
                                <span
                                    className={`text-[9px] font-mono font-bold ${hist.method === 'GET' ? 'text-emerald-500' : 'text-orange-500'}`}>{hist.method}</span>
                                <span className="text-[8px] text-zinc-500 font-mono">{hist.timestamp}</span>
                            </div>
                            <span
                                className={`text-[10px] font-mono truncate w-full block text-right ${isDark ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-slate-600 group-hover:text-slate-900'}`}>{hist.url}</span>
                        </button>
                    ))}
                    {history.length === 0 &&
                        <div className="text-[10px] text-zinc-500 italic text-center py-4 my-auto">تاریخچه‌ای
                            نیست</div>}
                </div>
            </div>
        </aside>
    );
}