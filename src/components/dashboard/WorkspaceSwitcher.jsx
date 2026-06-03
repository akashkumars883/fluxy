"use client";

import { useDashboard } from "@/context/DashboardContext";
import { AnimatePresence,motion } from "framer-motion";
import { Check,ChevronDown,Edit3,FolderKanban,Plus,Settings2,Trash2,X } from "lucide-react";
import { useEffect,useRef,useState } from "react";

const AVATAR_COLORS = [
  "bg-indigo-600",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-600",
  "bg-sky-500",
];

export default function WorkspaceSwitcher({ variant = "sidebar", onUpgradeClick }) {
  const {
    workspaces,
    selectedWorkspace,
    setSelectedWorkspace,
    createWorkspace,
    renameWorkspace,
    deleteWorkspace,
    allAccounts,
    linkAccountToWorkspace,
    isSidebarCollapsed,
    workspaceMembers,
    workspaceMembersLoading,
    inviteMember,
    removeMember,
    updateMemberRole,
    currentPlan,
    setUpgradeReason
  } = useDashboard();

  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  
  // Creation state

  
  // Creation state
  const [newWsName, setNewWsName] = useState("");
  const [newWsColor, setNewWsColor] = useState(AVATAR_COLORS[0]);
  
  // Management state
  const [managingWs, setManagingWs] = useState(null);
  const [editWsName, setEditWsName] = useState("");

  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    await createWorkspace(newWsName.trim(), newWsColor);
    setNewWsName("");
    setShowCreateModal(false);
    setIsOpen(false);
  };

  const handleRename = async (e) => {
    e.preventDefault();
    if (!editWsName.trim() || !managingWs) return;
    await renameWorkspace(managingWs.id, editWsName.trim());
    setShowManageModal(false);
    setManagingWs(null);
  };


  const handleDelete = async (wsId) => {
    if (confirm("Are you sure you want to delete this workspace? All its accounts will be moved to your Personal Workspace.")) {
      await deleteWorkspace(wsId);
      setShowManageModal(false);
      setManagingWs(null);
    }
  };

  const getInitials = (name) => {
    return name ? name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "WS";
  };

  if (!selectedWorkspace) return null;

  const isMinimal = variant === "minimal";

  return (
    <div className={`relative z-40 ${isMinimal ? "w-auto" : "w-full"}`} ref={dropdownRef}>
      {/* Active Workspace Button */}
      {isMinimal ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-zinc-100/60 transition-all border border-transparent bg-transparent cursor-pointer"
        >
          <span className="text-xs font-bold text-zinc-800 leading-none whitespace-nowrap">
            {selectedWorkspace.name}
          </span>
          <ChevronDown size={12} className={`text-zinc-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      ) : (

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-2 rounded-2xl hover:bg-zinc-100/80 transition-all border border-[#e9e9eb]/40 bg-white/40 backdrop-blur-md shadow-sm ${
            isSidebarCollapsed ? "justify-center p-1.5" : "px-3 py-2.5"
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden w-full">
            {/* Workspace Avatar */}
            <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-zinc-100 ${selectedWorkspace.avatar_color || "bg-indigo-600"}`}>
              {getInitials(selectedWorkspace.name)}
            </div>
            
            {!isSidebarCollapsed && (
              <div className="flex flex-col text-left overflow-hidden flex-1 animate-in fade-in duration-200">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-0.5">Workspace</span>
                <span className="text-xs font-bold text-zinc-800 truncate leading-none">
                  {selectedWorkspace.name}
                </span>
              </div>
            )}
          </div>
          
          {!isSidebarCollapsed && (
            <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-300 mr-1 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
          )}
        </button>
      )}

      {/* Switcher Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute top-full mt-2 bg-white/95 backdrop-blur-2xl border border-[#e9e9eb] rounded-2xl shadow-2xl overflow-hidden p-2 w-64 z-50 ${
              isMinimal ? "right-0" : isSidebarCollapsed ? "left-0" : "left-0 w-full"
            }`}
          >

            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 py-2 border-b border-zinc-100/60 mb-1 flex items-center justify-between">
              <span>Switch Workspace</span>
              <FolderKanban size={10} className="text-zinc-400" />
            </div>

            {/* Workspaces List */}
            <div className="py-1 space-y-0.5 max-h-48 overflow-y-auto no-scrollbar">
              {workspaces.map((ws) => {
                const isSelected = ws.id === selectedWorkspace.id;
                return (
                  <div
                    key={ws.id}
                    className={`group w-full flex items-center justify-between rounded-xl transition-all ${
                      isSelected ? "bg-zinc-50 text-black font-semibold" : "hover:bg-zinc-50/80 text-zinc-600"
                    }`}
                  >
                    <button
                      onClick={() => {
                        setSelectedWorkspace(ws);
                        setIsOpen(false);
                      }}
                      className="flex-1 flex items-center gap-3 px-3 py-2 text-left"
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white font-bold text-[10px] ${ws.avatar_color || "bg-indigo-600"}`}>
                        {getInitials(ws.name)}
                      </div>
                      <span className="text-xs font-semibold truncate flex-1">{ws.name}</span>
                      {ws.is_shared && (
                        <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md mr-1 shrink-0">
                          Team
                        </span>
                      )}
                      {isSelected && <Check size={12} className="text-indigo-600 shrink-0" />}
                    </button>

                    {/* Manage Button */}
                    <button
                      onClick={() => {
                        setManagingWs(ws);
                        setEditWsName(ws.name);
                        setShowManageModal(true);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-zinc-200/60 rounded-xl text-zinc-400 hover:text-zinc-700 transition-all mr-1.5"
                      title="Workspace Settings"
                    >
                      <Settings2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Create Workspace CTA */}
            <div className="pt-2 border-t border-zinc-100/60 mt-1">
              <button
                onClick={() => {
                  if (currentPlan === "free") {
                    setUpgradeReason("multiple_workspaces");
                    if (onUpgradeClick) onUpgradeClick("multiple_workspaces");
                  } else {
                    setShowCreateModal(true);
                  }
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-50 text-zinc-800 rounded-xl text-xs font-bold transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Plus size={14} className="text-indigo-600 shrink-0" />
                  <span>Create Workspace</span>
                </div>
                {currentPlan === "free" && <span className="text-[10px]">👑</span>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. CREATE WORKSPACE MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[28px] border border-zinc-100 p-6 shadow-2xl w-full max-w-md relative"
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 rounded-full transition-all"
              >
                <X size={16} />
              </button>

              <h2 className="text-xl font-bold text-zinc-900 mb-1">Create New Workspace</h2>
              <p className="text-xs text-zinc-500 mb-5">Create a separate workspace to isolate campaigns, CRM, and analytics for another client or brand.</p>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Workspace Name</label>
                  <input
                    type="text"
                    required
                    value={newWsName}
                    onChange={(e) => setNewWsName(e.target.value)}
                    placeholder="e.g. Acme Agency, Personal Brand"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-xs font-semibold text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Workspace Branding Color</label>
                  <div className="flex items-center gap-2.5">
                    {AVATAR_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewWsColor(color)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${color} ${
                          newWsColor === color ? "ring-2 ring-indigo-600 ring-offset-2 scale-105" : "hover:scale-105"
                        }`}
                      >
                        {newWsColor === color && <Check size={12} className="text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-5 py-2.5 border border-zinc-200 text-zinc-700 rounded-xl text-xs font-semibold hover:bg-zinc-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-semibold hover:bg-indigo-600 transition-all shadow-md"
                  >
                    Create Workspace
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. MANAGE WORKSPACE MODAL */}
      <AnimatePresence>
        {showManageModal && managingWs && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[28px] border border-zinc-100 p-6 shadow-2xl w-full max-w-md relative"
            >
              <button
                onClick={() => {
                  setShowManageModal(false);
                  setManagingWs(null);
                }}
                className="absolute top-4 right-4 p-2 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 rounded-full transition-all"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs ${managingWs.avatar_color || "bg-indigo-600"}`}>
                  {getInitials(managingWs.name)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 leading-none mb-1">Workspace Settings</h2>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Branding & Organization</p>
                </div>
              </div>

              <div className="space-y-5 mt-5">
                {/* Rename Section */}
                <form onSubmit={handleRename} className="space-y-2 border-b border-zinc-100 pb-4">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Rename Workspace</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={editWsName}
                      onChange={(e) => setEditWsName(e.target.value)}
                      className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-indigo-600 transition-all"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-zinc-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1"
                    >
                      <Edit3 size={12} /> Save
                    </button>
                  </div>
                </form>

                {/* Connected Accounts Mapping Section */}
                <div className="space-y-2 border-b border-zinc-100 pb-4">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Accounts in this Workspace
                  </label>
                  
                  {allAccounts.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic">No accounts connected to your profile.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
                      {allAccounts.map(acc => {
                        const isMappedToThis = (acc.workspace_id || JSON.parse(localStorage.getItem("automixa_account_workspace_mappings") || "{}")[acc.id] || "personal") === managingWs.id;
                        return (
                          <div key={acc.id} className="flex items-center justify-between p-2 hover:bg-zinc-50 rounded-xl border border-zinc-100 bg-white">
                            <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                              <img
                                src={acc.profile_pic || acc.profile_picture_url || acc.metadata?.profile_picture_url || acc.metadata?.profile_pic || "https://ui-avatars.com/api/?name=" + encodeURIComponent(acc.page_name || "User") + "&background=6366f1&color=fff&size=150"}
                                alt={acc.ig_username || acc.page_name}
                                className="w-6 h-6 rounded-md object-cover border border-zinc-200 shadow-sm"
                              />
                              <span className="text-xs font-semibold text-zinc-700 truncate">@{acc.ig_username || acc.page_name}</span>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => {
                                const newDest = isMappedToThis ? "personal" : managingWs.id;
                                linkAccountToWorkspace(acc.id, newDest);
                              }}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all border ${
                                isMappedToThis 
                                  ? "bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-700" 
                                  : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-700"
                              }`}
                            >
                              {isMappedToThis ? "Linked (Unlink)" : "Link here"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Delete Section */}
                {managingWs.id !== "personal" && (
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-rose-600">Delete Workspace</h4>
                      <p className="text-[10px] text-zinc-400">All data will be reallocated. This cannot be undone.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(managingWs.id)}
                      className="px-4 py-2 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold hover:bg-rose-50 transition-all flex items-center gap-1.5"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
