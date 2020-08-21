export interface EnumType { [s: number]: string; }


export function fromValue<T>(o: T, value: string): { [P in keyof T]: T[P] }[keyof T] {
  return (o as any)[value]; // No type safety here unfrotunately
}

