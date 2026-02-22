import { render } from "@testing-library/react";
import { Counter } from "./clicker";

test("matches snapshot", () => {
  const { container } = render(<Counter/>);
  expect(container).toMatchSnapshot();
});