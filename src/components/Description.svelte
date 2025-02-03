<script lang="ts">
  import { WEB_DOMAINS } from '../settings';
  import { draftStore } from '../stores';
  import type { Draft } from '../PublishModal';

  export let draft: Draft;
  export let environment: string;

  $: $draftStore = draft;
  $: settings = $draftStore?.settings;
</script>

<div class="description">
  {#each Object.entries(settings) as [field, index]}
    <p>
      <b
        >{field
          .replace(/([A-Z])/g, ' $1')
          .charAt(0)
          .toUpperCase() +
          field
            .replace(/([A-Z])/g, ' $1')
            .slice(1)
            .toLowerCase()}:</b
      >
      {#if field === 'collection'}
        {#each settings['collection'] as item, i}
          <a href={item.url} target="_blank">{item.title || item.url}</a>
          {#if i !== settings['collection'].length - 1},{/if}
        {/each}
      {:else if Array.isArray(settings[field])}
        {settings[field].length ? settings[field].join(', ') : '-'}
      {:else}
        {settings[field] || '-'}
      {/if}
    </p>
  {/each}

  {#if $draftStore?.id}
    <p>
      <b>Draft:</b>
      <a href={`${WEB_DOMAINS[environment]}/me/drafts/${$draftStore.id}`} target="_blank">
        View on Matters Town
      </a>
    </p>
  {/if}
</div>
