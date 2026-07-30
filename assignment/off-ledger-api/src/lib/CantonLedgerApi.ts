import { readFile } from "node:fs/promises";

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

type CantonLedgerApiOptions = {
  useHttps: boolean;
  accessToken?: string;
};

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
        Authorization: `Bearer ${this.opts.accessToken}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(TIMEOUT),
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
    });
    return await response.json();
  }

  public async submitAndWaitForTx() {
    const { method, endpoint } = mapping.submitAndWaitForTx;
    const response = await fetch(this.getFullEndpoint(endpoint), {
      method,
      headers: {
        Authorization: `Bearer ${this.opts.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commands: {
          commands: [
            {
              CreateCommand: {
                templateId:
                  "#assignment-templates:ProposeAcceptPattern:TradeProposal",
                createArguments: {
                  proposer:
                    "app_user_localnet-localparty-1::122019d9144b432fe7cc1df7fa01fabc648681575ca8eacd2d66b1b733a89744dd4c",
                  counterparty:
                    "app_provider_localnet-localparty-1::1220f75a5712f3504f26a7476e8ccdadcf7058e79827a08892aadfabb8ff38aa358a",
                  asset: "Bitcoin",
                  price: "60000.0",
                },
              },
            },
          ],
          commandId: "myCmd-01",
          actAs: [
            "app_user_localnet-localparty-1::122019d9144b432fe7cc1df7fa01fabc648681575ca8eacd2d66b1b733a89744dd4c",
          ],
        },
      }),
      signal: AbortSignal.timeout(TIMEOUT),
      verbose: true,
    });

    if (response.ok) {
      return await response.json();
    }

    console.log("error:", response);
    return {};
  }

  public async getUpdates() {
    const { method, endpoint } = mapping.allocateParty;
    const response = await fetch(this.getFullEndpoint(endpoint), {
      method,
      headers: {
        Authorization: `Bearer ${this.opts.accessToken}`,
        "Content-Type": "application/octet-stream",
      },
      body: JSON.stringify({
        beginExclusive: 0,
        verbose: true,
      }),
      signal: AbortSignal.timeout(TIMEOUT),
    });
    return await response.json();
  }

  private httpScheme(): string {
    return this.opts.useHttps ? "https" : "http";
  }

  private getFullEndpoint(endpoint: string): string {
    return `${this.httpScheme()}://${this.server}${endpoint}`;
  }
}
