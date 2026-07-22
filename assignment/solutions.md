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

`dpm inspect-dar <dar-file>`

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

Propose-accept is used when there is when two parties need to be signatory and is submitting commands asynchronously.

Delegation is used when you are granting a right to another party so they can act on behalf of you i.e. on governance voting. You can also withdraw the granted right afterwards.

But usually I would like such pattern should restrict some actions, or setting the scope of action that delegates can apply to the asset on behalf of the owner.

## Hands-on - Launch [localnet](https://docs.canton.network/appdev/modules/m5-localnet-development)

This is essentially setting up [cn-quickstart](https://github.com/digital-asset/cn-quickstart) project to run locally, and then running `make start`.

Or, run the localnet with localnet-recipes: <https://github.com/DACH-NY/localnet-recipes> with `make start`.

## Hands-on - Deploy your daml project to localnet

Launch the canton console with `make console` using the included docker config.

You could also connect it directly with:

```sh
dpm canton-console --port 2901 --admin-api-port 2902
```
This will just connect the console to the participant node `app-user`.

To connect to `app-provider` use `--port 3901 --admin-api-port 3902`.

The reason using `make console` you see the nice node reference of `app-user`, `app-provider`, `app-mediator`, `sv`, etc is due to the remote console config at: https://github.com/canton-network/splice/blob/15e00f3/cluster/compose/localnet/conf/console/app.conf.

Also note that the release of splice node is at: https://github.com/digital-asset/decentralized-canton-sync

Then you can upload the dar into `app-user` (connects with 2xxx ports) and `app-provider` (connects with 3xxx ports) with:

```
`app-user`.dars.upload("./assignment/templates/.daml/dist/assignment-templates-0.0.1.dar")
```

## Hands-on - Execute a daml transaction between two nodes - app user and app-provider


