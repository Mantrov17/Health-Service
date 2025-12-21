import { render, screen } from "@testing-library/react";

const ExampleComponent = () => {
  return <div data-testid="example">Hello World</div>;
};

describe("ExampleComponent", () => {
  it("renders correctly", () => {
    render(<ExampleComponent />);
    expect(screen.getByTestId("example")).toHaveTextContent("Hello World");
  });
});
