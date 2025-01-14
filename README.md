<div align="center">
  <image align="center" src="https://orpc.unnoq.com/logo.webp" width=280 />
</div>

<h1></h1>

<div align="center">

![NPM Downloads](https://img.shields.io/npm/dm/%40orpc/server?logo=npm)
![GitHub Release](https://img.shields.io/github/v/release/unnoq/orpc?logo=github)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/unnoq/orpc?logo=git&logoColor=%23fff)
![GitHub License](https://img.shields.io/github/license/unnoq/orpc)

</div>

<p align="center">End-to-end typesafe APIs built quicker & easier</p>

> [!NOTE]
> This project is still in heavy development, please be mindful of breaking changes.

**oRPC is a powerful combination of RPC and OpenAPI, offering an exceptional developer experience powered by TypeScript. It's designed to be simple and straightforward to use.**

---

## Features

- **Type-safe 🔒**: oRPC is built on top of TypeScript, which means you get full type safety out of the box.
- **Easy to use ✍️**: oRPC is designed to be simple and straightforward to use.
- **Contract first 📝**: Take advantage of a "contract first" approach to developing your API.
- **Built-in plugins 🔌**: Easily implement into your favourite frameworks.

---

## Documentation & Examples

You can find the full documentation & examples [here](https://orpc.unnoq.com).

---

## Packages

- `@orpc/contract`: Build your API contract.
- `@orpc/server`: Build your API or implement API contract.
- `@orpc/client`: Consume your API on the client with type-safety.
- `@orpc/react-query`: Integration with [React Query](https://tanstack.com/query/latest/docs/framework/react/overview).
- `@orpc/vue-query`: Integration with [Vue Query](https://tanstack.com/query/latest/docs/framework/vue/overview).
- `@orpc/vue-colada`: Integration with [Pinia Colada](https://pinia-colada.esm.dev/).
- `@orpc/openapi`: Generate OpenAPI specs and provide OpenAPI handler for `@orpc/server`.
- `@orpc/next`: Helpers and hooks for [Next.JS](https://nextjs.org/).
- `@orpc/zod`: More schemas that [Zod](https://zod.dev/) doesn't support yet.

---

## Comparison

This comparison table helps you understand how oRPC differs from other popular TypeScript RPC and REST solutions.

- ✅ First-class, built-in support.
- 🟡 Lacks features, or requires third-party integrations.
- 🛑 Not supported or not documented.

| Feature                  | oRPC | tRPC | ts-rest | Description                                                        |
| ------------------------ | ---- | ---- | ------- | ------------------------------------------------------------------ |
| End-to-end Type Safety   | ✅   | ✅   | ✅      | Full TypeScript type inference from backend to frontend.           |
| End-to-end Type Error    | ✅   | 🛑   | ✅      | Full TYpeScript type inference for Error from backend to frontend. |
| React Query Integration  | ✅   | ✅   | 🟡      | Native support for React Query/TanStack Query.                     |
| Vue Query Integration    | ✅   | 🛑   | 🟡      | Native support for Vue Query/TanStack Query.                       |
| Pinia Colada Integration | ✅   | 🛑   | 🛑      | Native support for VPinia Colada.                                  |
| With Contract-First      | ✅   | 🛑   | ✅      | API definitions before implementation.                             |
| Without Contract-First   | ✅   | ✅   | 🛑      | API definitions and implementation are combined in same place      |
| File Operations          | ✅   | 🟡   | 🟡      | Built-in support for file uploads/downloads.                       |
| OpenAPI Support          | ✅   | 🟡   | 🟡      | Generation and consumption of OpenAPI specs.                       |
| Server Actions Support   | ✅   | ✅   | 🛑      | React/Next.js Actions compatibility.                               |
| WebSockets/SSE Support   | 🛑   | ✅   | 🛑      | WebSockets/SSE support.                                            |
| Nest.js integration      | 🛑   | 🟡   | ✅      | Integration with Nest.js.                                          |

## References

oRPC is inspired by existing solutions that prioritize type safety and developer experience. Special acknowledgments to:

- [tRPC](https://trpc.io): For pioneering the concept of end-to-end type-safe RPC and influencing the development of type-safe APIs.
- [ts-rest](https://ts-rest.com): For its emphasis on contract-first development and OpenAPI integration, which have greatly inspired oRPC’s feature set.

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
