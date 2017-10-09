declare function saveAs(data: Blob, filename: string, noAutoBOM?: boolean): void;
declare module 'file-saver' {
  export = saveAs;
}
