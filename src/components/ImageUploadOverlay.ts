import { setIcon } from 'obsidian';

export class ImageUploadOverlay {
  private container: HTMLElement;
  private overlayEl: HTMLElement;
  private iconEl: HTMLElement;

  constructor(container: HTMLElement, onRetry: () => void) {
    this.container = container;

    // Create overlay element
    this.overlayEl = document.createElement('div');
    this.overlayEl.addClass('image-upload-overlay');
    this.overlayEl.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Create icon element
    this.iconEl = document.createElement('div');
    this.iconEl.style.cssText = `
      width: 24px;
      height: 24px;
      color: white;
    `;

    this.overlayEl.appendChild(this.iconEl);
    this.container.appendChild(this.overlayEl);

    // Add retry click handler
    this.overlayEl.addEventListener('click', (e) => {
      if (this.overlayEl.classList.contains('error')) {
        onRetry();
      }
    });
  }

  setState(state: 'loading' | 'error') {
    if (state === 'loading') {
      this.overlayEl.classList.remove('error');
      this.overlayEl.style.cursor = 'default';
      this.overlayEl.style.background = 'rgba(0, 0, 0, 0.5)';
      setIcon(this.iconEl, 'loader-2');
      this.iconEl.classList.add('loading');
    } else {
      this.overlayEl.classList.add('error');
      this.overlayEl.style.cursor = 'pointer';
      this.overlayEl.style.background = 'rgba(255, 0, 0, 0.3)';
      setIcon(this.iconEl, 'rotate-ccw');
      this.iconEl.classList.remove('loading');
    }
  }

  destroy() {
    this.container.removeChild(this.overlayEl);
  }
}
