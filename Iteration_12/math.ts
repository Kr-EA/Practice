export const sum = (a: number, b: number): number => a + b;

export const divide = (a: number, b: number): number => {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
};

export const isAdult = (age: number): boolean => age >= 18;

export const getUser = async (id: number): Promise<{ id: number; name: string }> => {
  return { id, name: "John" };
};

export const processNumbers = (nums: number[]): number[] =>
  nums.filter(n => n > 0).map(n => n * 2);