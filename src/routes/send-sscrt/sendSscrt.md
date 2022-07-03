This page requires the @keplr-wallet/types package to be installed.

`$ npm i @keplr-wallet/types`

Create a file called `window.d.ts` within `src`.

The `window.d.ts` file should hold the contents of [this file](https://docs.keplr.app/api/#using-with-typescript), also shown here:

```ts
import { Window as KeplrWindow } from "@keplr-wallet/types";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}
```