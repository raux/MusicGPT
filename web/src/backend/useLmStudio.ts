import { useCallback, useRef, useState } from "react";

export interface LmStudioMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatCompletionChoice {
  message: { role: string; content: string };
}

interface ChatCompletionResponse {
  choices: ChatCompletionChoice[];
}

const DEFAULT_LM_STUDIO_URL = "http://localhost:1234";
const LM_STUDIO_URL_KEY = "lmStudioUrl";

function loadSavedUrl (): string {
  try {
    return localStorage.getItem(LM_STUDIO_URL_KEY) ?? DEFAULT_LM_STUDIO_URL;
  } catch {
    return DEFAULT_LM_STUDIO_URL;
  }
}

export function useLmStudio () {
  const [url, setUrlState] = useState<string>(loadSavedUrl);
  const [messages, setMessages] = useState<LmStudioMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [connected, setConnected] = useState<boolean | undefined>(undefined);
  const abortRef = useRef<AbortController>();

  const setUrl = useCallback((newUrl: string) => {
    setUrlState(newUrl);
    try {
      localStorage.setItem(LM_STUDIO_URL_KEY, newUrl);
    } catch {
      // ignore storage errors
    }
  }, []);

  const testConnection = useCallback(async () => {
    setError(undefined);
    try {
      const baseUrl = url.replace(/\/+$/, "");
      const resp = await fetch(`${baseUrl}/v1/models`, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      });
      if (resp.ok) {
        setConnected(true);
      } else {
        setConnected(false);
        setError(`LM Studio returned status ${resp.status}`);
      }
    } catch (e) {
      setConnected(false);
      setError(`Cannot reach LM Studio at ${url}`);
    }
  }, [url]);

  const sendMessage = useCallback(async (userText: string) => {
    if (!userText.trim()) return;
    setError(undefined);
    setLoading(true);

    const userMsg: LmStudioMessage = { role: "user", content: userText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    const systemPrompt: LmStudioMessage = {
      role: "system",
      content:
        "You are a creative music prompt assistant. Help the user craft descriptive prompts for an AI music generator. " +
        "Generate vivid, detailed descriptions of music including genre, mood, instruments, tempo, and style. " +
        "Keep responses concise (1-3 sentences) and focused on describing the desired music.",
    };

    try {
      abortRef.current = new AbortController();
      const baseUrl = url.replace(/\/+$/, "");
      const resp = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          messages: [systemPrompt, ...updatedMessages],
          temperature: 0.8,
          max_tokens: 200,
        }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`LM Studio error (${resp.status}): ${text}`);
      }

      const data: ChatCompletionResponse = await resp.json();
      const assistantContent = data.choices?.[0]?.message?.content ?? "";
      const assistantMsg: LmStudioMessage = {
        role: "assistant",
        content: assistantContent,
      };
      setMessages([...updatedMessages, assistantMsg]);
      setConnected(true);
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === "AbortError") {
        // cancelled by user, not an error
      } else {
        const message = e instanceof Error ? e.message : "Unknown error";
        setError(message);
        setConnected(false);
      }
    } finally {
      setLoading(false);
      abortRef.current = undefined;
    }
  }, [messages, url]);

  const cancelRequest = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(undefined);
  }, []);

  return {
    url,
    setUrl,
    messages,
    loading,
    error,
    connected,
    sendMessage,
    cancelRequest,
    clearChat,
    testConnection,
  };
}
