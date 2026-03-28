import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({ data: [] })),
      post: jest.fn(() => Promise.resolve({ data: {} })),
      put: jest.fn(() => Promise.resolve({ data: {} })),
      delete: jest.fn(() => Promise.resolve({ data: {} })),
    })),
  },
}));

test("renders app home heading", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /welcome to quickpoll/i })).toBeInTheDocument();
});
