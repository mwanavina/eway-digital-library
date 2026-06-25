// Mock file router for demonstration

export const ourFileRouter = {
  documentPdf: {
    $types: {} as never,
    routerConfig: {},
    routeOptions: {},
    inputParser: {} as never,
    middleware: async () => ({}) as any,
    onUploadComplete: async ({ file }: any) => {
      console.log('[v0] File uploaded:', file.name);
      return { uploadedBy: 'App', key: file.name, url: 'https://example.com/file.pdf' };
    },
    onUploadError: async () => undefined,
    errorFormatter: () => ({ message: 'Upload failed' }),
  },
} as const;

export type OurFileRouter = typeof ourFileRouter;
