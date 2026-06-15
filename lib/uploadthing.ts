// Mock file router for demonstration

export const ourFileRouter = {
  documentPdf: {
    onUploadComplete: async ({ file }: any) => {
      console.log('[v0] File uploaded:', file.name);
      return { uploadedBy: "App", key: file.name, url: 'https://example.com/file.pdf' };
    },
  },
};

export type OurFileRouter = typeof ourFileRouter;
