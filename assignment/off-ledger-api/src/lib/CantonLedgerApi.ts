const mapping = {
  listDars: {
    method: "GET",
    endpoint: "/v2/packages"
  }
}

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

  public async listDars() {

    const fullEndpoint = `${this.httpScheme()}://${this.server}${mapping.listDars.endpoint}`;

    const request = new Request(fullEndpoint, {
      method: mapping.listDars.method,
      headers: {
        Authorization: `Bearer ${this.opts.access_token}`,
        'Content-Type': 'application/octet-stream',
      }
    });

    const response = await fetch(request);
    return await response.json();
  }

  private httpScheme(): string {
    return this.opts.useHttps ? "https" : "http"
  }
}
