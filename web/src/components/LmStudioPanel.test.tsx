import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import LmStudioPanel, { LmStudioPanelProps } from "./LmStudioPanel.tsx";
import { LmStudioMessage } from "../backend/useLmStudio.ts";

function defaultProps(overrides: Partial<LmStudioPanelProps> = {}): LmStudioPanelProps {
  return {
    url: "http://localhost:1234",
    setUrl: vi.fn(),
    messages: [],
    loading: false,
    connected: true,
    onSendMessage: vi.fn(),
    onCancelRequest: vi.fn(),
    onClearChat: vi.fn(),
    onTestConnection: vi.fn(),
    onUseAsPrompt: vi.fn(),
    onClose: vi.fn(),
    ...overrides,
  };
}

describe("LmStudioPanel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders empty state help text about multiple conversations", () => {
    render(<LmStudioPanel {...defaultProps()} />);
    expect(
      screen.getByText(/Have multiple conversations, then click/i)
    ).toBeInTheDocument();
  });

  it("renders assistant messages with 'Use as prompt' button", () => {
    const messages: LmStudioMessage[] = [
      { role: "user", content: "make a jazz song" },
      { role: "assistant", content: "A smooth jazz ballad with piano and sax" },
    ];
    render(<LmStudioPanel {...defaultProps({ messages })} />);
    expect(screen.getByText("Use as prompt ↗")).toBeInTheDocument();
  });

  it("calls onUseAsPrompt with assistant content when 'Use as prompt' is clicked", () => {
    const onUseAsPrompt = vi.fn();
    const messages: LmStudioMessage[] = [
      { role: "user", content: "make a jazz song" },
      { role: "assistant", content: "A smooth jazz ballad with piano and sax" },
    ];
    render(<LmStudioPanel {...defaultProps({ messages, onUseAsPrompt })} />);

    fireEvent.click(screen.getByText("Use as prompt ↗"));
    expect(onUseAsPrompt).toHaveBeenCalledWith("A smooth jazz ballad with piano and sax");
  });

  it("shows 'Copied to prompt ✓' feedback after clicking 'Use as prompt'", () => {
    const messages: LmStudioMessage[] = [
      { role: "user", content: "make a jazz song" },
      { role: "assistant", content: "A smooth jazz ballad" },
    ];
    render(<LmStudioPanel {...defaultProps({ messages })} />);

    fireEvent.click(screen.getByText("Use as prompt ↗"));
    expect(screen.getByText("Copied to prompt ✓")).toBeInTheDocument();
  });

  it("reverts 'Copied to prompt ✓' back to 'Use as prompt ↗' after 1.5 seconds", () => {
    const messages: LmStudioMessage[] = [
      { role: "user", content: "make something" },
      { role: "assistant", content: "Upbeat EDM track" },
    ];
    render(<LmStudioPanel {...defaultProps({ messages })} />);

    fireEvent.click(screen.getByText("Use as prompt ↗"));
    expect(screen.getByText("Copied to prompt ✓")).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(1500); });
    expect(screen.getByText("Use as prompt ↗")).toBeInTheDocument();
  });

  it("does NOT call onClose when 'Use as prompt' is clicked", () => {
    const onClose = vi.fn();
    const messages: LmStudioMessage[] = [
      { role: "user", content: "generate" },
      { role: "assistant", content: "Lo-fi beats" },
    ];
    render(<LmStudioPanel {...defaultProps({ messages, onClose })} />);

    fireEvent.click(screen.getByText("Use as prompt ↗"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("supports multiple 'Use as prompt' clicks across different messages", () => {
    const onUseAsPrompt = vi.fn();
    const messages: LmStudioMessage[] = [
      { role: "user", content: "first request" },
      { role: "assistant", content: "First suggestion" },
      { role: "user", content: "second request" },
      { role: "assistant", content: "Second suggestion" },
    ];
    render(<LmStudioPanel {...defaultProps({ messages, onUseAsPrompt })} />);

    const buttons = screen.getAllByText("Use as prompt ↗");
    expect(buttons).toHaveLength(2);

    fireEvent.click(buttons[0]);
    expect(onUseAsPrompt).toHaveBeenCalledWith("First suggestion");

    // First button shows copied, second still shows default
    expect(screen.getByText("Copied to prompt ✓")).toBeInTheDocument();
    expect(screen.getByText("Use as prompt ↗")).toBeInTheDocument();

    // Click the second button
    fireEvent.click(screen.getByText("Use as prompt ↗"));
    expect(onUseAsPrompt).toHaveBeenCalledWith("Second suggestion");
    expect(onUseAsPrompt).toHaveBeenCalledTimes(2);
  });

  it("sends a message when the form is submitted", () => {
    const onSendMessage = vi.fn();
    render(<LmStudioPanel {...defaultProps({ onSendMessage })} />);

    const input = screen.getByPlaceholderText("Describe the music you want...");
    fireEvent.change(input, { target: { value: "lo-fi hip hop" } });
    fireEvent.submit(input.closest("form")!);

    expect(onSendMessage).toHaveBeenCalledWith("lo-fi hip hop");
  });

  it("clears input after sending a message", () => {
    render(<LmStudioPanel {...defaultProps()} />);

    const input = screen.getByPlaceholderText("Describe the music you want...") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test message" } });
    fireEvent.submit(input.closest("form")!);

    expect(input.value).toBe("");
  });

  it("does not send empty messages", () => {
    const onSendMessage = vi.fn();
    render(<LmStudioPanel {...defaultProps({ onSendMessage })} />);

    const input = screen.getByPlaceholderText("Describe the music you want...");
    fireEvent.submit(input.closest("form")!);

    expect(onSendMessage).not.toHaveBeenCalled();
  });

  it("shows 'Thinking...' when loading", () => {
    render(<LmStudioPanel {...defaultProps({ loading: true })} />);
    expect(screen.getByText("Thinking...")).toBeInTheDocument();
  });

  it("closes the panel when close button is clicked", () => {
    const onClose = vi.fn();
    render(<LmStudioPanel {...defaultProps({ onClose })} />);

    fireEvent.click(screen.getByLabelText("Close panel"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("clears chat when clear button is clicked", () => {
    const onClearChat = vi.fn();
    render(<LmStudioPanel {...defaultProps({ onClearChat })} />);

    fireEvent.click(screen.getByLabelText("Clear chat"));
    expect(onClearChat).toHaveBeenCalledTimes(1);
  });

  it("shows connection status indicator", () => {
    const { rerender } = render(
      <LmStudioPanel {...defaultProps({ connected: true })} />
    );
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Connected");

    rerender(<LmStudioPanel {...defaultProps({ connected: false })} />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Disconnected");

    rerender(<LmStudioPanel {...defaultProps({ connected: undefined })} />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Not tested");
  });

  it("displays error message in the messages area", () => {
    render(
      <LmStudioPanel {...defaultProps({ error: "Connection failed", connected: true })} />
    );
    expect(screen.getByText("Connection failed")).toBeInTheDocument();
  });
});
