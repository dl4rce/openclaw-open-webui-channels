export interface StreamingDeps {
  postMessage: (text: string, options: Record<string, unknown>) => Promise<{ id: string }>;
  updateMessage: (messageId: string, text: string, options?: Record<string, unknown>) => Promise<void>;
  log?: {
    info: (msg: string) => void;
    error: (msg: string) => void;
  };
}

export class StreamingSession {
  private messageId: string | null = null;
  private accumulatedText = "";
  private readonly deps: StreamingDeps;

  constructor(deps: StreamingDeps) {
    this.deps = deps;
  }

  get isStreaming(): boolean {
    return this.messageId !== null;
  }

  get currentMessageId(): string | null {
    return this.messageId;
  }

  get currentText(): string {
    return this.accumulatedText;
  }

  private reset(): void {
    this.messageId = null;
    this.accumulatedText = "";
  }

  private resolveFinalText(text: string): string {
    if (!text) {
      return this.accumulatedText;
    }
    if (!this.accumulatedText) {
      return text;
    }
    // Some fallback paths emit a complete final reply after block chunks.
    // Avoid duplicating prefixes when final text already contains streamed content.
    if (text.startsWith(this.accumulatedText)) {
      return text;
    }
    return this.accumulatedText + text;
  }

  async appendBlock(text: string, postOptions: Record<string, unknown>): Promise<void> {
    this.accumulatedText += text;

    if (!this.messageId) {
      this.deps.log?.info(`streaming start (${this.accumulatedText.length} chars)`);
      const posted = await this.deps.postMessage(this.accumulatedText, postOptions);
      if (!posted?.id) {
        throw new Error("Failed to post initial streaming message: no id returned");
      }
      this.messageId = posted.id;
      this.deps.log?.info(`streaming message created as ${this.messageId}`);
      return;
    }

    this.deps.log?.info(`streaming update ${this.messageId} (${this.accumulatedText.length} chars)`);
    try {
      await this.deps.updateMessage(this.messageId, this.accumulatedText);
    } catch (updateErr) {
      this.deps.log?.error(`updateMessage failed, falling back to postMessage: ${String(updateErr)}`);
      this.reset();
      await this.deps.postMessage(text, postOptions);
    }
  }

  async finalize(
    text: string,
    updateOptions: Record<string, unknown>,
    postNew: (fullText: string) => Promise<void>,
  ): Promise<void> {
    if (!this.messageId) {
      await postNew(text);
      return;
    }

    const finalText = this.resolveFinalText(text);
    const msgId = this.messageId;
    this.reset();

    this.deps.log?.info(`finalizing streaming message ${msgId} (${finalText.length} chars)`);
    try {
      await this.deps.updateMessage(msgId, finalText, updateOptions);
    } catch (updateErr) {
      this.deps.log?.error(`updateMessage failed on finalize, falling back to postMessage: ${String(updateErr)}`);
      await postNew(finalText);
    }
  }

  async breakSession(postOptions: Record<string, unknown>): Promise<void> {
    if (!this.messageId) return;
    await this.finalize("", postOptions, async (fullText) => {
      await this.deps.postMessage(fullText, postOptions);
    });
  }
}
