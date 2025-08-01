import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import './caniuse-embed-element'
import type { CaniuseEmbedElementProps } from './caniuse-embed-element'

@customElement('caniuse-embed-app')
export class CaniuseEmbedApp extends LitElement {
  @property({ type: String })
  theme: CaniuseEmbedElementProps['theme'] = 'auto'

  @property({ type: String })
  feature = 'flexbox'

  private _toggleTheme() {
    const themes: CaniuseEmbedElementProps['theme'][] = ['auto', 'light', 'dark']
    this.theme = themes[(themes.indexOf(this.theme) + 1) % themes.length]
  }

  private _createElementDynamically() {
    const dynamicElement = document.createElement('caniuse-embed')
    dynamicElement.feature = this.feature
    const liveDemo = document.createElement('div')
    liveDemo.className = 'live-demo'
    liveDemo.appendChild(dynamicElement)
    this.shadowRoot?.querySelector('.live-demo-section')?.appendChild(liveDemo)
  }

  render() {
    return html`
      <h1>🧩 &lt;caniuse-embed&gt; Element</h1>
      <p class="subtitle">一个自定义的 Web 组件，用于嵌入 caniuse.com 的特定功能的浏览器兼容性数据。</p>

      <div class="demo-section">
        <h2>📦 安装</h2>
        <p>使用 npm 安装：</p>
        <div class="code-block">
          <pre><code>npm install @cell-x/caniuse-embed-element</code></pre>
        </div>
        <p>或通过 CDN 引入：</p>
        <div class="code-block">
          <pre><code>&lt;script src="https://unpkg.com/@cell-x/caniuse-embed-element/dist/caniuse-embed-element.iife.js"&gt;&lt;/script&gt;</code></pre>
        </div>
        <p>在 HTML 中使用：</p>
        <div class="code-block">
          <pre><code>&lt;caniuse-embed feature="css-grid"&gt;&lt;/caniuse-embed&gt;</code></pre>
        </div>
      </div>
      <div class="demo-section">
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
              <td>iframe 的加载策略 ('eager' | 'lazy')，默认：<code class="inline-code">eager</code></td>
            </tr>
            <tr>
              <td><strong>meta</strong></td>
              <td>唯一标识符（自动生成）</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="demo-section">
        <h2>🎯 主要特性</h2>
        <ul>
          <li>✅ 完整的 TypeScript 类型支持</li>
          <li>✅ 支持所有主流前端框架</li>
          <li>✅ 自动高度调整</li>
          <li>✅ 多主题支持</li>
          <li>✅ 响应式设计</li>
          <li>✅ 现代 Web Components 标准</li>
        </ul>
      </div>

      <div class="demo-section">
        <h2>🟢 Vue 3 集成</h2>
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
        <p>💡 更多信息请查看文档 <a href="https://github.com/Lruihao/caniuse-embed-element/blob/main/FRAMEWORK_INTEGRATION.md#vue-3">FRAMEWORK_INTEGRATION.md</a></p>
      </div>

      <div class="demo-section">
        <h2>⚛️ React 集成</h2>
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
        <p>💡 更多信息请查看文档 <a href="https://github.com/Lruihao/caniuse-embed-element/blob/main/FRAMEWORK_INTEGRATION.md#react">FRAMEWORK_INTEGRATION.md</a></p>
      </div>

      <div class="demo-section live-demo-section">
        <h2>🌐 实时演示</h2>
        <p>以下是一些实际运行的组件示例：</p>
        <p>指定特性（<code class="inline-code">feature</code>）</p>
        <div class="live-demo">
          <caniuse-embed feature="css-grid"></caniuse-embed>
        </div>
        <p>不指定 <code class="inline-code">feature</code>时：</p>
        <div class="live-demo">
          <caniuse-embed></caniuse-embed>
        </div>
        <p>显示过去 3 个版本（<code class="inline-code">past</code>）：</p>
        <div class="live-demo">
          <caniuse-embed feature="css-grid" past="3"></caniuse-embed>
        </div>
        <p>显示未来 2 个版本（<code class="inline-code">future</code>）：</p>
        <div class="live-demo">
          <caniuse-embed feature="css-grid" future="2"></caniuse-embed>
        </div>
        <p>自定义数据源（<code class="inline-code">origin</code>）：<code class="inline-code">https://caniuse.pengzhanbo.cn</code></p>
        <div class="live-demo">
          <caniuse-embed feature="css-grid" origin="https://caniuse.pengzhanbo.cn"></caniuse-embed>
        </div>
        <p>主题切换（当前为：<code class="inline-code">${this.theme}</code>）：<button @click=${this._toggleTheme} part="button">切换</button></p>
        <div class="live-demo">
          <caniuse-embed feature="css-grid" theme="${this.theme}"></caniuse-embed>
        </div>
        <p>动态创建元素：</p>
        <p>
          输入 <code class="inline-code">feature</code> 查看效果：
          <input type="text" @input=${(e: Event) => {
            const target = e.target as HTMLInputElement
            this.feature = target.value
          }} value=${this.feature} placeholder="输入特性名称" />
          <button @click=${this._createElementDynamically} part="button">创建</button>
        </p>
      </div>

      <a href="https://github.com/Lruihao/caniuse-embed-element" class="github-corner" aria-label="View source on GitHub">
        <svg width="80" height="80" viewBox="0 0 250 250" aria-hidden="true">
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
          <path
            d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
            fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm" />
          <path
            d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
            fill="currentColor" class="octo-body" />
        </svg>
      </a>
    `
  }

  static styles = css`
    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
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
      background-color: #1a1a1a;
      cursor: pointer;
      border-color: #ddd;
      transition: border-color 0.25s;
    }
    input:hover,
    button:hover,
    button:focus {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }
    .inline-code {
      background-color: #f5f5f5;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
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
      background-color: #f2f2f2;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    .demo-section {
      background: white;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .code-block {
      background: #f8f8f8;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
      margin: 10px 0;
      border-left: 4px solid #007acc;
    }
    pre {
      margin: 0;
      overflow-x: auto;
      line-height: 1.45;
    }
    h1 {
      color: #333;
      text-align: center;
    }
    h2 {
      color: #007acc;
      border-bottom: 2px solid #007acc;
      padding-bottom: 5px;
    }
    .subtitle {
      color: #666;
      text-align: center;
    }
    .live-demo {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 15px;
      margin: 15px 0;
    }
    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
    .github-corner:hover .octo-arm {
      animation: octocat-wave 560ms ease-in-out;
    }
    .github-corner svg {
      fill: #151513;
      color: #fff;
      position: fixed;
      top: 0;
      border: 0;
      right: 0;
    }

    @keyframes octocat-wave {
      0%,
      100% {
        transform: rotate(0);
      }
      20%,
      60% {
        transform: rotate(-25deg);
      }
      40%,
      80% {
        transform: rotate(10deg);
      }
    }

    @media (max-width: 500px) {
      .github-corner:hover .octo-arm {
        animation: none;
      }
      .github-corner .octo-arm {
        animation: octocat-wave 560ms ease-in-out;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'caniuse-embed-app': CaniuseEmbedApp
  }
}
