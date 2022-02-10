declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.webp";

declare global {
  interface Window {
    chrome: {
      webview: {
        postMessage: (s: string) => void;
        addEventListener: (
          t: "message",
          l: (this: Document, e: { data: string }) => any
        ) => void;
        removeEventListener: (
          t: "message",
          l: (this: Document, e: { data: string }) => any
        ) => void;
      };
    };
  }
}

export {};
