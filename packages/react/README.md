<div align="center">
  <image align="center" src="https://orpc.unnoq.com/logo.webp" width=280 alt="oRPC logo" />
</div>

<h1></h1>

<div align="center">
  <a href="https://codecov.io/gh/unnoq/orpc">
    <img alt="codecov" src="https://codecov.io/gh/unnoq/orpc/branch/main/graph/badge.svg">
  </a>
  <a href="https://www.npmjs.com/package/@orpc/react">
    <img alt="weekly downloads" src="https://img.shields.io/npm/dw/%40orpc%2Freact?logo=npm" />
  </a>
  <a href="https://github.com/unnoq/orpc/blob/main/LICENSE">
    <img alt="MIT License" src="https://img.shields.io/github/license/unnoq/orpc?logo=open-source-initiative" />
  </a>
  <a href="https://discord.gg/TXEbwRBvQn">
    <img alt="Discord" src="https://img.shields.io/discord/1308966753044398161?color=7389D8&label&logo=discord&logoColor=ffffff" />
  </a>
</div>

<h3 align="center">Typesafe APIs Made Simple 🪄</h3>

**oRPC is a powerful combination of RPC and OpenAPI**, makes it easy to build APIs that are end-to-end type-safe and adhere to OpenAPI standards, ensuring a smooth and enjoyable developer experience.

---

## Highlights

- [@orpc/contract](https://www.npmjs.com/package/@orpc/contract): Build your API contract.
- [@orpc/server](https://www.npmjs.com/package/@orpc/server): Build your API or implement API contract.
- [@orpc/client](https://www.npmjs.com/package/@orpc/client): Consume your API on the client with type-safety.
- [@orpc/react](https://www.npmjs.com/package/@orpc/react): Utilities for integrating oRPC with React and React Server Actions.
- [@orpc/react-query](https://www.npmjs.com/package/@orpc/react-query): Integration with [React Query](https://tanstack.com/query/latest/docs/framework/react/overview).
- [@orpc/vue-query](https://www.npmjs.com/package/@orpc/vue-query): Integration with [Vue Query](https://tanstack.com/query/latest/docs/framework/vue/overview).
- [@orpc/solid-query](https://www.npmjs.com/package/@orpc/solid-query): Integration with [Solid Query](https://tanstack.com/query/latest/docs/framework/solid/overview).
- [@orpc/svelte-query](https://www.npmjs.com/package/@orpc/svelte-query): Integration with [Svelte Query](https://tanstack.com/query/latest/docs/framework/svelte/overview).
- [@orpc/vue-colada](https://www.npmjs.com/package/@orpc/vue-colada): Integration with [Pinia Colada](https://pinia-colada.esm.dev/).
- [@orpc/openapi](https://www.npmjs.com/package/@orpc/openapi): Generate OpenAPI specs and handle OpenAPI requests.
- [@orpc/zod](https://www.npmjs.com/package/@orpc/zod): More schemas that [Zod](https://zod.dev/) doesn't support yet.
- [@orpc/valibot](https://www.npmjs.com/package/@orpc/valibot): OpenAPI spec generation from [Valibot](https://valibot.dev/).
- [@orpc/arktype](https://www.npmjs.com/package/@orpc/arktype): OpenAPI spec generation from [ArkType](https://arktype.io/).

## Documentation

You can find the full documentation [here](https://orpc.unnoq.com).

## Packages

- [@orpc/contract](https://www.npmjs.com/package/@orpc/contract): Build your API contract.
- [@orpc/server](https://www.npmjs.com/package/@orpc/server): Build your API or implement API contract.
- [@orpc/client](https://www.npmjs.com/package/@orpc/client): Consume your API on the client with type-safety.
- [@orpc/react-query](https://www.npmjs.com/package/@orpc/react-query): Integration with [React Query](https://tanstack.com/query/latest/docs/framework/react/overview).
- [@orpc/vue-query](https://www.npmjs.com/package/@orpc/vue-query): Integration with [Vue Query](https://tanstack.com/query/latest/docs/framework/vue/overview).
- [@orpc/solid-query](https://www.npmjs.com/package/@orpc/solid-query): Integration with [Solid Query](https://tanstack.com/query/latest/docs/framework/solid/overview).
- [@orpc/svelte-query](https://www.npmjs.com/package/@orpc/svelte-query): Integration with [Svelte Query](https://tanstack.com/query/latest/docs/framework/svelte/overview).
- [@orpc/vue-colada](https://www.npmjs.com/package/@orpc/vue-colada): Integration with [Pinia Colada](https://pinia-colada.esm.dev/).
- [@orpc/openapi](https://www.npmjs.com/package/@orpc/openapi): Generate OpenAPI specs and handle OpenAPI requests.
- [@orpc/zod](https://www.npmjs.com/package/@orpc/zod): More schemas that [Zod](https://zod.dev/) doesn't support yet.
- [@orpc/valibot](https://www.npmjs.com/package/@orpc/valibot): OpenAPI spec generation from [Valibot](https://valibot.dev/).
- [@orpc/arktype](https://www.npmjs.com/package/@orpc/arktype): OpenAPI spec generation from [ArkType](https://arktype.io/).

## `@orpc/react`

Provides utilities for integrating oRPC with React and React Server Actions. Read the [documentation](https://orpc.unnoq.com/docs/server-action) for more information.

### `useServerAction` Hook

The `useServerAction` hook simplifies invoking server actions in React.

```tsx
'use client'

import { isDefinedError, onError } from '@orpc/client'
import { useServerAction } from '@orpc/react'

export function MyComponent() {
  const { execute, data, error, status } = useServerAction(someAction, {
    interceptors: [
      onError((error) => {
        if (isDefinedError(error)) {
          console.error(error.data)
          //                   ^ Typed error data
        }
      }),
    ],
  })

  const action = async (form: FormData) => {
    const name = form.get('name') as string
    execute({ name })
  }

  return (
    <form action={action}>
      <input type="text" name="name" required />
      <button type="submit">Submit</button>
      {status === 'pending' && <p>Loading...</p>}
    </form>
  )
}
```

### `createFormAction` Utility

Creates a form action that can be used in React forms and deserializes with bracket notation.

```tsx
const dosomething = os
  .input(
    z.object({
      user: z.object({
        name: z.string(),
        age: z.coerce.number(),
      }),
    })
  )
  .handler(({ input }) => {
    console.log('Form action called!')
    console.log(input)
  })

export const redirectSomeWhereForm = createFormAction(dosomething, {
  interceptors: [
    onSuccess(async () => {
      redirect('/some-where')
    }),
  ],
})

export function MyComponent() {
  return (
    <form action={redirectSomeWhereForm}>
      <input type="text" name="user[name]" required />
      <input type="number" name="user[age]" required />
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/unnoq/unnoq/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/unnoq/unnoq/sponsors.svg'/>
  </a>
</p>

## License

Distributed under the MIT License. See [LICENSE](https://github.com/unnoq/orpc/blob/main/LICENSE) for more information.
