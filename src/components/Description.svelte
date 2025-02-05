<script lang="ts">
  import { onDestroy } from 'svelte';
  import { WEB_DOMAINS } from '../settings';
  import { draftStore } from '../stores';
  import { translations } from '../translations';

  let { environment, settings } = $props();

  const unsubscribe = draftStore.subscribe((value) => {
    settings = value;
  });

  const { id, ...frontmatter } = settings;

  onDestroy(() => {
    unsubscribe();
  });
</script>

<div>
  {#each Object.entries(frontmatter) as [field, value]}
    <p>
      <b>
        {translations().frontmatter[field]}:
      </b>
      <span>
        {#if field === 'collection' && Array.isArray(value)}
          {#each value as item, i}
            <a href={item.url} target="_blank">{item.title || item.url}</a>
            {#if i !== value.length - 1},
            {/if}
          {/each}
        {:else if Array.isArray(value)}
          {value.length ? value.join(', ') : '-'}
        {:else if typeof value === 'boolean'}
          {value ? translations().allowed : translations().notAllowed}
        {:else}
          {value || '-'}
        {/if}
      </span>
    </p>
  {/each}

  {#if id}
    <p>
      <b>{translations().draft}:</b>
      <a href={`${WEB_DOMAINS[environment]}/me/drafts/${settings.id}`} target="_blank">
        {translations().viewOnMatters}
      </a>
    </p>
  {/if}
</div>
