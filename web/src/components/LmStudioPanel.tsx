import React, { useEffect, useRef, useState } from "react";
import { SendIcon } from "../Icons/SendIcon.tsx";
import { StopIcon } from "../Icons/StopIcon.tsx";
import { LmStudioMessage } from "../backend/useLmStudio.ts";

export interface LmStudioPanelProps {
  className?: string;
  url: string;
  setUrl: (url: string) => void;
  messages: LmStudioMessage[];
  loading: boolean;
  error?: string;
  connected?: boolean;
  onSendMessage: (text: string) => void;
  onCancelRequest: () => void;
  onClearChat: () => void;
  onTestConnection: () => void;
  onUseAsPrompt: (text: string) => void;
  onClose: () => void;
}

const LmStudioPanel: React.FC<LmStudioPanelProps> = ({
  className = "",
  url,
  setUrl,
  messages,
  loading,
  error,
  connected,
  onSendMessage,
  onCancelRequest,
  onClearChat,
  onTestConnection,
  onUseAsPrompt,
  onClose,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showSettings, setShowSettings] = useState(connected !== true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

  useEffect(() => {
    return () => { clearTimeout(copiedTimerRef.current); };
  }, []);

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (loading) return;
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleCancel = (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (loading) onCancelRequest();
  };

  return (
    <div
      className={`flex flex-col bg-[var(--card-background-color)] rounded-lg border border-[var(--border-color)] shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-[var(--text-color)]">
            AI Prompt Assistant
          </span>
          <span
            role="status"
            aria-label={
              connected === true
                ? "Connected"
                : connected === false
                  ? "Disconnected"
                  : "Not tested"
            }
            className={`inline-block w-2 h-2 rounded-full ${
              connected === true
                ? "bg-green-500"
                : connected === false
                  ? "bg-red-500"
                  : "bg-gray-400"
            }`}
            title={
              connected === true
                ? "Connected"
                : connected === false
                  ? "Disconnected"
                  : "Not tested"
            }
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowSettings((s) => !s)}
            className="text-xs px-2 py-1 rounded hover:bg-[var(--item-hover-background-color)] text-[var(--text-color)]"
            aria-label="Settings"
            title="Settings"
          >
            ⚙
          </button>
          <button
            type="button"
            onClick={onClearChat}
            className="text-xs px-2 py-1 rounded hover:bg-[var(--item-hover-background-color)] text-[var(--text-color)]"
            aria-label="Clear chat"
            title="Clear chat"
          >
            🗑
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-2 py-1 rounded hover:bg-[var(--item-hover-background-color)] text-[var(--text-color)]"
            aria-label="Close panel"
            title="Close panel"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Settings */}
      {showSettings && (
        <div className="px-3 py-2 border-b border-[var(--border-color)] flex flex-col gap-2">
          <label className="text-xs text-[var(--text-faded-color)]">
            LM Studio URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="http://localhost:1234"
              className="flex-grow px-2 py-1 text-sm rounded border focus:outline-none focus:ring-1 focus:ring-blue-500 bg-[var(--input-background-color)] text-[var(--input-text-color)] border-[var(--input-border-color)]"
            />
            <button
              type="button"
              onClick={onTestConnection}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Test
            </button>
          </div>
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
          {connected === true && !error && (
            <p className="text-xs text-green-500">Connected to LM Studio</p>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-auto px-3 py-2 space-y-2 min-h-[120px] max-h-[300px]">
        {messages.length === 0 && (
          <p className="text-xs text-[var(--text-faded-color)] text-center py-4">
            Chat with AI to generate music prompts.
            <br />
            Have multiple conversations, then click "Use as prompt" on any
            response to fill the prompt field.
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`px-3 py-2 rounded-lg text-sm max-w-[85%] ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-[var(--background-color)] text-[var(--text-color)] rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "assistant" && (
              <button
                type="button"
                onClick={() => {
                  onUseAsPrompt(msg.content);
                  setCopiedIndex(i);
                  clearTimeout(copiedTimerRef.current);
                  copiedTimerRef.current = setTimeout(() => setCopiedIndex(null), 1500);
                }}
                className={`text-xs mt-1 px-2 py-0.5 rounded text-white ${
                  copiedIndex === i
                    ? "bg-green-500"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {copiedIndex === i ? "Copied to prompt ✓" : "Use as prompt ↗"}
              </button>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-start">
            <div className="px-3 py-2 rounded-lg text-sm bg-[var(--background-color)] text-[var(--text-faded-color)] rounded-bl-none">
              Thinking...
            </div>
          </div>
        )}
        {error && !showSettings && (
          <p className="text-xs text-red-500 text-center">{error}</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 px-3 py-2 border-t border-[var(--border-color)]"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Describe the music you want..."
          className="flex-grow px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 bg-[var(--input-background-color)] text-[var(--input-text-color)] border-[var(--input-border-color)]"
        />
        <button
          type={loading ? "button" : "submit"}
          onClick={(e) => {
            if (loading) handleCancel(e);
            else handleSubmit(e);
          }}
          className="p-1.5 bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
        >
          {loading ? <StopIcon /> : <SendIcon />}
        </button>
      </form>
    </div>
  );
};

export default LmStudioPanel;
