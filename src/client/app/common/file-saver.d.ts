declare function saveFileAs(data: Blob, filename: string, noAutoBOM?: boolean): void;

declare module 'file-saver' { export = saveFileAs;}
