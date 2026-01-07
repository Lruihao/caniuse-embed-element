import type { CaniuseEmbedElementProps } from './caniuse-embed-element'
import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import './caniuse-embed-element'
import './components/demo-section'
import './components/github-corner'
import './styles/index.css'

interface SelectItem {
  label: string
  value: string
}

@customElement('caniuse-embed-app')
export class CaniuseEmbedApp extends LitElement {
  @property({ type: String })
  feature: CaniuseEmbedElementProps['feature'] = ''

  @property({ type: Number })
  past: CaniuseEmbedElementProps['past'] = 2

  @property({ type: Number })
  future: CaniuseEmbedElementProps['future'] = 1

  @property({ type: String })
  theme: CaniuseEmbedElementProps['theme'] = 'auto'

  @property({ type: String })
  featureInput = ''

  @property({ type: String })
  searchTerm = ''

  @property({ type: Boolean })
  dropdownOpen = false

  @property({ type: Number })
  highlightedIndex = -1

  @property({ type: Boolean })
  baseline: CaniuseEmbedElementProps['baseline'] = false

  @property({ type: Number })
  private _scrollTop = 0

  @property({ type: Number })
  private _itemHeight = 60 // 每个选项的高度

  @property({ type: Number })
  private _visibleCount = 8 // 可见选项数量

  private _featureList: SelectItem[] = []

  private _filteredFeatureList: SelectItem[] = []

  async connectedCallback() {
    super.connectedCallback()
    this._getFeatureList()
    // 添加全局点击事件监听器来处理点击外部关闭下拉菜单
    document.addEventListener('click', this._handleClickOutside.bind(this))
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('click', this._handleClickOutside.bind(this))
  }

  private async _getFeatureList() {
    this._featureList = await fetch(`${DEFAULT_ORIGIN}/features.json`).then(res => res.json())
    this._filteredFeatureList = [...this._featureList]
    this.requestUpdate()
  }

