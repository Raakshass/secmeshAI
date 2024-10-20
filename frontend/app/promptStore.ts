import { create } from 'zustand';

interface PromptState {
  query: string;
  userInput: string;
  output: string;
  setQuery: (query: string) => void;
  setUserInput: (input: string) => void;
  setOutput: (output: string) => void;
}

const usePromptStore = create<PromptState>((set) => ({
  query: '', // The first query from the Models page
  userInput: '', // The second query from the Prompt page
  output: '', // Processed output or result
  
  setQuery: (query) => set({ query }),
  setUserInput: (input) => set({ userInput: input }),
  setOutput: (output) => set({ output }),
}));

export default usePromptStore;
