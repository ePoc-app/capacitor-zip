# capacitor-zip

A capacitor plugin to unzip files

## Install

```bash
npm install capacitor-zip
npx cap sync
```

## API

<docgen-index>

* [`zip(...)`](#zip)
* [`unzip(...)`](#unzip)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### zip(...)

```typescript
zip(options: { source: string; destination: string; }) => Promise<{ success: boolean; message?: string; }>
```

| Param         | Type                                                  |
| ------------- | ----------------------------------------------------- |
| **`options`** | <code>{ source: string; destination: string; }</code> |

**Returns:** <code>Promise&lt;{ success: boolean; message?: string; }&gt;</code>

--------------------


### unzip(...)

```typescript
unzip(options: { source: string; destination: string; }) => Promise<{ success: boolean; message?: string; }>
```

| Param         | Type                                                  |
| ------------- | ----------------------------------------------------- |
| **`options`** | <code>{ source: string; destination: string; }</code> |

**Returns:** <code>Promise&lt;{ success: boolean; message?: string; }&gt;</code>

--------------------

</docgen-api>
