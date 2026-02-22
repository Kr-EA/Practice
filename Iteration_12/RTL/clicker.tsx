import { JSX, useState } from "react";

export const Counter = (): JSX.Element => {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={() => setCount(prev => prev + 1)}>
        +
      </button>
    </div>
  );
};