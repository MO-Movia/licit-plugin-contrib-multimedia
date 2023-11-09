export type ImageProps = {
  height: number;
  id: string;
  src: string;
  width: number;
};

export type AVProps = ImageProps & {
  isAudio: boolean;
};

export type EditorVideoRuntime = {
  // Video Proxy
  canProxyVideoSrc?: (src: string) => boolean;
  getProxyVideoSrc?: (src: string) => string;
  getVideoSrc?: (id: string) => Promise<string>;

  // Video Upload
  canUploadVideo?: () => boolean;
  uploadVideo?: (obj: Blob) => Promise<AVProps>;
};

export type EditorAudioRuntime = {
  // audio Proxy
  canProxyAudioSrc?: (src: string) => boolean;
  getProxyAudioSrc?: (src: string) => string;
  getAudioSrc?: (id: string) => Promise<string>;

  // audio Upload
  canUploadAudio?: () => boolean;
  uploadAudio?: (obj: Blob) => Promise<AVProps>;
};

export type EditorImageRuntime = {
  // Image Proxy
  canProxyImageSrc?: (src: string) => boolean;
  getProxyImageSrc?: (src: string) => Promise<string>;

  // Image Upload
  canUploadImage?: () => boolean;
  uploadImage?: (obj: Blob) => Promise<ImageProps>;
};
