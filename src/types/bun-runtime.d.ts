type BunShellCommand = {
  quiet(): BunShellCommand;
  nothrow(): Promise<unknown>;
};

declare const Bun: {
  file(path: string): Blob & { exists(): Promise<boolean> };
  serve(options: {
    port: number;
    hostname: string;
    fetch(req: Request): Response | Promise<Response>;
  }): unknown;
  sleep(milliseconds: number): Promise<void>;
  $(strings: TemplateStringsArray, ...values: unknown[]): BunShellCommand;
};

interface ImportMeta {
  readonly dir: string;
}
