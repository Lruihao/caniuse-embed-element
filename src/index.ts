import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import './caniuse-embed-element'
import './components/demo-section'
import './components/github-corner'
import type { CaniuseEmbedElementProps } from './caniuse-embed-element'

interface SelectOption {
  label: string
  value: string
}

@customElement('caniuse-embed-app')
export class CaniuseEmbedApp extends LitElement {
  @property({ type: String })
  theme: CaniuseEmbedElementProps['theme'] = 'auto'

  @property({ type: String })
  featureInput = ''

  private _featureList: SelectOption[] = []

  connectedCallback() {
    super.connectedCallback()
    this._getFeatureList()
  }

  private async _getFeatureList() {
    this._featureList = await fetch('https://caniuse.lruihao.cn/features.json').then(res => res.json())
    console.log('Feature list loaded:', this._featureList)
  }

  private _toggleTheme() {
    const themes: CaniuseEmbedElementProps['theme'][] = ['auto', 'light', 'dark']
    this.theme = themes[(themes.indexOf(this.theme) + 1) % themes.length]
  }

  private _createElementDynamically() {
    const dynamicElement = document.createElement('caniuse-embed')
    dynamicElement.feature = this.featureInput
    const liveDemo = document.createElement('div')
    liveDemo.className = 'live-demo'
    liveDemo.appendChild(dynamicElement)
    this.shadowRoot?.querySelector('.live-demo-section')?.appendChild(liveDemo)
  }

  render() {
    return html`
      <h1 class="text-center">🧩 &lt;caniuse-embed&gt; Element</h1>
      <p class="text-center">一个用于嵌入 caniuse.com 的特定功能的浏览器兼容性数据的自定义 Web 组件。</p>

      <demo-section>
        <h2>🎯 主要特性</h2>
        <p>使用 <a href="https://lit.dev" target="_blank">Lit</a> 构建，由 <a href="https://github.com/Lruihao/caniuse-embed-element" target="_blank">@Lruihao</a> 开发。</p>
        <ul>
          <li>✅ 完整的 TypeScript 类型支持</li>
          <li>✅ 支持所有主流前端框架</li>
          <li>✅ 自动高度调整</li>
          <li>✅ 多主题支持</li>
          <li>✅ 响应式设计</li>
          <li>✅ 现代 Web Components 标准</li>
        </ul>
      </demo-section>

      <demo-section>
        <h2>📦 安装</h2>
        <p>使用 npm 安装：</p>
        <div class="code-block">
          <pre><code>npm install @cell-x/caniuse-embed-element</code></pre>
        </div>
        <p>或通过 CDN 引入：</p>
        <div class="code-block">
          <pre><code>&lt;script src="https://unpkg.com/@cell-x/caniuse-embed-element/dist/caniuse-embed-element.iife.js"&gt;&lt;/script&gt;</code></pre>
        </div>
      </demo-section>

      <demo-section>
        <h2>👾 框架集成</h2>
        <p>🟢 Vue 3 集成</p>
        <div class="code-block">
          <pre><code>&lt;script setup&gt;
import '@cell-x/caniuse-embed-element'
&lt;/script&gt;

&lt;template&gt;
  &lt;div&gt;
    &lt;caniuse-embed 
      feature="css-grid" 
      theme="dark" 
      :past="3"
      :future="2"
    /&gt;
  &lt;/div&gt;
&lt;/template&gt;
</code></pre>
        </div>
        <p>⚛️ React 集成</p>
        <div class="code-block">
          <pre><code>import '@cell-x/caniuse-embed-element'

function App() {
  return (
    &lt;div&gt;
      &lt;caniuse-embed 
        feature="css-grid" 
        theme="dark" 
        past={3}
        future={2}
      /&gt;
    &lt;/div&gt;
  )
}</code></pre>
        </div>
        <p>💡 更多信息请查看文档 <a href="https://github.com/Lruihao/caniuse-embed-element/blob/main/FRAMEWORK_INTEGRATION.md#vue-3" target="_blank">FRAMEWORK_INTEGRATION.md</a></p>
      </demo-section>

      <demo-section class="live-demo-section">
        <h2>🌐 实时演示</h2>
        <div class="live-demo">
          <caniuse-embed></caniuse-embed>
        </div>
        <h3>选择特性</h3>
        <p>你想展示什么特性？</p>
        <p>主题切换（当前为：<code class="inline-code">${this.theme}</code>）：<button @click=${this._toggleTheme} part="button">切换</button></p>
        <div class="live-demo">
          <caniuse-embed feature="css-grid" theme="${this.theme}"></caniuse-embed>
        </div>
        <p>
          和原生元素一样，也可以使用 <code class="inline-code">document.createElement</code> 动态创建元素，查看效果：
          <input type="text" @input=${(e: Event) => {
            const target = e.target as HTMLInputElement
            this.featureInput = target.value
          }} value=${this.featureInput} placeholder="输入特性名称" />
          <button @click=${this._createElementDynamically} part="button">创建</button>
        </p>
      </demo-section>

      <demo-section>
        <h2>🛠️ 支持的属性</h2>
        <table>
          <thead>
            <tr>
              <th>属性</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>feature</strong></td>
              <td>要显示的浏览器兼容性功能名称，详见：<a href="https://caniuse.lruihao.cn/">https://caniuse.lruihao.cn</a></td>
            </tr>
            <tr>
              <td><strong>past</strong></td>
              <td>显示过去的主版本数量 (0-5)，默认：<code class="inline-code">3</code></td>
            </tr>
            <tr>
              <td><strong>future</strong></td>
              <td>显示未来的主版本数量 (0-3)，默认：<code class="inline-code">2</code></td>
            </tr>
            <tr>
              <td><strong>origin</strong></td>
              <td>自定义数据源，默认：<code class="inline-code">https://caniuse.lruihao.cn</code></td>
            </tr>
            <tr>
              <td><strong>theme</strong></td>
              <td>主题 ('auto' | 'light' | 'dark')，默认：<code class="inline-code">auto</code></td>
            </tr>
            <tr>
              <td><strong>loading</strong></td>
              <td>iframe 的加载策略 ('eager' | 'lazy')，默认：<code class="inline-code">lazy</code></td>
            </tr>
            <tr>
              <td><strong>meta</strong></td>
              <td>唯一标识符（自动生成）</td>
            </tr>
          </tbody>
        </table>
      </demo-section>

      <github-corner></github-corner>
    `
  }

  static styles = css`
    .text-center {
      text-align: center;
    }
    a {
      font-weight: 500;
      color: #007acc;
      text-decoration: inherit;
    }
    a:hover {
      text-decoration: underline;
    }
    input {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0.5em;
      font-size: 1em;
      width: 200px;
      margin-right: 10px;
    }
    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.5em 1em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      border-color: #ddd;
      background-color: var(--button-background-color);
      transition: border-color 0.25s;
    }
    input:hover,
    button:hover,
    button:focus {
      border-color: #007acc;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }
    pre {
      margin: 0;
      line-height: 1.45;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      padding: 12px;
      border: 1px solid #ddd;
      text-align: left;
    }
    th {
      background-color: var(--th-background-color);
      font-weight: bold;
    }
    tr:nth-child(even) {
      background-color: var(--tr-even-background-color);
    }
    .inline-code  {
      background-color: var(--code-background-color);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'caniuse-embed-app': CaniuseEmbedApp
  }
}
