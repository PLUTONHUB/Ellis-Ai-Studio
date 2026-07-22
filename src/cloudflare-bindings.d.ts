declare module "cloudflare:workers" {
  interface KVNamespace {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  }

  export const env: {
    GBP_TOKEN_STORE: KVNamespace;
  };
}
