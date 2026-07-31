import { readFile } from "node:fs/promises";

import { VERBOSE } from "../config";

const mapping = {
  getPackages: {
    method: "GET",
    endpoint: "/v2/packages",
  },
  getPackagesWithVettedInfo: {
    method: "POST",
    endpoint: "/v2/package-vetting/list",
    opts: {
      pageSize: 100,
    },
  },
  uploadPackage: {
    method: "POST",
    endpoint: "/v2/dars",
  },
  getParties: {
    method: "GET",
    endpoint: "/v2/parties",
  },
  getParticipantId: {
    method: "GET",
    endpoint: "/v2/parties/participant-id",
  },
  allocateParty: {
    method: "POST",
    endpoint: "/v2/parties",
  },
  getUpdates: {
    method: "POST",
    endpoint: "/v2/updates",
  },
  submitAndWaitForTx: {
    method: "POST",
    endpoint: "/v2/commands/submit-and-wait-for-transaction",
  },
};

const TIMEOUT = 6000;

type CantonLedgerApiOpts = {
  useHttps: boolean;
  accessToken?: string;
};

type CantonLedgerApiGetUpdatesOpts = {
  offset: number;
  partyId: string;
  templateId: string;
};

export class CantonLedgerApi {
  server: string;
  opts: CantonLedgerApiOpts;

  constructor(server: string, opts: CantonLedgerApiOptions) {
    this.server = server;
    this.opts = opts;
  }

  get remoteEndpoint(): string {
    return `${this.httpScheme()}://${this.server}`;
  }

  public async getPackages() {
    const { method, endpoint } = mapping.getPackages;
    const fullEndpoint = `${this.httpScheme()}://${this.server}${endpoint}`;

    const response = await fetch(fullEndpoint, {
      method,
      headers: {
        Authorization: `Bearer ${this.opts.accessToken}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(TIMEOUT),
      verbose: VERBOSE,
    });
    return await response.json();
  }

  public async getPackagesWithVettedInfo(
    packageNamePrefix?: string,
    participantId?: string,
  ) {
    const { method, endpoint, opts } = mapping.getPackagesWithVettedInfo;
    const fullEndpoint = `${this.httpScheme()}://${this.server}${endpoint}`;

    const response = await fetch(fullEndpoint, {
      method,
      headers: {
        Authorization: `Bearer ${this.opts.accessToken}`,
        "Content-Type": "application/octet-stream",
      },
      // note: you need to specify a body for the request to work
      body: JSON.stringify({
        packageMetadataFilter: packageNamePrefix
          ? { packageNamePrefixes: [packageNamePrefix] }
          : undefined,
        topologyStateFilter: participantId
          ? { participantIds: [participantId] }
          : undefined,
        ...opts,
      }),
      signal: AbortSignal.timeout(TIMEOUT),
      verbose: VERBOSE,
    });

    return await response.json();
  }

  public async getParties() {
    const { method, endpoint } = mapping.getParties;
    const fullEndpoint = `${this.httpScheme()}://${this.server}${endpoint}`;

    const response = await fetch(fullEndpoint, {
      method,
      headers: {
        Authorization: `Bearer ${this.opts.accessToken}`,
        "Content-Type": "application/octet-stream",
      },
      signal: AbortSignal.timeout(TIMEOUT),
      verbose: VERBOSE,
    });
    return await response.json();
  }

  public async getParticipantId() {
    const { method, endpoint } = mapping.getParticipantId;
    const fullEndpoint = `${this.httpScheme()}://${this.server}${endpoint}`;

    const response = await fetch(fullEndpoint, {
      method,
      headers: {
        Authorization: `Bearer ${this.opts.accessToken}`,
        "Content-Type": "application/octet-stream",
      },
      signal: AbortSignal.timeout(TIMEOUT),
      verbose: VERBOSE,
    });
    return await response.json();
  }

  public async uploadPackage(filePath: string) {
    const fileContent = await readFile(filePath); // Buffer

    const { method, endpoint } = mapping.uploadPackage;
    const fullEndpoint = new URL(this.getFullEndpoint(endpoint));
    fullEndpoint.searchParams.set("vetAllPackages", "true");

    console.log(
      `Uploading a package of ${fileContent.length} bytes to ${this.server}`,
    );
    const response = await fetch(fullEndpoint, {
      method,
      headers: {
        Authorization: `Bearer ${this.opts.accessToken}`,
        "Content-Type": "application/octet-stream",
      },
      body: fileContent,
      signal: AbortSignal.timeout(TIMEOUT),
      verbose: VERBOSE,
    });

    return response.ok;
  }

  public async allocateParty(partyIdHint: string, userId?: string) {
    const { method, endpoint } = mapping.allocateParty;
    const response = await fetch(this.getFullEndpoint(endpoint), {
      method,
      headers: {
        Authorization: `Bearer ${this.opts.accessToken}`,
        "Content-Type": "application/octet-stream",
      },
      body: JSON.stringify({
        partyIdHint,
        userId, // note: this value is omitted if undefined
      }),
      signal: AbortSignal.timeout(TIMEOUT),
      verbose: VERBOSE,
    });
    return await response.json();
  }

  public async submitCmds(cmdsObj: unknown) {
    const { method, endpoint } = mapping.submitAndWaitForTx;
    const response = await fetch(this.getFullEndpoint(endpoint), {
      method,
      headers: {
        Authorization: `Bearer ${this.opts.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cmdsObj),
      signal: AbortSignal.timeout(TIMEOUT),
      verbose: VERBOSE,
    });

    if (response.ok) {
      console.log("result:", await response.json());
    } else {
      console.log("error:", response);
    }

    return {};
  }

  public async getUpdates(
    opts: CantonLedgerApiGetUpdatesOpts,
  ): Promise<{ update: unknown }[]> {
    const { method, endpoint } = mapping.getUpdates;

    const { offset, partyId, templateId } = opts;

    const response = await fetch(this.getFullEndpoint(endpoint), {
      method,
      headers: {
        Authorization: `Bearer ${this.opts.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        beginExclusive: offset,
        filter: {
          filtersByParty: {
            [partyId]: {
              cumulative: [
                {
                  identifierFilter: {
                    TemplateFilter: {
                      value: {
                        templateId,
                        includeCreatedEventBlob: true,
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      }),
      signal: AbortSignal.timeout(TIMEOUT),
      verbose: VERBOSE,
    });
    return (await response.json()) as { update: unknown }[];
  }

  private httpScheme(): string {
    return this.opts.useHttps ? "https" : "http";
  }

  private getFullEndpoint(endpoint: string): string {
    return `${this.httpScheme()}://${this.server}${endpoint}`;
  }
}
