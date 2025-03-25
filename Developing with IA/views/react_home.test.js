import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "./react_home"; // Asegúrate de importar correctamente tu componente principal

test("renders the list of books", () => {
  const books = [
    { _id: "1", title: "Book One" },
    { _id: "2", title: "Book Two" },
  ];
  
  render(<App initialBooks={books} />);
  
  expect(screen.getByText("Book One")).toBeInTheDocument();
  expect(screen.getByText("Book Two")).toBeInTheDocument();
});

test("navigates to book details on click", () => {
  const books = [{ _id: "1", title: "Book One" }];
  
  render(<App initialBooks={books} />);
  
  fireEvent.click(screen.getByText("Book One"));
  
  expect(screen.getByText("Details of Book One")).toBeInTheDocument();
});
