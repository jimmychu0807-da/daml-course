Refer to the [CX engineering technical onboarding](./cx-engin-tech-onboarding.pdf) document.

# Daml Development

## Hands-on: Write your first daml application (build and run with dpm sandbox)

My first application is Ledger Programming Lab 1: [Customer Loyalty Program](https://github.com/jimmychu0807-da/daml-course/blob/main/02-ledger-programming/daml/Lab1.daml), with [test script](https://github.com/jimmychu0807-da/daml-course/blob/main/02-ledger-programming/daml/TestLab1.daml).

Build the daml template with:

```sh
dpm build
```

Most of the time, the vscode `Script Result` is clicked to see a simulated result.

To run it with sandbox, run in one console:

```sh
dpm sandbox -v --debug --dar .daml/dist/ledger-programming-0.0.1.dar
```

Using both the `-v --debug` flags are helpful to see what's going on in the sandbox. The sandbox command spins up a participant `sandbox`, a sequencer `local`, and a mediator `mediator1`.

Open another terminal and run the test script against the sandbox env:

```sh
dpm script --ledger-host localhost --ledger-port 6865 --dar .daml/dist/ledger-programming-0.0.1.dar --script-name TestLab1:testSubmitAndAcceptCLPApplication
```

Beware the script-name is in **moduleName**:**scriptName** format.

## How can you inspect the contents of a DAR? What’s inside?

dar file is in zip format. So just run `unzip file.dar` in cli to unzip the file.

If your machine has java toolchain, use `jar -t` to see the content inside without expansion, or just `jar -x` to extract all files.

The content contains the compiled project module (module.dalf), all the module src files (daml), a manifest file, the compiled daml-stdlib and included modules (*.dalf).

## Hands-on - Test your first daml application with daml script

Running the daml script inside VS Code (I'm using Cursor IDE)

![ss-01](./assets/ss01.png)

Running with sandbox, run with `-v --debug` flags, each transaction has **7 phases**.

![ss-02](./assets/ss02.png)

## Theory - what are signatories and observers?

**Signatories** are ones that need to approve in order to create the contract.

**Observers** are ones who have read access to the contract content.

## Hands-on - Implement and test the [propose-accept pattern](https://docs.canton.network/appdev/modules/m2-multi-party-workflows#the-propose-accept-pattern)

- [`ProposeAcceptPattern.daml`](./templates/daml/ProposeAcceptPattern.daml)
- [`TestProposeAcceptPattern.daml`](./templates/daml/TestProposeAcceptPattern.daml)

## Theory - Consider also [the delegation pattern](https://docs.canton.network/appdev/modules/m2-multi-party-workflows#delegation-patterns). How does it compare to the propose-accept pattern? In which scenarios would you use each pattern?

Propose-accept is used when there is one party and counterparty and they do a trade with each other. Delegation is you are granting a right to another party so they can act on behalf of you i.e. on governance voting. You can also withdraw the granted right afterwards.

## Hands-on - Launch [localnet](https://docs.canton.network/appdev/modules/m5-localnet-development)

This is essentially setting up [cn-quickstart](https://github.com/digital-asset/cn-quickstart) project to run locally.

Running the `make start` in the `quickstart` directory run the following docker containers:

```
docker container ls
CONTAINER ID   IMAGE                                                                        COMMAND                  CREATED         STATUS                     PORTS                                                                                                                                                                                                                                                                                                                                      NAMES
96e844eab4e7   nginx:1.27.0                                                                 "/docker-entrypoint.…"   6 minutes ago   Up 5 minutes               127.0.0.1:2000->2000/tcp, 127.0.0.1:3000->3000/tcp, 127.0.0.1:4000->4000/tcp                                                                                                                                                                                                                                                               nginx
65a9b56b8ce4   eclipse-temurin:21-jdk                                                       "/__cacert_entrypoin…"   6 minutes ago   Up 5 minutes               0.0.0.0:8080->8080/tcp, [::]:8080->8080/tcp                                                                                                                                                                                                                                                                                                backend-service
eacc8fda28a9   europe-docker.pkg.dev/da-images/public/docker/scribe:3.5.2                   "java -jar scribe.ja…"   6 minutes ago   Up 5 minutes                                                                                                                                                                                                                                                                                                                                                          pqs-app-provider
ee7c3c97d1ef   quickstart-splice-onboarding                                                 "/entrypoint.sh --in…"   6 minutes ago   Up 5 minutes (healthy)                                                                                                                                                                                                                                                                                                                                                splice-onboarding
2c730175eb18   ghcr.io/digital-asset/decentralized-canton-sync/docker/splice-app:0.6.5      "/usr/bin/tini -- /a…"   6 minutes ago   Up 6 minutes (healthy)     0.0.0.0:2903->2903/tcp, [::]:2903->2903/tcp, 0.0.0.0:3903->3903/tcp, [::]:3903->3903/tcp, 0.0.0.0:4903->4903/tcp, [::]:4903->4903/tcp                                                                                                                                                                                                      splice
5343039c5154   ghcr.io/digital-asset/decentralized-canton-sync/docker/canton:0.6.5          "/usr/bin/tini -- /a…"   6 minutes ago   Up 6 minutes (healthy)     0.0.0.0:2901-2902->2901-2902/tcp, [::]:2901-2902->2901-2902/tcp, 0.0.0.0:2975->2975/tcp, [::]:2975->2975/tcp, 0.0.0.0:3901-3902->3901-3902/tcp, [::]:3901-3902->3901-3902/tcp, 0.0.0.0:3975->3975/tcp, [::]:3975->3975/tcp, 0.0.0.0:4901-4902->4901-4902/tcp, [::]:4901-4902->4901-4902/tcp, 0.0.0.0:4975->4975/tcp, [::]:4975->4975/tcp   canton
ba0946c55c34   grafana/grafana:11.1.5                                                       "/run.sh"                6 minutes ago   Up 6 minutes               0.0.0.0:3030->3000/tcp, [::]:3030->3000/tcp                                                                                                                                                                                                                                                                                                grafana
b47680932bc3   postgres:14                                                                  "/postgres-entrypoin…"   6 minutes ago   Up 6 minutes (healthy)     0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp                                                                                                                                                                                                                                                                                                postgres
11a2ec95fad7   ghcr.io/digital-asset/decentralized-canton-sync/docker/sv-web-ui:0.6.5       "/usr/bin/tini -- /c…"   6 minutes ago   Up 6 minutes (healthy)     8080/tcp                                                                                                                                                                                                                                                                                                                                   sv-web-ui
a0390830ca92   ghcr.io/digital-asset/decentralized-canton-sync/docker/ans-web-ui:0.6.5      "/usr/bin/tini -- /c…"   6 minutes ago   Up 6 minutes (healthy)     8080/tcp                                                                                                                                                                                                                                                                                                                                   ans-web-ui-app-user
e78e717ceab0   prometheuscommunity/postgres-exporter:v0.15.0                                "/bin/postgres_expor…"   6 minutes ago   Up 6 minutes               9187/tcp                                                                                                                                                                                                                                                                                                                                   postgres-metrics
d4ce1bbbc770   ghcr.io/digital-asset/decentralized-canton-sync/docker/ans-web-ui:0.6.5      "/usr/bin/tini -- /c…"   6 minutes ago   Up 6 minutes (healthy)     8080/tcp                                                                                                                                                                                                                                                                                                                                   ans-web-ui-app-provider
8a9e4fd3fa9a   ghcr.io/digital-asset/decentralized-canton-sync/docker/wallet-web-ui:0.6.5   "/usr/bin/tini -- /c…"   6 minutes ago   Up 6 minutes (healthy)     8080/tcp                                                                                                                                                                                                                                                                                                                                   wallet-web-ui-app-user
080c9d51090c   ghcr.io/digital-asset/decentralized-canton-sync/docker/scan-web-ui:0.6.5     "/usr/bin/tini -- /c…"   6 minutes ago   Up 6 minutes (healthy)     8080/tcp                                                                                                                                                                                                                                                                                                                                   scan-web-ui
e82656bf1b8d   ghcr.io/digital-asset/decentralized-canton-sync/docker/wallet-web-ui:0.6.5   "/usr/bin/tini -- /c…"   6 minutes ago   Up 6 minutes (healthy)     8080/tcp                                                                                                                                                                                                                                                                                                                                   wallet-web-ui-app-provider
a2482cfbf8a5   ghcr.io/digital-asset/decentralized-canton-sync/docker/wallet-web-ui:0.6.5   "/usr/bin/tini -- /c…"   6 minutes ago   Up 6 minutes (healthy)     8080/tcp                                                                                                                                                                                                                                                                                                                                   wallet-web-ui-sv
0d1bd0c34a74   nginx/nginx-prometheus-exporter:1.3.0                                        "/usr/bin/nginx-prom…"   6 minutes ago   Up 6 minutes                                                                                                                                                                                                                                                                                                                                                          nginx-metrics
caa106f78f2c   swaggerapi/swagger-ui                                                        "/docker-entrypoint.…"   6 minutes ago   Up 6 minutes               0.0.0.0:9090->8080/tcp, [::]:9090->8080/tcp                                                                                                                                                                                                                                                                                                swagger-ui
ab38e5a1d1c9   prom/prometheus:v2.54.1                                                      "/bin/prometheus --c…"   6 minutes ago   Up 6 minutes               9090/tcp                                                                                                                                                                                                                                                                                                                                   prometheus
735ddbcbb6b1   grafana/loki:3.1.1                                                           "/usr/bin/loki --con…"   6 minutes ago   Up 6 minutes               3100/tcp                                                                                                                                                                                                                                                                                                                                   loki
fe518fc87afe   gcr.io/cadvisor/cadvisor:v0.50.0                                             "/usr/bin/cadvisor -…"   6 minutes ago   Up 6 minutes (unhealthy)   8080/tcp                                                                                                                                                                                                                                                                                                                                   cadvisor
036166f6151b   otel/opentelemetry-collector-contrib:0.108.0                                 "/otelcol-contrib --…"   6 minutes ago   Up 6 minutes               0.0.0.0:14002->14002/tcp, [::]:14002->14002/tcp                                                                                                                                                                                                                                                                                            otel-collector
dd0e93d256dd   grafana/tempo:2.5.0                                                          "/tempo --config.fil…"   6 minutes ago   Up 6 minutes                                                                                                                                                                                                                                                                                                                                                          tempo
```

There are 3 parties above:
- SV running with `4${port-suffix}`
- App provider with `3${port-suffix}`
- App user with `2${port-suffix}`

Each party is running a partcipant, and a splice (synchronizer?)

