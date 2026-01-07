import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * A section for displaying demos or examples within the documentation.
 *
 * @slot - The default slot for the demo content
 * @slot title - The title slot for the section header
 */
@customElement('demo-section')
export class DemoSection extends LitElement {
  @property({ type: Boolean })
  collapsible = true

  @property({ type: Boolean })
  collapsed = false

  private _toggleCollapse() {
    this.collapsed = !this.collapsed
  }

  render() {
    return html`
      <div class="section-container">
        ${this.collapsible
          ? html`
            <div class="section-header" @click=${this._toggleCollapse}>
              <div class="header-content">
                <slot name="title"></slot>
                <span class="toggle-icon ${this.collapsed ? 'collapsed' : ''}">${this.collapsed ? '▶' : '▼'}</span>
              </div>
            </div>
          `
          : html`<slot name="title"></slot>`}
        <div class="section-content ${this.collapsed ? 'collapsed' : ''}">
          <slot></slot>
        </div>
      </div>
    `
  }

  static styles = css`
    :host {
      display: block;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
      box-shadow: 0 2px 4px var(--demo-shadow);
    }

    .section-container {
      display: flex;
      flex-direction: column;
    }

    .section-header {
      cursor: pointer;
      user-select: none;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .section-header:hover .toggle-icon {
      opacity: 1;
    }

    .toggle-icon {
      display: inline-block;
      transition: transform 0.3s ease, opacity 0.2s ease;
      color: #007acc;
      font-size: 14px;
      opacity: 0.7;
      flex-shrink: 0;
    }

    .section-content {
      overflow: hidden;
      transition: height 0.3s ease, opacity 0.3s ease;
      height: auto;
      opacity: 1;
      interpolate-size: allow-keywords;
    }

    .section-content.collapsed {
      height: 0;
      opacity: 0;
    }

    ::slotted(h2) {
      color: #007acc;
      padding-bottom: 8px;
      margin: 0;
      position: relative;
    }

    ::slotted(h2)::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: #007acc;
      transition: width 0.3s ease;
    }

    .section-header:hover ::slotted(h2)::after {
      width: 100%;
    }

    ::slotted(.live-demo) {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 15px;
      margin: 15px 0;
    }
    ::slotted(.code-block) {
      background: var(--code-background-color);
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
      margin: 10px 0;
      border-left: 4px solid #007acc;
    }

    @media only screen and (max-width: 680px) {
      ::slotted(.live-demo) {
        padding: 0;
      }
      ::slotted(.live-demo):has(caniuse-embed[feature]) {
        border: none;
      }
      :host {
        padding: 15px;
        margin: 15px 0;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-section': DemoSection
  }
}
