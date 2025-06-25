// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
  },
};

// Example test: components/tasks/task-card.test.tsx
import { render } from "@testing-library/react";
import { TaskCard } from "./task-card";
const mockTask = { id: "1", title: "Test", priority: "low", status: "todo" };

test("renders task title", () => {
  const { getByText } = render(<TaskCard task={mockTask} />);
  expect(getByText("Test")).toBeInTheDocument();
});
