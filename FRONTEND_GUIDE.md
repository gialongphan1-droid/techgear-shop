# Frontend integration guide

## API response contract

The Backend returns the shared envelope documented in `docs/04-api-spec.md`:

```json
{
  "success": true,
  "message": "string",
  "data": {},
  "errors": []
}
```

`services/publicApi.js` and `services/adminApi.js` return Axios responses. UI
components read the envelope from `response.data`; the storefront adapter in
`services/storefrontService.js` returns the envelope body directly.

## API integration status

Customer catalog, cart, checkout, and order tracking use live Backend APIs.
Admin products, categories, banners, orders, and inventory use live Backend
APIs. Redux cart state mirrors the server cart; it is not a local mock.

The Admin dashboard requests `GET /admin/dashboard` and displays the API error
when the endpoint is unavailable. The endpoint is described in the API
specification but is not listed as completed in `docs/BACKEND_PROGRESS.md` and
was not found in the current Backend routes. No sample statistics are shown.

There are no mock fixtures or mock services used by the application. When
Backend API contracts change, update the corresponding API adapters:

- Customer APIs: `src/frontend/src/services/publicApi.js`
- Customer response mapping: `src/frontend/src/services/storefrontService.js`
- Admin APIs: `src/frontend/src/services/adminApi.js`
- Shared credentials, Origin, and CSRF behavior:
  `src/frontend/src/api/axiosClient.js`
- Server-backed cart state mapping: `src/frontend/src/store/cartSlice.js`

## Local checks

Run the production build from `src/frontend`:

```sh
npm run build
```
