import { useEffect, useState } from "react";
import axios from "../services/api";

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get("api/books/")
      .then((res) => setBooks(res.data))
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  return (
    <div className="container mt-4 mb-4">
      <h2 className="mb-3">Book List</h2>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Published Date</th>
            <th>ISBN</th>
            <th>Available</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.published_date}</td>
                <td>{book.isbn}</td>
                <td>{book.available ? "Yes" : "No"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No books available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;
