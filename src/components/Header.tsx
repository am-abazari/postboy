"use client";

interface HeaderProps {
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  isDark: boolean;
  clsHeader: string;
}

export default function Header({
  theme,
  setTheme,
  isDark,
  clsHeader,
}: HeaderProps) {
  return (
    <header
      className={`border-b px-6 py-3.5 flex justify-between items-center shrink-0 ${clsHeader}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)] animate-pulse" />
        <h1 className="text-md font-bold tracking-wider text-orange-500">
          POSTBOY{" "}
          <span
            className={`${isDark ? "text-zinc-500" : "text-slate-400"} font-normal text-xs`}
          >
            SHARIF HW2
          </span>
        </h1>
      </div>
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition duration-200 ${
          isDark
            ? "bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
            : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm"
        }`}
      >
        {isDark ? "☀️ حالت روشن" : "🌙 حالت تاریک"}
      </button>
    </header>
  );
}
