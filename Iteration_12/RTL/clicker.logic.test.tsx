import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Counter } from "./clicker";

test("increments counter on click", () => {
  render(<Counter />);

  const button = screen.getByText("+");
  const count = screen.getByTestId("count");

  expect(count).toHaveTextContent("0");

  fireEvent.click(button);

  expect(count).toHaveTextContent("1");
});