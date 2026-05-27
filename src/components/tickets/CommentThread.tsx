"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Paperclip, X, FileText, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { TicketComment } from "@/types/ticket";

interface CommentThreadProps {
  comments: TicketComment[];
  currentUserId: string;
  currentUserRole: string;
  onAddComment: (body: string, files: File[]) => void;
  isSubmitting: boolean;
  disabled?: boolean;
}

function roleLabel(role: string) {
  if (role === "technician") return "Técnico";
  if (role === "admin") return "Admin";
  return "Usuario";
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function AttachmentChip({ url, filename, mimetype }: { url: string; filename: string; mimetype: string }) {
  const isImage = mimetype.startsWith("image/");
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs hover:bg-white/20 transition-colors max-w-[180px]"
    >
      {isImage ? <ImageIcon className="h-3.5 w-3.5 shrink-0" /> : <FileText className="h-3.5 w-3.5 shrink-0" />}
      <span className="truncate">{filename}</span>
    </a>
  );
}

export function CommentThread({
  comments,
  currentUserId,
  currentUserRole,
  onAddComment,
  isSubmitting,
  disabled = false,
}: CommentThreadProps) {
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments.length]);

  const isSupport = currentUserRole === "technician" || currentUserRole === "admin";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if ((!trimmed && files.length === 0) || isSubmitting) return;
    onAddComment(trimmed, files);
    setBody("");
    setFiles([]);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
    e.target.value = "";
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-slate-700">
        Hilo de conversación
        {comments.length > 0 && (
          <span className="ml-2 text-xs font-normal text-slate-400">
            {comments.length} mensaje{comments.length !== 1 ? "s" : ""}
          </span>
        )}
      </h3>

      {/* Messages */}
      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-6">
            Sin mensajes aún. Sé el primero en escribir.
          </p>
        ) : (
          comments.map((c) => {
            const isMine = c.author_id === currentUserId;
            const isSupportMsg = c.author_role === "technician" || c.author_role === "admin";

            return (
              <div key={c.id} className={`flex gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${isSupportMsg ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}`}>
                  {c.author_name.charAt(0).toUpperCase()}
                </div>

                {/* Bubble */}
                <div className={`max-w-[75%] flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}>
                  <span className="text-[11px] text-slate-400 px-1">
                    {c.author_name} · {roleLabel(c.author_role)} · {formatTime(c.created_at)}
                  </span>

                  {/* Text bubble */}
                  {c.body && (
                    <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      isMine
                        ? isSupportMsg
                          ? "bg-indigo-600 text-white rounded-tr-sm"
                          : "bg-slate-700 text-white rounded-tr-sm"
                        : "bg-slate-100 text-slate-800 rounded-tl-sm"
                    }`}>
                      {c.body}
                    </div>
                  )}

                  {/* Attachments */}
                  {c.attachments?.length > 0 && (
                    <div className={`flex flex-wrap gap-1.5 ${isMine ? "justify-end" : "justify-start"}`}>
                      {c.attachments.map((att) =>
                        att.mimetype.startsWith("image/") ? (
                          <a key={att.key} href={att.url} target="_blank" rel="noopener noreferrer"
                            className="group overflow-hidden rounded-xl border border-slate-200 hover:border-indigo-300">
                            <img src={att.url} alt={att.filename}
                              className="h-28 w-28 object-cover transition-opacity group-hover:opacity-80" />
                          </a>
                        ) : (
                          <a key={att.key} href={att.url} target="_blank" rel="noopener noreferrer"
                            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs transition-colors ${
                              isMine
                                ? "border-white/20 bg-indigo-500 text-white hover:bg-indigo-400"
                                : "border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                            }`}>
                            <FileText className="h-4 w-4 shrink-0" />
                            <span className="max-w-[140px] truncate">{att.filename}</span>
                          </a>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!disabled && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 pt-2 border-t border-slate-100">
          {/* File previews */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 px-1">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600">
                  {f.type.startsWith("image/") ? <ImageIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" /> : <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />}
                  <span className="max-w-[120px] truncate">{f.name}</span>
                  <button type="button" onClick={() => removeFile(i)} className="ml-0.5 text-slate-400 hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            {/* Attach button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={files.length >= 5}
              className="self-end rounded-lg border border-slate-200 p-2.5 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors disabled:opacity-40"
              title="Adjuntar archivo"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
              className="hidden"
              onChange={handleFileChange}
            />

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as React.FormEvent);
                }
              }}
              placeholder={isSupport ? "Escribe una respuesta al usuario..." : "Escribe una respuesta al técnico..."}
              rows={2}
              maxLength={2000}
              className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />

            <Button
              type="submit"
              size="sm"
              disabled={(!body.trim() && files.length === 0) || isSubmitting}
              className="self-end gap-1.5"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
