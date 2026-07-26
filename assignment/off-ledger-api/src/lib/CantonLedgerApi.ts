import { readFile } from "node:fs/promises";

const mapping = {
  getPackages: {
    method: "GET",
    endpoint: "/v2/packages"
  },
  uploadPackage: {
    method: "POST",
    endpoint: "/v2/dars"
  },
  getParties: {
    method: "GET",
    endpoint: "/v2/parties"
  },
  allocateParty: {
    method: "POST",
    endpoint: "/v2/parties"
  },
}

const TIMEOUT = 6000;

type CantonLedgerApiOptions = {
  useHttps: boolean,
  access_token?: string
}

export class CantonLedgerApi {
  server: string;
  opts: CantonLedgerApiOptions;

  constructor(server: string, opts: CantonLedgerApiOptions) {
    this.server = server;
    this.opts = opts;
  }

  public async getPackages() {
    const { method, endpoint } = mapping.getPackages;
    const fullEndpoint = `${this.httpScheme()}://${this.server}${endpoint}`;

    const response = await fetch(fullEndpoint, {
      method,
      headers: {
        Authorization: `Bearer ${this.opts.access_token}`,
        'Content-Type': 'application/octet-stream',
      },
      signal: AbortSignal.timeout(TIMEOUT)
    });
    return await response.json();
  }

  public async getParties() {
    const { method, endpoint } = mapping.getParties;
    const fullEndpoint = `${this.httpScheme()}://${this.server}${endpoint}`;

    const response = await fetch(fullEndpoint, {
      method,
      headers: {
        Authorization: `Bearer ${this.opts.access_token}`,
        'Content-Type': 'application/octet-stream',
      },
      signal: AbortSignal.timeout(TIMEOUT)
    });
    return await response.json();
  }

  public async uploadPackage(filePath: string) {
    const { method, endpoint } = mapping.uploadPackage;
    const fullEndpoint = new URL(`${this.httpScheme()}://${this.server}${endpoint}`);

    // setting vetAllPackages
    fullEndpoint.searchParams.set("vetAllPackages", "true");

    const fileContent = await readFile(filePath); // Buffer
    console.log("file length:", fileContent.length);

    const response = await fetch(fullEndpoint, {
      method,
      headers: {
        Authorization: `Bearer ${this.opts.access_token}`,
        'Content-Type': 'application/octet-stream',
      },
      body: fileContent,
      signal: AbortSignal.timeout(TIMEOUT)
    });
    return await response.json();
  }

  public async allocateParty(partyIdHint: string, userId?: string) {
    const { method, endpoint } = mapping.allocateParty;
    const response = await fetch(this.getFullEndpoint(endpoint), {
      method,
      headers: {
        Authorization: `Bearer ${this.opts.access_token}`,
        'Content-Type': 'application/octet-stream',
      },
      body: JSON.stringify({
        partyIdHint,
        userId  // note: this value is omitted if undefined
      }),
      signal: AbortSignal.timeout(TIMEOUT)
    });
    return await response.json();
  }

  private httpScheme(): string {
    return this.opts.useHttps ? "https" : "http"
  }

  private getFullEndpoint(endpoint: string): string {
    return `${this.httpScheme()}://${this.server}${endpoint}`;
  }
}
