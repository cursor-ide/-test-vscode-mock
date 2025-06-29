import type { Extension } from './types';

export const extensions = {
  all: [] as Extension<any>[],

  getExtension: <T>(id: string): Extension<T> | undefined => ({
    id,
    extensionPath: `/extensions/${id}`,
    packageJSON: {},
    isActive: false,
    activate: async () => {
      console.log(`[ActivateExtension] ${id}`);
      return {} as T;
    },
    exports: {} as T,
  }),
};