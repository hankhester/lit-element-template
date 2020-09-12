import { LitElement, html, customElement, property, css } from 'lit-element';

@customElement('app-root')
export class AppRoot extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }
  `;

  @property()
  name = 'World';

  @property({ type: Number })
  count = 0;

  render() {
    return html`
      <h1>Hello, ${this.name}!</h1>
      <button @click=${this.onClick} part="button">
        Click Count: ${this.count}
      </button>
      <slot></slot>
    `;
  }

  private onClick() {
    this.count++;
  }

  foo(): string {
    return 'foo';
  }
}
