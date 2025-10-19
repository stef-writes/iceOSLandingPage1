import React, { useEffect, useMemo, useState } from "react";
import { toast } from "../hooks/use-toast";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../components/ui/dropdown-menu";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../components/ui/tooltip";
import { MoreHorizontal, Send, CheckCircle2, Archive as ArchiveIcon, RefreshCw, Filter as FilterIcon, Copy as CopyIcon } from "lucide-react";
import { fetchWaitlist } from "../lib/api";
import Nav from "../components/Nav";
import { Toaster } from "../components/ui/toaster";

function AdminWaitlist() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState({});
  const [busyId, setBusyId] = useState("");
  const [autoSeeded, setAutoSeeded] = useState(false);

  const csvUrl = useMemo(() => {
    const base = import.meta.env?.VITE_API_BASE || "/api";
    const keyParam = adminKey ? `?key=${encodeURIComponent(adminKey)}` : "";
    return `${base}/waitlist/export.csv${keyParam}`;
  }, [adminKey]);

  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [sort, setSort] = useState({ key: "created_at", dir: "desc" });
  const [inviteCount, setInviteCount] = useState(10);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const base = import.meta.env?.VITE_API_BASE || "/api";
      const params = new URLSearchParams();
      if (adminKey) params.set("key", adminKey);
      if (status) params.set("status", status);
      params.set("limit", "10000");
      const url = `${base}/waitlist?${params.toString()}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
      const data = await resp.json();
      const arr = Array.isArray(data) ? data : [];
      setEntries(arr);
      if (!autoSeeded && arr.length === 0) {
        // Dev fallback: try seeding mock data once if backend returns empty
        try {
          await fetch(`${base}/mock/seed`, { method: 'POST' });
          setAutoSeeded(true);
          const resp2 = await fetch(url);
          if (resp2.ok) {
            const data2 = await resp2.json();
            setEntries(Array.isArray(data2) ? data2 : []);
          }
        } catch {}
      }
    } catch (e) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  // Build visible list using client-side filters so results update immediately
  let visible = [...entries];
  if (status) visible = visible.filter((e) => e.status === status);
  if (search) {
    const q = search.toLowerCase();
    visible = visible.filter((e) =>
      (e.email || "").toLowerCase().includes(q) ||
      (e.role || "").toLowerCase().includes(q) ||
      (e.usecase || "").toLowerCase().includes(q)
    );
  }
  if (keyword) {
    const kq = keyword.toLowerCase();
    visible = visible.filter((e) => Array.isArray(e.keywords) && e.keywords.some((k)=>String(k).toLowerCase().includes(kq)));
  }

  const sorted = [...visible].sort((a, b) => {
    const { key, dir } = sort;
    const va = a[key];
    const vb = b[key];
    let cmp = 0;
    if (key === 'created_at') cmp = new Date(va) - new Date(vb);
    else cmp = String(va || '').localeCompare(String(vb || ''));
    return dir === 'asc' ? cmp : -cmp;
  });

  const toPaginate = sorted;
  const totalPages = Math.max(1, Math.ceil(toPaginate.length / pageSize));
  const pageItems = toPaginate.slice((page - 1) * pageSize, page * pageSize);

  const toggleAll = (checked) => {
    const next = {};
    if (checked) pageItems.forEach((e) => (next[e.id] = true));
    setSelected(next);
  };

  const selectedIds = Object.keys(selected).filter((k) => selected[k]);

  const batch = async (kind) => {
    try {
      setBusyId("batch");
      if (kind === 'invite') {
        for (const e of filtered) if (selected[e.id]) await invite(e.email);
      } else if (kind === 'activate') {
        for (const e of filtered) if (selected[e.id]) await activate(e.id);
      } else if (kind === 'archive') {
        for (const e of filtered) if (selected[e.id]) await archive(e.id);
      } else if (kind === 'resend') {
        for (const e of filtered) if (selected[e.id]) await resendVerification(e.id);
      }
      await load();
    } catch (e) {
      alert(`Batch ${kind} failed: ${e.message || e}`);
    } finally {
      setBusyId("");
    }
  };

  const seedMock = async () => {
    try {
      setBusyId('seed');
      const base = import.meta.env?.VITE_API_BASE || "/api";
      await fetch(`${base}/mock/seed`, { method: 'POST' });
      toast({ title: 'Mock data seeded' });
      await load();
    } catch (e) {
      toast({ title: 'Seeding failed', description: String(e) });
    } finally {
      setBusyId('');
    }
  };

  const clearMock = async () => {
    try {
      setBusyId('clear');
      const base = import.meta.env?.VITE_API_BASE || "/api";
      await fetch(`${base}/mock/clear`, { method: 'POST' });
      toast({ title: 'Mock data cleared' });
      await load();
    } catch (e) {
      toast({ title: 'Clear failed', description: String(e) });
    } finally {
      setBusyId('');
    }
  };

  const call = async (path, init = {}) => {
    const base = import.meta.env?.VITE_API_BASE || "/api";
    const headers = init.headers || {};
    if (adminKey) headers["X-Admin-Key"] = adminKey;
    const resp = await fetch(`${base}${path}`, { ...init, headers });
    if (!resp.ok) throw new Error(await resp.text());
    const text = await resp.text();
    try { return JSON.parse(text || "null"); } catch { return text; }
  };

  const invite = async (email) => {
    try {
      setBusyId(email);
      const data = await call(`/waitlist/invite`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      toast({ title: "Invite created", description: data.invite_link || "Link generated" });
      if (data.invite_link) await navigator.clipboard?.writeText(data.invite_link).catch(() => {});
      await load();
    } catch (e) {
      toast({ title: "Invite failed", description: e.message || String(e) });
    } finally {
      setBusyId("");
    }
  };

  const activate = async (id) => {
    try {
      setBusyId(id);
      // Activation is usually via token, but admin can force set_status=active
      if (!confirm("Activate this user?")) return;
      await call(`/waitlist`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "set_status", value: "active" }) });
      toast({ title: "Activated" });
      await load();
    } catch (e) {
      toast({ title: "Activate failed", description: e.message || String(e) });
    } finally {
      setBusyId("");
    }
  };

  const archive = async (id) => {
    try {
      setBusyId(id);
      if (!confirm("Archive this user?")) return;
      await call(`/waitlist`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "set_status", value: "archived" }) });
      toast({ title: "Archived" });
      await load();
    } catch (e) {
      toast({ title: "Archive failed", description: e.message || String(e) });
    } finally {
      setBusyId("");
    }
  };

  const resendVerification = async (id) => {
    try {
      setBusyId(id);
      const data = await call(`/waitlist`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "resend_verification" }) });
      if (data?.verify_token) {
        const base = window.location.origin;
        const link = `${base}/verify?token=${encodeURIComponent(data.verify_token)}`;
        await navigator.clipboard?.writeText(link).catch(() => {});
        toast({ title: "Verification link copied", description: link });
      } else {
        toast({ title: "Verification resent" });
      }
    } catch (e) {
      toast({ title: "Resend failed", description: e.message || String(e) });
    } finally {
      setBusyId("");
    }
  };

  useEffect(() => {
    // Optional: auto-fetch if ADMIN_KEY provided via hash like #key=...
    try {
      const u = new URL(window.location.href);
      const hash = new URLSearchParams(u.hash?.replace(/^#/, ""));
      const k = hash.get("key");
      if (k) setAdminKey(k);
    } catch {}
    // load persisted filters
    try {
      const persisted = JSON.parse(localStorage.getItem('adminWaitlistFilters') || '{}');
      if (persisted.status) setStatus(persisted.status);
      if (persisted.search) setSearch(persisted.search);
      if (persisted.keyword) setKeyword(persisted.keyword);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('adminWaitlistFilters', JSON.stringify({ status, search, keyword }));
    } catch {}
  }, [status, search, keyword]);

  return (
    <div className="dark theme-ice min-h-screen bg-[#0C0812]">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(1200px_500px_at_80%_-10%,rgba(174,60,224,0.10),transparent)]" />
      <Nav />
      <main className="relative mx-auto max-w-7xl px-6 py-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-white/90">Waitlist Admin</h1>
          <a
            href={csvUrl}
            className="inline-flex items-center px-3 py-2 rounded border border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            Download CSV
          </a>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button disabled={page<=1} onClick={() => setPage((p)=>Math.max(1,p-1))} className="text-xs px-2 py-1 rounded border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-50">Prev</button>
            <button disabled={page>=totalPages} onClick={() => setPage((p)=>Math.min(totalPages,p+1))} className="text-xs px-2 py-1 rounded border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-50">Next</button>
          </div>
          <a
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(`id,email,role,usecase,keywords,created_at,status,source,utm_source,utm_medium,utm_campaign,utm_term,utm_content` + "\n" + toPaginate.map(d => [d.id,d.email,d.role||'',String(d.usecase||'').replace(/\n/g,' '),(Array.isArray(d.keywords)?d.keywords.join('|'):''),d.created_at||'',d.status||'',d.source||'',d.utm_source||'',d.utm_medium||'',d.utm_campaign||'',d.utm_term||'',d.utm_content||''].join(',')).join('\n'))}`}
            download="waitlist_filtered.csv"
            className="text-xs px-2 py-1 rounded border border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            Download filtered CSV
          </a>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <button onClick={seedMock} disabled={busyId==='seed'} className="text-xs px-2 py-1 rounded border border-white/10 bg-white/5 text-white hover:bg-white/10">Seed mock data</button>
          <button onClick={clearMock} disabled={busyId==='clear'} className="text-xs px-2 py-1 rounded border border-white/10 bg-white/5 text-white hover:bg-white/10">Clear mock data</button>
        </div>

        <div className="grid gap-3 sm:grid-cols-4 mb-2">
          <input
            type="password"
            placeholder="Admin key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className="rounded px-3 py-2 bg-black/40 border border-white/10 text-white placeholder:text-white/40"
          />
          <input
            type="text"
            placeholder="Search email/role/use case"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded px-3 py-2 bg-black/40 border border-white/10 text-white placeholder:text-white/40"
          />
          <input
            type="text"
            placeholder="Keyword (e.g., ai, onboarding)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="rounded px-3 py-2 bg-black/40 border border-white/10 text-white placeholder:text-white/40"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded px-3 py-2 bg-black/40 border border-white/10 text-white"
          >
            <option value="">All statuses</option>
            <option value="pending">pending</option>
            <option value="verified">verified</option>
            <option value="invited">invited</option>
            <option value="active">active</option>
            <option value="archived">archived</option>
          </select>
          <button
            onClick={load}
            disabled={loading}
            className="rounded px-3 py-2 border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load entries"}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
        {['pending','verified','invited','active','archived'].map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`text-xs px-2 py-1 rounded border border-white/10 ${status===s? 'bg-white/20 text-white':'bg-white/5 text-white hover:bg-white/10'}`}>{s}</button>
        ))}
        <button onClick={() => setStatus('')} className={`text-xs px-2 py-1 rounded border border-white/10 ${status===''? 'bg-white/20 text-white':'bg-white/5 text-white hover:bg-white/10'}`}>all</button>
        <div className="ml-auto text-xs text-white/60">{toPaginate.length} results • page {page}/{totalPages}</div>
      </div>

        <div className="flex items-center gap-2 mb-3">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" onChange={(e) => toggleAll(e.target.checked)} />
          <span className="text-white/70">Select all in view</span>
          <span className="text-xs text-white/60">({selectedIds.length})</span>
        </label>
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center justify-center w-8 h-8 rounded border border-white/10 bg-white/5 hover:bg-white/10 text-white" aria-label="Bulk actions">
                    <FilterIcon className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Bulk actions</TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
              <DropdownMenuItem disabled={!selectedIds.length || busyId==='batch'} onClick={() => batch('invite')}><Send className="w-4 h-4" /> Invite selected</DropdownMenuItem>
              <DropdownMenuItem disabled={!selectedIds.length || busyId==='batch'} onClick={() => batch('activate')}><CheckCircle2 className="w-4 h-4" /> Activate selected</DropdownMenuItem>
              <DropdownMenuItem disabled={!selectedIds.length || busyId==='batch'} onClick={() => batch('archive')}><ArchiveIcon className="w-4 h-4" /> Archive selected</DropdownMenuItem>
              <DropdownMenuItem disabled={!selectedIds.length || busyId==='batch'} onClick={() => batch('resend')}><RefreshCw className="w-4 h-4" /> Resend verification</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={!selectedIds.length} onClick={() => {
                const emails = filtered.filter(e => selected[e.id]).map(e => e.email).join(', ');
                navigator.clipboard?.writeText(emails).then(() => toast({ title: 'Emails copied'})).catch(() => window.prompt('Copy emails', emails));
              }}>
                <CopyIcon className="w-4 h-4" /> Copy emails
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
        <div className="inline-flex items-center gap-1 text-xs ml-auto">
          <input value={inviteCount} onChange={(e)=>setInviteCount(Number(e.target.value)||0)} type="number" min="1" className="w-16 rounded px-2 py-1 bg-black/40 border border-white/10 text-white" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={async ()=>{
                  setBusyId('batch');
                  try {
                    let count = 0;
                    for (const e of sorted) {
                      if (status && e.status !== status) continue;
                      await invite(e.email);
                      count++;
                      if (count>=inviteCount) break;
                    }
                    toast({ title: `Invited ${count}` });
                  } catch (e) {
                    toast({ title: "Batch invite error", description: String(e) });
                  } finally {
                    setBusyId('');
                  }
                }} className="inline-flex items-center justify-center w-8 h-8 rounded border border-white/10 bg-white/5 hover:bg-white/10 text-white" aria-label="Invite next N">
                  <Send className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Invite next N</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        </div>

        {error && (
          <div className="text-red-300 text-sm mb-3">{error}</div>
        )}

        <div className="overflow-x-auto border border-white/10 rounded">
          <table className="min-w-full text-sm text-white">
            <thead className="bg-white/5 sticky top-0 z-10">
            <tr>
                <th className="text-left px-3 py-2"></th>
                <th className="text-left px-3 py-2 cursor-pointer" onClick={() => setSort({ key: 'created_at', dir: sort.key==='created_at' && sort.dir==='desc' ? 'asc':'desc' })}>Created {sort.key==='created_at' ? (sort.dir==='asc'?'↑':'↓'):''}</th>
                <th className="text-left px-3 py-2 cursor-pointer" onClick={() => setSort({ key: 'email', dir: sort.key==='email' && sort.dir==='asc' ? 'desc':'asc' })}>Email {sort.key==='email' ? (sort.dir==='asc'?'↑':'↓'):''}</th>
                <th className="text-left px-3 py-2">Domain</th>
                <th className="text-left px-3 py-2">Role</th>
                <th className="text-left px-3 py-2">Use case</th>
                <th className="text-left px-3 py-2">Source / UTM</th>
                <th className="text-left px-3 py-2">Status</th>
            </tr>
            </thead>
            <tbody>
            {pageItems.map((e, idx) => (
              <tr key={e.id} className={`border-t border-white/10 ${idx % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}`}>
                <td className="px-3 py-2"><input type="checkbox" checked={!!selected[e.id]} onChange={(ev) => setSelected({ ...selected, [e.id]: ev.target.checked })} /></td>
                <td className="px-3 py-2 whitespace-nowrap text-white/90">{new Date(e.created_at).toLocaleString()}</td>
                <td className="px-3 py-2 text-white/90">{e.email}</td>
                <td className="px-3 py-2 text-white/80">{(e.email||'').split('@')[1] || ''}</td>
                <td className="px-3 py-2 text-white/80">{e.role || ""}</td>
                <td className="px-3 py-2 max-w-md truncate text-white/80" title={e.usecase || ""}>{e.usecase || ""}
                  {Array.isArray(e.keywords) && e.keywords.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1 text-[10px]">
                      {e.keywords.map((k)=> (
                        <span key={k} className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 border border-white/10">{k}</span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 text-xs text-white/60">
                  <div className="truncate max-w-xs" title={e.source || ''}>src: {e.source || ''}</div>
                  <div className="truncate max-w-xs" title={`${e.utm_source||''}/${e.utm_medium||''}/${e.utm_campaign||''}`}>utm: {e.utm_source||''}/{e.utm_medium||''}/{e.utm_campaign||''}</div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      e.status==='active' ? 'bg-primary/15 text-primary' :
                      e.status==='invited' ? 'bg-accent/15 text-accent' :
                      e.status==='verified' ? 'bg-product/15 text-product' :
                      e.status==='pending' ? 'bg-muted text-muted-foreground' :
                      'bg-secondary text-muted-foreground'
                    }`}>{e.status || ""}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="inline-flex items-center justify-center w-8 h-8 rounded border border-white/10 bg-white/5 hover:bg-white/10 text-white" aria-label="Row actions" disabled={busyId===e.id}>
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => invite(e.email)}><Send className="w-4 h-4" /> Invite</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => activate(e.id)}><CheckCircle2 className="w-4 h-4" /> Activate</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => resendVerification(e.id)}><RefreshCw className="w-4 h-4" /> Resend verification</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => archive(e.id)}><ArchiveIcon className="w-4 h-4" /> Archive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && entries.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-white/60" colSpan={5}>No entries</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </main>
      <Toaster />
    </div>
  );
}

export default AdminWaitlist;


