export default function SbrContextSwitcher() {

    const fallBack = "🇿🇼 ZIM";

    return (
        <div className="px-2 py-1 rounded-xl bg-slate-200 border dark:border-slate-800/40 border-slate-300 dark:bg-slate-800/40 " >
            <p className="text-md dark:text-slate-400 text-slate-700" >{fallBack}</p>
        </div>
    )
}
