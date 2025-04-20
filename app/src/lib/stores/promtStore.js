import { writable } from 'svelte/store';

const createUserPromptStore = () => {
  let initialValue = '';

  // Only access localStorage on the client
  if (typeof window !== 'undefined') {
    initialValue = localStorage.getItem('userPrompt') || '';
  }

  const store = writable(initialValue);

  // Subscribe only on the client
  if (typeof window !== 'undefined') {
    store.subscribe((value) => {
      localStorage.setItem('userPrompt', value);
    });
  }

  return store;
};

export const userPrompt = createUserPromptStore();
