import { css, html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * A section for displaying demos or examples within the documentation.
 *
 * @slot - The default slot for the demo content
 */
@customElement('demo-section')
export class DemoSection extends LitElement {
  render() {
    return html`
      <slot></slot>
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
    ::slotted(h2) {
      color: #007acc;
      border-bottom: 2px solid #007acc;
      padding-bottom: 5px;
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
