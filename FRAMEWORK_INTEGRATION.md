# Framework Integration

```bash
npm install @cell-x/caniuse-embed-element
```

This package provides TypeScript declarations for popular frameworks to ensure proper type safety and IntelliSense support.

## Vanilla JavaScript/HTML

```html
<!DOCTYPE html>
<html>
<head>
  <script async src="https://unpkg.com/@cell-x/caniuse-embed-element/dist/caniuse-embed-element.iife.js"></script>
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

## Vue 3

> [!TIP]
>
> [Skipping Component Resolution](https://vuejs.org/guide/extras/web-components.html#skipping-component-resolution)
>
> To let Vue know that certain elements should be treated as custom elements and skip component resolution, we can specify the [`compilerOptions.isCustomElement` option](https://vuejs.org/api/application.html#app-config-compileroptions).

```js
// vite.config.js
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: tag => tag.includes('-')
        }
      }
    }),
    vueJsx({
      // treat all tags with a dash as custom elements
      isCustomElement: tag => tag.includes('-')
    }),
  ]
}
```

If you're using ESLint with Vue, you may need to configure it to ignore the custom element:

```js
// eslint.config.js
export default {
  rules: {
    'vue/component-name-in-template-casing': [
      'warn',
      'PascalCase',
      {
        registeredComponentsOnly: false,
        ignores: ['/^icon-/', 'caniuse-embed'],
      },
    ],
  },
}
```

```vue
<script setup>
import '@cell-x/caniuse-embed-element'
</script>

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
```

## Vue 2

[Live Demo](https://lruihao.github.io/vue-el-demo/#/caniuse-embed-element)

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

<script>
import '@cell-x/caniuse-embed-element'

export default {
  name: 'MyComponent',
}
</script>
```

## React

Declare the custom element in your React project by adding the following to your `index.d.ts` or a similar type declaration file:

```ts
declare namespace React {
  declare namespace JSX {
    interface IntrinsicElements {
      'caniuse-embed': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & HTMLElementPropsMap['caniuse-embed']
    }
  }
}
```

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