  private _onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement
    this.searchTerm = target.value
    this._filterFeatures()
    this.highlightedIndex = -1 // 重置高亮索引
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (!this.dropdownOpen) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        this._toggleDropdown()
      }
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        this.highlightedIndex = Math.min(this.highlightedIndex + 1, this._filteredFeatureList.length - 1)
        this._scrollToHighlighted()
        break
      case 'ArrowUp':
        event.preventDefault()
        this.highlightedIndex = Math.max(this.highlightedIndex - 1, -1)
        this._scrollToHighlighted()
        break
      case 'Enter':
        event.preventDefault()
        if (this.highlightedIndex >= 0 && this.highlightedIndex < this._filteredFeatureList.length) {
          this._selectFeature(this._filteredFeatureList[this.highlightedIndex].value)
        }
        break
      case 'Escape':
        event.preventDefault()
        this.dropdownOpen = false
        this.requestUpdate()
        break
    }
  }

  private _onOptionsScroll(event: Event) {
    const target = event.target as HTMLElement
    this._scrollTop = target.scrollTop
    this.requestUpdate()
  }

  private _getVisibleRange() {
    const start = Math.floor(this._scrollTop / this._itemHeight)
    const end = Math.min(start + this._visibleCount + 2, this._filteredFeatureList.length)
    return { start: Math.max(0, start - 1), end }
  }

  private _scrollToHighlighted() {
    this.updateComplete.then(() => {
      const optionsContainer = this.shadowRoot?.querySelector('.options-container') as HTMLElement
      if (optionsContainer && this.highlightedIndex >= 0) {
        const targetScroll = this.highlightedIndex * this._itemHeight
        const containerHeight = optionsContainer.clientHeight
        const currentScroll = optionsContainer.scrollTop

        if (targetScroll < currentScroll) {
          optionsContainer.scrollTop = targetScroll
        }
        else if (targetScroll + this._itemHeight > currentScroll + containerHeight) {
          optionsContainer.scrollTop = targetScroll + this._itemHeight - containerHeight
        }
      }
    })
  }

  private _filterFeatures() {
    if (!this.searchTerm.trim()) {
      this._filteredFeatureList = [...this._featureList]
    }
    else {
      const searchLower = this.searchTerm.toLowerCase()
      this._filteredFeatureList = this._featureList.filter(item =>
        item.label.toLowerCase().includes(searchLower)
        || item.value.toLowerCase().includes(searchLower),
      )
    }
    this.highlightedIndex = -1 // 重置高亮索引
    this.requestUpdate()
  }

  private _selectFeature(value: string) {
    this.feature = value
    this.dropdownOpen = false
    // 找到选中项的标签并设置到搜索框
    const selectedItem = this._featureList.find(item => item.value === value)
    if (selectedItem) {
      this.searchTerm = selectedItem.label
    }
    this.requestUpdate()
  }

  private _toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen
    this.highlightedIndex = -1
    if (this.dropdownOpen) {
      this.searchTerm = ''
      this._filterFeatures()
      // 聚焦到搜索框
      this.updateComplete.then(() => {
        const searchInput = this.shadowRoot?.querySelector('.search-input') as HTMLInputElement
        searchInput?.focus()
      })
    }
  }

  private _handleClickOutside(event: Event) {
    const target = event.target as Element
    const dropdown = this.shadowRoot?.querySelector('.custom-select')
    if (dropdown && !dropdown.contains(target)) {
      this.dropdownOpen = false
      this.requestUpdate()
    }
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
    this.shadowRoot?.querySelector('.dynamic-demo-section')?.appendChild(liveDemo)
  }

  private _onPastVersionChange(event: Event) {
    const target = event.target as HTMLInputElement
    this.past = Number.parseInt(target.value) as CaniuseEmbedElementProps['past']
  }

  private _onFutureVersionChange(event: Event) {
    const target = event.target as HTMLInputElement
    this.future = Number.parseInt(target.value) as CaniuseEmbedElementProps['future']
  }

  private _onFeatureInputChange(event: Event) {
    const target = event.target as HTMLInputElement
    this.featureInput = target.value
  }

  private _onBaselineToggle(event: Event) {
    const target = event.target as HTMLInputElement
    this.baseline = target.checked
  }

  private _generateEmbedCode(): string {
    if (!this.feature) {
      return '<caniuse-embed></caniuse-embed>'
    }

    let code = `<caniuse-embed feature="${this.feature}"`

    if (this.past !== undefined && this.past !== 2) {
      code += ` past="${this.past}"`
    }

    if (this.future !== undefined && this.future !== 1) {
      code += ` future="${this.future}"`
    }

    if (this.theme !== 'auto') {
      code += ` theme="${this.theme}"`
    }

    if (this.baseline) {
      code += ` baseline`
    }

    code += '></caniuse-embed>'
    return code
  }

  introTemplate() {
    return html`
      <demo-section>
        <h2 slot="title">🎯 主要特性</h2>
        <p>使用 <a href="https://lit.dev" target="_blank">Lit</a> 构建，由 <a href="https://github.com/Lruihao" target="_blank">@Lruihao</a> 开发。</p>
        <ul>
          <li>✅ 完整的 TypeScript 类型支持</li>
          <li>✅ 支持所有主流前端框架</li>
          <li>✅ 自动高度调整</li>
          <li>✅ 多主题支持</li>
          <li>✅ 响应式设计</li>
          <li>✅ 现代 Web Components 标准</li>
        </ul>
      </demo-section>
    `
  }

  installTemplate() {
    return html`
      <demo-section>
        <h2 slot="title">📦 安装</h2>
        <p>使用 npm 安装：</p>
        <div class="code-block">
          <pre><code>npm install @cell-x/caniuse-embed-element</code></pre>
        </div>
        <p>或通过 CDN 引入：</p>
        <div class="code-block">
          <pre><code>&lt;script src="https://unpkg.com/@cell-x/caniuse-embed-element/dist/caniuse-embed-element.iife.js"&gt;&lt;/script&gt;</code></pre>
        </div>
        <p>然后在您的 HTML 中使用它：</p>
        <div class="code-block">
          <pre><code>&lt;caniuse-embed feature="css-grid"&gt;&lt;/caniuse-embed&gt;</code></pre>
        </div>
      </demo-section>
    `
  }

  frameworkIntegrationTemplate() {
    return html`
      <demo-section collapsed=true>
        <h2 slot="title">🪢 框架集成</h2>
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
    `
  }

  propsTemplate() {
    return html`
      <demo-section>
        <h2 slot="title">🛠️ 支持的属性</h2>
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
              <td>要显示的浏览器兼容性功能名称</td>
            </tr>
            <tr>
              <td><strong>past</strong></td>
              <td>显示过去的主版本数量 (0-5)，默认：<code class="inline-code">2</code></td>
            </tr>
            <tr>
              <td><strong>future</strong></td>
              <td>显示未来的主版本数量 (0-3)，默认：<code class="inline-code">1</code></td>
            </tr>
            <tr>
              <td><strong>baseline</strong></td>
              <td>是否显示功能支持基线，默认：<code class="inline-code">false</code></td>
            </tr>
            <tr>
              <td><strong>origin</strong></td>
              <td>自定义数据源，默认：<code class="inline-code">${DEFAULT_ORIGIN}</code></td>
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
              <td>唯一标识符，用于正确更新 iframe 高度（默认自动生成）</td>
            </tr>
          </tbody>
        </table>
      </demo-section>
    `
  }

  featureSelectTemplate() {
    const displayValue = this.feature
      ? (this._featureList.find(item => item.value === this.feature)?.label || this.feature)
      : '请选择一个特性...'

    const { start, end } = this._getVisibleRange()
    const visibleItems = this._filteredFeatureList.slice(start, end)
    const totalHeight = this._filteredFeatureList.length * this._itemHeight
    const offsetY = start * this._itemHeight

    return html`
      <h3>选择特性</h3>
      <p>你想展示什么特性？</p>
      <div class="custom-select" @click=${(e: Event) => e.stopPropagation()}>
        <div 
          class="select-trigger" 
          @click=${this._toggleDropdown}
          @keydown=${this._onKeyDown}
          tabindex="0"
          role="combobox"
          aria-expanded=${this.dropdownOpen}
          aria-haspopup="listbox"
        >
          <span class="select-value">${unsafeHTML(displayValue)}</span>
          <span class="select-arrow ${this.dropdownOpen ? 'open' : ''}">▼</span>
        </div>
        ${this.dropdownOpen
          ? html`
          <div class="select-dropdown" role="listbox">
            <div class="search-container">
              <input 
                type="text" 
                class="search-input"
                placeholder="搜索特性..."
                .value=${this.searchTerm}
                @input=${this._onSearchInput}
                @keydown=${this._onKeyDown}
                @click=${(e: Event) => e.stopPropagation()}
                aria-label="搜索特性"
              />
            </div>
            <div class="options-container" @scroll=${this._onOptionsScroll}>
              ${this._filteredFeatureList.length === 0
                ? html`<div class="no-results">未找到匹配的特性</div>`
                : html`
                  <div class="virtual-scroll-spacer" style="height: ${totalHeight}px;">
                    <div class="virtual-scroll-content" style="transform: translateY(${offsetY}px);">
                      ${repeat(visibleItems, item => item.value, (item) => {
                        const index = this._filteredFeatureList.indexOf(item)
                        return html`
                          <div 
                            class="option ${this.feature === item.value ? 'selected' : ''} ${index === this.highlightedIndex ? 'highlighted' : ''}"
                            @click=${() => this._selectFeature(item.value)}
                            @mouseenter=${() => { this.highlightedIndex = index }}
                            role="option"
                            aria-selected=${this.feature === item.value}
                            style="height: ${this._itemHeight}px;"
                          >
                            <span class="option-label">${unsafeHTML(item.label)}</span>
                            <span class="option-value">${item.value}</span>
                          </div>
                        `
                      })}
                    </div>
                  </div>
                `}
            </div>
          </div>
        `
          : ''}
      </div>
    `
  }

  settingsTemplate() {
    return html`
      <h3>附加设置</h3>
      <div class="settings-row">
        <div class="setting-item">
          <label for="past-versions">显示过去版本数量 (0-5)：</label>
          <input 
            type="range" 
            id="past-versions" 
            min="0" 
            max="5" 
            .value=${this.past?.toString()}
            @input=${this._onPastVersionChange}
            class="slider"
          />
          <span class="value-display">${this.past}</span>
        </div>
        
        <div class="setting-item">
          <label for="future-versions">显示未来版本数量 (0-3)：</label>
          <input 
            type="range" 
            id="future-versions" 
            min="0" 
            max="3" 
            .value=${this.future?.toString()}
            @input=${this._onFutureVersionChange}
            class="slider"
          />
          <span class="value-display">${this.future}</span>
        </div>
      </div>
    `
  }

  embedCodeTemplate() {
    const script = `${window.location.origin}${import.meta.env.BASE_URL}embed.js`
    return html`
      <h3>嵌入脚本</h3>
      <p>在您的文档中嵌入以下 JavaScript 文件：</p>
      <div class="code-block">
        <pre><code>&lt;script src="${script}"&gt;&lt;/script&gt;</code></pre>
      </div>
      
      <h3>获取嵌入代码</h3>
      <p>将此片段粘贴到您希望嵌入显示的位置：</p>
      <div class="code-block">
        <pre><code>${this._generateEmbedCode()}</code></pre>
      </div>
    `
  }

  liveDemoTemplate() {
    return html`
      <demo-section>
        <h2 slot="title">🌐 实时演示</h2>
        ${this.featureSelectTemplate()}
        ${this.settingsTemplate()}
        <h3>嵌入预览</h3>
        <div class="preview-controls">
          <div class="control-left">
            <label>功能支持基线：</label>
            <input 
              type="checkbox" 
              .checked=${this.baseline}
              @change=${this._onBaselineToggle}
            />
          </div>
          <div class="control-right">
            <span>主题切换：</span>
            <button @click=${this._toggleTheme} part="button">${this.theme}</button>
          </div>
        </div>
        <div class="live-demo">
          <caniuse-embed
            feature="${this.feature}" 
            past="${this.past}" 
            future="${this.future}" 
            theme="${this.theme}"
            ?baseline=${this.baseline}
          ></caniuse-embed>
        </div>
        ${this.feature ? this.embedCodeTemplate() : ''}
      </demo-section>
    `
  }

  dynamicDemoTemplate() {
    return html`
      <demo-section class="dynamic-demo-section" collapsed=true>
        <h2 slot="title">⛰️ 动态创建元素</h2>
        <p>和原生元素一样，在 JS 中可以使用 <code class="inline-code">document.createElement</code> 动态创建元素，点击创建查看效果：</p>
        <p>
          <input type="text" @input=${this._onFeatureInputChange} value=${this.featureInput} placeholder="输入特性名称" />
          <button @click=${this._createElementDynamically} part="button">创建</button>
        </p>
      </demo-section>
    `
  }

  render() {
    return html`
      <h1 class="text-center">🧩 &lt;caniuse-embed&gt; Element</h1>
      <p class="text-center">一个用于嵌入 caniuse.com 的特定功能的浏览器兼容性数据的自定义 Web 组件。</p>
      <caniuse-embed feature="custom-elementsv1"></caniuse-embed>

      ${this.introTemplate()}
      ${this.installTemplate()}
      ${this.frameworkIntegrationTemplate()}
      ${this.propsTemplate()}
      ${this.liveDemoTemplate()}
      ${this.dynamicDemoTemplate()}

      <github-corner></github-corner>
    `
  }

  static styles = css`
    .text-center {
      text-align: center;
    }
    .text-right {
      text-align: right;
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

    /* 设置表单样式 */
    .settings-row {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin: 20px 0;
    }

    .setting-item {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: nowrap;
      width: 60%;
    }

    .setting-item label {
      font-weight: 500;
      min-width: 160px;
      color: #333;
      flex-shrink: 0;
    }

    .slider {
      -webkit-appearance: none;
      appearance: none;
      height: 20px;
      border-radius: 3px;
      background: #ddd;
      outline: none;
      flex: 1;
      min-width: 120px;
      max-width: none;
      width: auto;
      box-sizing: border-box;
    }

    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #007acc;
      cursor: pointer;
      border: 2px solid #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #007acc;
      cursor: pointer;
      border: 2px solid #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .value-display {
      background: #007acc;
      color: white;
      padding: 0 4px;
      border-radius: 4px;
      font-weight: 500;
      min-width: 24px;
      text-align: center;
      font-size: 14px;
      flex-shrink: 0;
    }

    /* 移动端响应式设计 */
    @media (max-width: 768px) {
      .settings-row {
        gap: 16px;
      }

      .setting-item {
        flex-direction: row;
        align-items: center;
        gap: 8px;
        width: 100%;
        flex-wrap: nowrap;
      }

      .setting-item label {
        min-width: 120px;
        font-size: 13px;
        width: auto;
        flex-shrink: 0;
      }

      .slider {
        flex: 1;
        min-width: 80px;
        max-width: none;
        box-sizing: border-box;
      }

      .value-display {
        align-self: center;
        font-size: 12px;
        padding: 3px 6px;
        min-width: 20px;
      }
    }

    /* 超小屏幕优化 */
    @media (max-width: 480px) {
      .setting-item {
        padding: 0 5px;
        gap: 6px;
      }

      .setting-item label {
        font-size: 12px;
        line-height: 1.3;
        min-width: 100px;
      }

      .slider {
        margin: 0;
        min-width: 60px;
      }

      .value-display {
        font-size: 11px;
        padding: 2px 5px;
        min-width: 18px;
      }
    }

    /* 自定义选择器样式 */
    .custom-select {
      position: relative;
      width: 520px;
      max-width: 100%;
      margin: 16px 0;
    }

    .select-trigger {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      background-color: #ffffff;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 16px;
      min-height: 48px;
      box-sizing: border-box;
    }

    .select-trigger:hover {
      border-color: #007acc;
      box-shadow: 0 2px 8px rgba(0, 122, 204, 0.1);
    }

    .select-trigger:focus {
      outline: none;
      border-color: #007acc;
      box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
    }

    .select-value {
      flex: 1;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .select-value code {
      background-color: #f0f0f0;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 13px;
      color: #d63384;
      font-weight: normal;
    }

    .select-arrow {
      transition: transform 0.2s ease;
      color: #666;
      font-size: 12px;
      margin-left: 8px;
    }

    .select-arrow.open {
      transform: rotate(180deg);
    }

    .select-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 1000;
      background: #ffffff;
      border: 2px solid #e1e5e9;
      border-top: none;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      max-height: 300px;
      overflow: hidden;
    }

    .search-container {
      padding: 12px;
      border-bottom: 1px solid #e1e5e9;
      background-color: #f8f9fa;
    }

    .search-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      box-sizing: border-box;
      margin: 0;
    }

    .search-input:focus {
      outline: none;
      border-color: #007acc;
      box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
    }

    .options-container {
      max-height: 200px;
      overflow-y: auto;
      position: relative;
    }

    .virtual-scroll-spacer {
      position: relative;
      width: 100%;
    }

    .virtual-scroll-content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

    .option {
      padding: 12px 16px;
      cursor: pointer;
      transition: background-color 0.15s ease;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      flex-direction: column;
      gap: 4px;
      box-sizing: border-box;
    }

    .option:last-child {
      border-bottom: none;
    }

    .option:hover {
      background-color: #f8f9fa;
    }

    .option.selected {
      background-color: #e3f2fd;
      border-left: 3px solid #007acc;
    }

    .option.highlighted {
      background-color: #f0f8ff;
    }

    .option.selected.highlighted {
      background-color: #e3f2fd;
    }

    .option-label {
      font-weight: 500;
      color: #333;
      font-size: 14px;
    }

    .option-label code {
      background-color: #f0f0f0;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 13px;
      color: #d63384;
      font-weight: normal;
    }

    .option-value {
      font-size: 12px;
      color: #666;
      font-family: monospace;
    }

    .no-results {
      padding: 16px;
      text-align: center;
      color: #666;
      font-style: italic;
    }

    /* 暗色主题支持 */
    @media (prefers-color-scheme: dark) {
      .select-trigger {
        background-color: #2d2d2d;
        border-color: #444;
        color: #fff;
      }

      .select-trigger:hover {
        border-color: #007acc;
      }

      .select-dropdown {
        background-color: #2d2d2d;
        border-color: #444;
      }
      
      .select-value {
        color: #fff;
      }

      .select-value code {
        background-color: #3a3a3a;
        color: #ff79c6;
      }

      .select-arrow {
        color: #ccc;
      }

      .search-container {
        background-color: #333;
        border-color: #444;
      }

      .search-input {
        background-color: #2d2d2d;
        border-color: #444;
        color: #fff;
      }

      .search-input::placeholder {
        color: #999;
      }

      .option {
        border-color: #444;
      }

      .option:hover {
        background-color: #333;
      }

      .option.selected {
        background-color: #1a365d;
      }

      .option.highlighted {
        background-color: #2a4a6b;
      }

      .option.selected.highlighted {
        background-color: #1a365d;
      }

      .option-label {
        color: #fff;
      }

      .option-label code {
        background-color: #3a3a3a;
        color: #ff79c6;
      }

      .option-value {
        color: #ccc;
      }

      .no-results {
        color: #999;
      }

      /* 暗色主题下的表单样式 */
      .setting-item label {
        color: #fff;
      }

      .slider {
        background: #444;
      }
    }

    .preview-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 15px 0;
      gap: 20px;
    }

    .control-left,
    .control-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .control-left label,
    .control-right span {
      font-weight: 500;
      color: #333;
    }

    .control-left input[type="checkbox"] {
      width: auto;
      margin: 0;
      width: 20px;
      height: 20px;
      cursor: pointer;
      accent-color: #007acc;
    }

    @media (prefers-color-scheme: dark) {
      .control-left label,
      .control-right span {
        color: #fff;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'caniuse-embed-app': CaniuseEmbedApp
  }
}
