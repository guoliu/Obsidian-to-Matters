import { WEB_DOMAINS } from '../settings';
import { translations } from '../translations';
import type { DraftSettings } from '../types/article';

export class Description {
  private container: HTMLElement;
  private settings: DraftSettings;
  private environment: string;

  constructor(container: HTMLElement, settings: DraftSettings, environment: string) {
    this.container = container;
    this.settings = settings;
    this.environment = environment;
    this.render();
  }

  private createField(label: string, content: HTMLElement): HTMLElement {
    const p = document.createElement('p');

    const labelEl = document.createElement('b');
    labelEl.textContent = `${translations().frontmatter[label]}: `;

    p.appendChild(labelEl);
    p.appendChild(content);
    return p;
  }

  private formatValue(field: string, value: any): HTMLElement {
    const span = document.createElement('span');

    if (field === 'collection' && Array.isArray(value) && value.length > 0) {
      value.forEach((item, i) => {
        const link = document.createElement('a');
        link.href = item.url;
        link.target = '_blank';
        link.textContent = item.title || item.url;
        span.appendChild(link);

        if (i !== value.length - 1) {
          span.appendChild(document.createTextNode(', '));
        }
      });
    } else if (Array.isArray(value)) {
      span.textContent = value.length ? value.join(', ') : '-';
    } else if (typeof value === 'boolean') {
      span.textContent = value ? translations().allowed : translations().notAllowed;
    } else {
      span.textContent = value || '-';
    }

    return span;
  }

  render() {
    this.container.empty();
    const { id, ...frontmatter } = this.settings;

    // Add all frontmatter fields
    Object.entries(frontmatter).forEach(([field, value]) => {
      const formattedValue = this.formatValue(field, value);
      const fieldElement = this.createField(field, formattedValue);
      this.container.appendChild(fieldElement);
    });

    // Add draft link if available
    if (id) {
      const link = document.createElement('a');
      link.href = `${WEB_DOMAINS[this.environment]}/me/drafts/${id}`;
      link.target = '_blank';
      link.textContent = translations().viewOnMatters;

      this.container.appendChild(link);
    }
  }

  update(settings: DraftSettings) {
    this.settings = settings;
    this.render();
  }
}
