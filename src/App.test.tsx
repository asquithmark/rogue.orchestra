import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the minimal public player without the personal artist name", () => {
    render(<App />);

    expect(screen.getByText("the rogue orchestra")).toBeInTheDocument();
    expect(screen.getByText("please don’t wake me up")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /credits/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open album menu/i })).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/Mark Asquith/i);
  });

  it("opens current-track credits with clickable attribution links", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /credits/i }));

    const dialog = screen.getByRole("dialog", { name: /track credits/i });
    expect(within(dialog).getByText(/Claude Debussy/i)).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: /Clair De Lune/i })).toHaveAttribute(
      "href",
      "https://youtu.be/-Bxpm0EmOMU"
    );
  });

  it("opens a minimal album menu with all 16 tracks and the about note", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /open album menu/i }));

    const dialog = screen.getByRole("dialog", { name: /album menu/i });
    expect(within(dialog).getByText("a 16-track album of original compositions, remakes, and quiet references.")).toBeInTheDocument();
    expect(within(dialog).getAllByRole("button")).toHaveLength(17);
    expect(within(dialog).getByText("eat, pray, love")).toBeInTheDocument();
  });
});
