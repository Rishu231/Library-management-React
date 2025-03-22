import React, { useState } from "react";
import API from "../services/api";

const BookForm = () => {
  const [book, setBook] = useState({
    title: "",
    author: "",
    published_date: "",
    isbn: "",
    available: true,
  });

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("api/books/create/", book, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // If JWT auth is required
        },
      });
      alert("Book created successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error creating book:", error);
      alert("Error creating book!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input type="text" name="title" className="form-control" value={book.title} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Author</label>
        <input type="text" name="author" className="form-control" value={book.author} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Published Date</label>
        <input type="date" name="published_date" className="form-control" value={book.published_date} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label className="form-label">ISBN</label>
        <input type="text" name="isbn" className="form-control" value={book.isbn} onChange={handleChange} required />
      </div>

      <button type="submit" className="btn btn-primary">Add Book</button>
    </form>
  );
};

export default BookForm;
