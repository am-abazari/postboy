"use client";

import { useState, useEffect } from "react";
import {
  CollectionItem,
  HistoryItem,
  KeyValueItem,
  SavedRequest,
  ExtendedTabItem,
} from "./types";

// ایمپورت کامپوننت‌های تفکیک‌شده
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import RequestTabs from "@/components/RequestTabs";
import UrlPanel from "@/components/UrlPanel";
import ParamsAndBodyPanel from "@/components/ParamsAndBodyPanel";
import ResponsePanel from "@/components/ResponsePanel";

export default function PortmanContext() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [tabs, setTabs] = useState<ExtendedTabItem[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("");
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [expandedCols, setExpandedCols] = useState<Record<string, boolean>>({});

  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [editingColName, setEditingColName] = useState("");
  const [editingReqId, setEditingReqId] = useState<string | null>(null);
  const [editingReqName, setEditingReqName] = useState("");

  const [subTab, setSubTab] = useState<"params" | "headers" | "json" | "raw">(
    "params",
  );
  const [newCollectionName, setNewCollectionName] = useState("");
  const [mounted, setMounted] = useState(false);

  const createNewTab = (
    initialData?: Partial<ExtendedTabItem>,
  ): ExtendedTabItem => {
    const id = Math.random().toString(36).substring(7);
    return {
      id,
      name: initialData?.name || "New Request",
      method: initialData?.method || "GET",
      url: initialData?.url || "https://jsonplaceholder.typicode.com/todos/1",
      params: initialData?.params || [{ key: "", value: "" }],
      headers: initialData?.headers || [
        { key: "Content-Type", value: "application/json" },
      ],
      bodyJson: initialData?.bodyJson || '{"name": "Sharif"}', // ساختار جدید
      bodyRaw: initialData?.bodyRaw || "", // فیلد جدید
      bodyType: initialData?.bodyType || "json", // حالت پیش‌فرض
      response: null,
      loading: false,
      validationError: null,
      collectionId: initialData?.collectionId,
      requestId: initialData?.requestId,
    };
  };

  useEffect(() => {
    const localTheme = localStorage.getItem("portman_theme") as
      | "dark"
      | "light";
    const localTabs = localStorage.getItem("portman_tabs");
    const localCollections = localStorage.getItem("portman_collections");
    const localHistory = localStorage.getItem("portman_history");

    if (localTheme) setTheme(localTheme);

    if (localTabs) {
      const parsed = JSON.parse(localTabs);
      setTabs(parsed);
      if (parsed.length > 0) setActiveTabId(parsed[0].id);
    } else {
      const defaultTab = createNewTab();
      setTabs([defaultTab]);
      setActiveTabId(defaultTab.id);
    }

    if (localCollections) setCollections(JSON.parse(localCollections));
    if (localHistory) setHistory(JSON.parse(localHistory));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("portman_theme", theme);
  }, [theme, mounted]);
  useEffect(() => {
    if (mounted) localStorage.setItem("portman_tabs", JSON.stringify(tabs));
  }, [tabs, mounted]);
  useEffect(() => {
    if (mounted)
      localStorage.setItem("portman_collections", JSON.stringify(collections));
  }, [collections, mounted]);
  useEffect(() => {
    if (mounted)
      localStorage.setItem("portman_history", JSON.stringify(history));
  }, [history, mounted]);

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const updateCurrentTab = (fields: Partial<ExtendedTabItem>) => {
    setTabs((prevTabs) =>
      prevTabs.map((t) => (t.id === activeTabId ? { ...t, ...fields } : t)),
    );
    if (currentTab?.collectionId && currentTab?.requestId) {
      setCollections((prevCols) =>
        prevCols.map((c) => {
          if (c.id === currentTab.collectionId) {
            return {
              ...c,
              requests: c.requests.map((r) =>
                r.id === currentTab.requestId ? { ...r, ...fields } : r,
              ),
            };
          }
          return c;
        }),
      );
    }
  };

  const addRow = (type: "params" | "headers") => {
    if (!currentTab) return;
    const updatedRows = [...currentTab[type], { key: "", value: "" }];
    if (type === "params") {
      const urlWithParams = rebuildUrlWithParams(currentTab.url, updatedRows);
      updateCurrentTab({ params: updatedRows, url: urlWithParams });
    } else {
      updateCurrentTab({ headers: updatedRows });
    }
  };

  const updateRow = (
    type: "params" | "headers",
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    if (!currentTab) return;
    const updatedRows = [...currentTab[type]];
    updatedRows[index][field] = value;
    if (type === "params") {
      const urlWithParams = rebuildUrlWithParams(currentTab.url, updatedRows);
      updateCurrentTab({ params: updatedRows, url: urlWithParams });
    } else {
      updateCurrentTab({ headers: updatedRows });
    }
  };

  const removeRow = (type: "params" | "headers", index: number) => {
    if (!currentTab) return;
    let updatedRows = currentTab[type].filter((_, i) => i !== index);
    if (updatedRows.length === 0) updatedRows = [{ key: "", value: "" }];
    if (type === "params") {
      const urlWithParams = rebuildUrlWithParams(currentTab.url, updatedRows);
      updateCurrentTab({ params: updatedRows, url: urlWithParams });
    } else {
      updateCurrentTab({ headers: updatedRows });
    }
  };

  const rebuildUrlWithParams = (
    urlStr: string,
    paramsList: KeyValueItem[],
  ): string => {
    try {
      const base = urlStr.split("?")[0];
      const searchParams = new URLSearchParams();
      paramsList.forEach((p) => {
        if (p.key) searchParams.append(p.key, p.value);
      });
      const queryString = searchParams.toString();
      return queryString ? `${base}?${queryString}` : base;
    } catch {
      return urlStr;
    }
  };

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      updateCurrentTab({
        validationError: "فیلد آدرس URL نمی‌تواند خالی باشد!",
      });
      return false;
    }
    if (!/^https?:\/\/.+/i.test(url)) {
      updateCurrentTab({
        validationError:
          "ساختار آدرس نامعتبر است! آدرس باید با //:http یا //:https شروع شود.",
      });
      return false;
    }
    updateCurrentTab({ validationError: null });
    return true;
  };

  const handleSend = async () => {
    if (!currentTab || !validateUrl(currentTab.url)) return;
    setTabs(
      tabs.map((t) =>
        t.id === activeTabId ? { ...t, loading: true, response: null } : t,
      ),
    );
    try {
      // انتخاب بادی بر اساس نوع تب فعال شده در کانتکست درخواست
      const activeBodyPayload =
        currentTab.bodyType === "raw"
          ? currentTab.bodyRaw
          : currentTab.bodyJson;

      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: currentTab.url,
          method: currentTab.method,
          headers: currentTab.headers,
          body: currentTab.method !== "GET" ? activeBodyPayload : null,
        }),
      });
      const result = await res.json();
      setTabs(
        tabs.map((t) =>
          t.id === activeTabId ? { ...t, loading: false, response: result } : t,
        ),
      );

      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString("fa-IR"),
        method: currentTab.method,
        url: currentTab.url,
      };
      setHistory((prevHistory) =>
        [newHistoryItem, ...prevHistory].slice(0, 20),
      );
    } catch {
      setTabs(
        tabs.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                loading: false,
                response: {
                  status: 500,
                  statusText: "Internal Error",
                  time: 0,
                  data: null,
                  error: "خطا در ارتباط با پروکسی.",
                },
              }
            : t,
        ),
      );
    }
  };

  const handleClearAll = () => {
    if (!currentTab) return;
    updateCurrentTab({
      url: "",
      params: [{ key: "", value: "" }],
      headers: [{ key: "", value: "" }],
      bodyJson: "",
      bodyRaw: "",
      response: null,
      validationError: null,
    });
  };

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;
    const newCol: CollectionItem = {
      id: Math.random().toString(),
      name: newCollectionName,
      requests: [],
    };
    setCollections([...collections, newCol]);
    setNewCollectionName("");
  };

  const handleDeleteCollection = (colId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollections(collections.filter((c) => c.id !== colId));
    setTabs(
      tabs.map((t) =>
        t.collectionId === colId
          ? { ...t, collectionId: undefined, requestId: undefined }
          : t,
      ),
    );
  };

  const handleStartRenameCollection = (
    colId: string,
    currentName: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setEditingColId(colId);
    setEditingColName(currentName);
  };

  const handleSaveCollectionName = (colId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editingColName.trim()) return;
    setCollections(
      collections.map((c) =>
        c.id === colId ? { ...c, name: editingColName } : c,
      ),
    );
    setEditingColId(null);
  };

  const handleDeleteRequest = (
    colId: string,
    reqId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setCollections(
      collections.map((c) =>
        c.id === colId
          ? {
              ...c,
              requests: c.requests.filter((r) => r.id !== reqId),
            }
          : c,
      ),
    );
    setTabs(
      tabs.map((t) =>
        t.collectionId === colId && t.requestId === reqId
          ? {
              ...t,
              collectionId: undefined,
              requestId: undefined,
            }
          : t,
      ),
    );
  };

  const handleStartRenameRequest = (
    reqId: string,
    currentName: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setEditingReqId(reqId);
    setEditingReqName(currentName);
  };

  const handleSaveRequestName = (
    colId: string,
    reqId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    if (!editingReqName.trim()) return;
    setCollections(
      collections.map((c) =>
        c.id === colId
          ? {
              ...c,
              requests: c.requests.map((r) =>
                r.id === reqId ? { ...r, name: editingReqName } : r,
              ),
            }
          : c,
      ),
    );
    setTabs(
      tabs.map((t) =>
        t.collectionId === colId && t.requestId === reqId
          ? { ...t, name: editingReqName }
          : t,
      ),
    );
    setEditingReqId(null);
  };

  const addRequestToCollection = (colId: string) => {
    const newReqId = Math.random().toString();
    const newReq: SavedRequest = {
      id: newReqId,
      name: "New Saved Request",
      method: "GET",
      url: "https://jsonplaceholder.typicode.com/todos/1",
      params: [{ key: "", value: "" }],
      headers: [{ key: "Content-Type", value: "application/json" }],
      bodyJson: "",
      bodyRaw: "",
      bodyType: "json",
    };
    setCollections(
      collections.map((c) =>
        c.id === colId ? { ...c, requests: [...c.requests, newReq] } : c,
      ),
    );
    setExpandedCols((prev) => ({ ...prev, [colId]: true }));
  };

  const handleAddNewTabFromSection = () => {
    const lastCol = collections[collections.length - 1];
    const colId = lastCol ? lastCol.id : undefined;
    const requestId = Math.random().toString();
    const newTab = createNewTab({
      name: "New Request",
      collectionId: colId,
      requestId,
    });
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);

    if (lastCol) {
      const newReq: SavedRequest = {
        id: requestId,
        name: newTab.name,
        method: newTab.method,
        url: newTab.url,
        params: newTab.params,
        headers: newTab.headers,
        bodyJson: newTab.bodyJson,
        bodyRaw: newTab.bodyRaw,
        bodyType: newTab.bodyType,
      };
      setCollections((prevCols) =>
        prevCols.map((c) =>
          c.id === lastCol.id
            ? {
                ...c,
                requests: [...c.requests, newReq],
              }
            : c,
        ),
      );
      setExpandedCols((prev) => ({ ...prev, [lastCol.id]: true }));
    }
  };

  const toggleCollection = (colId: string) => {
    setExpandedCols((prev) => ({ ...prev, [colId]: !prev[colId] }));
  };

  const loadSavedRequest = (
    req: Partial<TabItem> & { id?: string },
    colId?: string,
  ) => {
    const existingTab = tabs.find(
      (t) => t.collectionId === colId && t.requestId === req.id,
    );
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return;
    }
    const newTab = createNewTab({
      ...req,
      collectionId: colId,
      requestId: req.id,
    });
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const exportCollections = () => {
    const blob = new Blob([JSON.stringify(collections, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portman-collections.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportCollections = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) setCollections([...collections, ...parsed]);
      } catch {
        alert("فایل JSON نامعتبر است.");
      }
    };
    reader.readAsText(file);
  };

  if (!mounted || tabs.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        در حال بارگذاری بسترهای لوکال...
      </div>
    );
  }

  const isDark = theme === "dark";
  const clsMain = isDark
    ? "bg-zinc-950 text-zinc-100"
    : "bg-slate-50 text-slate-900";
  const clsHeader = isDark
    ? "border-zinc-800 bg-zinc-900/40"
    : "border-slate-200 bg-white";
  const clsAside = isDark
    ? "bg-zinc-900/60 border-zinc-800"
    : "bg-slate-100/70 border-slate-200";
  const clsCard = isDark
    ? "bg-zinc-900 border-zinc-800"
    : "bg-white border-slate-200 shadow-sm";
  const clsInput = isDark
    ? "bg-zinc-950 border-zinc-800 text-zinc-200 focus:border-orange-500"
    : "bg-slate-50 border-slate-200 text-slate-800 focus:border-orange-500";
  const clsTabActive = isDark
    ? "bg-zinc-900 border-zinc-800 text-orange-400"
    : "bg-white border-slate-200 text-orange-600 font-bold";
  const clsTabSubActive = isDark
    ? "border-orange-500 text-orange-400"
    : "border-orange-600 text-orange-600 font-bold";
  const clsMuted = isDark ? "text-zinc-400" : "text-slate-500";
  const clsTerminal = isDark ? "bg-zinc-950" : "bg-slate-50";

  return (
    <div
      className={`h-screen flex flex-col font-sans antialiased transition-colors duration-200 overflow-hidden ${clsMain}`}
    >
      <Header
        theme={theme}
        setTheme={setTheme}
        isDark={isDark}
        clsHeader={clsHeader}
      />

      <div className="flex flex-1 flex-col md:flex-row overflow-y-auto md:overflow-hidden">
        <Sidebar
          collections={collections}
          history={history}
          expandedCols={expandedCols}
          editingColId={editingColId}
          editingColName={editingColName}
          editingReqId={editingReqId}
          editingReqName={editingReqName}
          newCollectionName={newCollectionName}
          setNewCollectionName={setNewCollectionName}
          toggleCollection={toggleCollection}
          handleCreateCollection={handleCreateCollection}
          handleDeleteCollection={handleDeleteCollection}
          handleStartRenameCollection={handleStartRenameCollection}
          handleSaveCollectionName={handleSaveCollectionName}
          setEditingColId={setEditingColId}
          setEditingColName={setEditingColName}
          handleDeleteRequest={handleDeleteRequest}
          handleStartRenameRequest={handleStartRenameRequest}
          handleSaveRequestName={handleSaveRequestName}
          setEditingReqId={setEditingReqId}
          setEditingReqName={setEditingReqName}
          addRequestToCollection={addRequestToCollection}
          loadSavedRequest={loadSavedRequest}
          exportCollections={exportCollections}
          handleImportCollections={handleImportCollections}
          isDark={isDark}
          clsAside={clsAside}
          clsInput={clsInput}
          clsMuted={clsMuted}
        />

        <main className="flex-1 p-5 flex flex-col gap-4 md:overflow-y-auto h-auto md:h-full shrink-0">
          <RequestTabs
            tabs={tabs}
            activeTabId={activeTabId}
            setActiveTabId={setActiveTabId}
            setTabs={setTabs}
            handleAddNewTabFromSection={handleAddNewTabFromSection}
            clsTabActive={clsTabActive}
            isDark={isDark}
          />

          <div className="flex gap-2 items-center">
            <span className="text-xs text-zinc-500 whitespace-nowrap">
              نام درخواست:
            </span>
            <input
              type="text"
              value={currentTab.name}
              onChange={(e) => updateCurrentTab({ name: e.target.value })}
              className={`bg-transparent text-xs border-b border-transparent focus:outline-none py-0.5 px-1 w-44 font-medium ${isDark ? "text-zinc-300 hover:border-zinc-800 focus:border-orange-500" : "text-slate-800 hover:border-slate-300 focus:border-orange-600"}`}
            />
          </div>

          <UrlPanel
            currentTab={currentTab}
            updateCurrentTab={updateCurrentTab}
            handleClearAll={handleClearAll}
            handleSend={handleSend}
            clsCard={clsCard}
            isDark={isDark}
          />

          <ParamsAndBodyPanel
            currentTab={currentTab}
            subTab={subTab}
            setSubTab={setSubTab}
            updateCurrentTab={updateCurrentTab}
            updateRow={updateRow}
            removeRow={removeRow}
            addRow={addRow}
            clsCard={clsCard}
            clsInput={clsInput}
            clsTabSubActive={clsTabSubActive}
            isDark={isDark}
          />

          <ResponsePanel
            currentTab={currentTab}
            clsCard={clsCard}
            clsTerminal={clsTerminal}
            isDark={isDark}
          />
        </main>
      </div>
    </div>
  );
}
