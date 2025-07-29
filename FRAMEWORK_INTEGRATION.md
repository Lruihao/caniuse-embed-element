# Framework Integration

This package provides TypeScript declarations for popular frameworks to ensure proper type safety and IntelliSense support.

```jsx
import '@cell-x/caniuse-embed-element'

function App() {
  return (
    <div>
      <caniuse-embed
        feature="css-grid"
        theme="dark"
        past={3}
        future={2}
      />
    </div>
  )
}
```

## Vue 3

```vue
<template>
  <div>
    <caniuse-embed
      feature="css-grid"
      theme="dark"
      :past="3"
      :future="2"
    />
  </div>
</template>

<script setup>
import '@cell-x/caniuse-embed-element'
</script>
```

## Angular

For Angular, you need to add the custom element schema:

```typescript
// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import '@cell-x/caniuse-embed-element'

@NgModule({
  // ... other config
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
```

```html
<!-- component.html -->
<caniuse-embed
  feature="css-grid"
  theme="dark"
  [past]="3"
  [future]="2">
</caniuse-embed>
```

## Svelte

```svelte
<script>
  import '@cell-x/caniuse-embed-element'
</script>

<caniuse-embed
  feature="css-grid"
  theme="dark"
  past={3}
  future={2}
/>
```

## Solid.js

```jsx
import '@cell-x/caniuse-embed-element'

function App() {
  return (
    <div>
      <caniuse-embed
        feature="css-grid"
        theme="dark"
        past={3}
        future={2}
      />
    </div>
  )
}
```

## Vanilla JavaScript/HTML

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://unpkg.com/@cell-x/caniuse-embed-element"></script>
</head>
<body>
  <caniuse-embed
    feature="css-grid"
    theme="dark"
    past="3"
    future="2">
  </caniuse-embed>
</body>
</html>
```
