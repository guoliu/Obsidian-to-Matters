import { writable } from 'svelte/store';
import type { Draft } from './PublishModal'; // adjust import path as needed

export const draftStore = writable<Draft | null>(null);
