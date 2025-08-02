import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * Props for configuring the CaniuseEmbed component.
 *
 * @property feature - The identifier of the feature to display support data for (e.g., 'flexbox').
 * @property past - Number of past browser versions to display (0-5). Controls the historical data shown.
 * @property future - Number of future browser versions to display (0-3). Controls the preview of upcoming support.
 * @property origin - The origin URL to use for embedding, useful for specifying a custom or proxied caniuse.com endpoint.
 * @property theme - The color theme of the embed. Can be 'auto' (match system), 'light', or 'dark'.
 * @property meta - Additional metadata or configuration string for advanced customization.
 */
export interface CaniuseEmbedElementProps {
  feature?: string
  past?: 0 | 1 | 2 | 3 | 4 | 5
  future?: 0 | 1 | 2 | 3
  origin?: string
  theme?: 'auto' | 'light' | 'dark'
  loading?: 'eager' | 'lazy'
  meta?: string
}

/**
 * A custom web component that embeds caniuse.com browser compatibility data for a specific feature.
 *
 * This element displays an interactive iframe showing browser support information from caniuse.com.
 * It dynamically adjusts its height based on the content and provides customization options for
 * theme, time range, and data source.
 *
 * @example
 * ```html
 * <caniuse-embed feature="css-grid" theme="dark"></caniuse-embed>
 * ```
 */
@customElement('caniuse-embed')
export class CaniuseEmbedElement extends LitElement {
  /**
   * The name of the feature to display browser compatibility data for.
   * This should match a feature identifier from caniuse.com.
   * @example "css-grid", "flexbox", "es6-arrow-functions"
   */
  @property()
  feature = ''

  /**
   * Number of past major browser versions to display in the compatibility table.
   * Controls how far back in browser history the data extends.
   * @default 2
   */
  @property({ type: Number })
  past: 0 | 1 | 2 | 3 | 4 | 5 = 2

  /**
   * Number of future major browser versions to display in the compatibility table.
   * Controls how far into future browser versions the data extends.
   * @default 1
   */
  @property({ type: Number })
  future: 0 | 1 | 2 | 3 = 1

  /**
   * The base URL of the caniuse embed service.
   * Can be customized to use a different caniuse mirror or service.
   * @default "https://caniuse.lruihao.cn"
   */
  @property()
  origin = 'https://caniuse.lruihao.cn'

  /**
   * The color theme for the embedded content.
   * - 'auto': Follows system preference
   * - 'light': Light theme
   * - 'dark': Dark theme
   * @default "auto"
   */
  @property({ type: String })
  theme: 'auto' | 'light' | 'dark' = 'auto'

  /**
   * The loading strategy for the embedded iframe.
   * - 'eager': Loads immediately
   * - 'lazy': Loads when in viewport
   * @default "lazy"
   */
  @property()
  loading: 'eager' | 'lazy' = 'lazy'

  /**
   * A unique identifier for this embed instance.
   * Used to match messages from the iframe to this specific component instance.
   * Automatically generated on creation.
   */
  @property()
  meta = Math.random().toString(36).slice(2)

  /**
   * The current height of the embedded iframe in pixels.
   * Automatically updated based on content size via postMessage communication.
   * @private
   */
  private _iframeHeight = 500

  /**
   * Called when the element is added to the DOM.
   * Sets up the message listener for iframe communication.
   */
  connectedCallback() {
    super.connectedCallback()
    this.setupMessageListener()
  }

  /**
   * Called when the element is removed from the DOM.
   * Cleans up the message event listener to prevent memory leaks.
   */
  disconnectedCallback() {
    super.disconnectedCallback()
    window.removeEventListener('message', this.handleMessage)
  }

  /**
   * Sets up the global message event listener for iframe communication.
   * This allows the component to receive height updates from the embedded iframe.
   * @private
   */
  private setupMessageListener() {
    window.addEventListener('message', this.handleMessage)
  }

  /**
   * Handles incoming postMessage events from the embedded iframe.
   * Updates the iframe height when a valid message is received from the correct iframe instance.
   * @param ev - The MessageEvent containing data from the iframe
   * @private
   */
  private handleMessage = (ev: MessageEvent) => {
    const data = this.parseData(ev.data)
    const { type, payload = {} } = data
    if (type === 'ciu_embed') {
      if (payload.feature === this.feature && payload.meta === this.meta) {
        this._iframeHeight = Math.ceil(payload.height)
        this.requestUpdate()
      }
    }
  }

  /**
   * Safely parses incoming message data, handling both string and object formats.
   * @param data - The raw data from a postMessage event
   * @returns Parsed data object or empty object if parsing fails
   * @private
   */
  private parseData(data: unknown): any {
    try {
      return typeof data === 'string' ? JSON.parse(data) : data
    }
    catch {
      return {}
    }
  }

  /**
   * Generates the iframe source URL based on current component properties.
   * Constructs the URL with feature, meta, theme, and past version parameters.
   * @returns The complete URL for the iframe source, or empty string if no feature is specified
   * @private
   */
  private generateSource(): string {
    if (!this.feature)
      return ''
    const params = [
      `meta=${this.meta}`,
      `past=${this.past}`,
      `future=${this.future}`,
      `theme=${this.theme}`,
    ]
    return `${this.origin}/${this.feature}#${params.join('&')}`
  }

  /**
   * Renders the component's HTML template.
   * Shows either an iframe with caniuse data or a placeholder message when no feature is specified.
   * @returns The HTML template for this component
   */
  render() {
    const source = this.generateSource()
    if (!source) {
      return html`<p class="ciu-embed-empty"><span>Data on support for the features across the major browsers from <a href="https://caniuse.com" target="_blank">caniuse.com</a>.</span><br><span>See more at <a href="https://caniuse.lruihao.cn" target="_blank">caniuse.lruihao.cn</a>.</span></p>`
    }

    return html`<iframe class="ciu-embed-iframe" src="${source}" height="${this._iframeHeight}" allow="fullscreen" loading="${this.loading}"></iframe>`
  }

  /**
   * CSS styles for the component.
   * Defines styling for the host element, iframe, and empty state message.
   */
  static styles = css`:host { display: block; width: 100%; }.ciu-embed-iframe { display: block; width: 100%; border: none; border-radius: 0; }.ciu-embed-empty { color: var(--text-secondary, #919191); text-align: center; font-size: 12px; }.ciu-embed-empty a { color: inherit; text-decoration: none; }.ciu-embed-empty a:hover { text-decoration: underline; }`
}

declare global {
  interface Window {
    CaniuseEmbedElement: typeof CaniuseEmbedElement
  }
  interface HTMLElementTagNameMap {
    'caniuse-embed': CaniuseEmbedElement
  }
  interface HTMLElementPropsMap {
    'caniuse-embed': CaniuseEmbedElementProps
  }
}
