<script lang="ts">
  import { setIcon } from 'obsidian';

  let uploadState = $state('loading');
  let { onRetry, initialState = 'loading' } = $props<{
    onRetry: () => void;
    initialState?: 'loading' | 'error';
  }>();

  $effect(() => {
    uploadState = initialState;
  });

  let overlayEl = $state<HTMLDivElement>();

  $effect(() => {
    if (overlayEl) {
      setIcon(overlayEl, uploadState === 'loading' ? 'loader-2' : 'rotate-ccw');
    }
  });
</script>

<div
  class="image-upload-overlay"
  class:error={uploadState === 'error'}
  bind:this={overlayEl}
  on:click={() => uploadState === 'error' && onRetry()}
></div>

<style>
  .image-upload-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .image-upload-overlay :global(svg) {
    width: 24px;
    height: 24px;
    color: white;
  }

  .loading :global(svg) {
    animation: spin 1s linear infinite;
  }

  .error {
    cursor: pointer;
    background: rgba(255, 0, 0, 0.3);
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
