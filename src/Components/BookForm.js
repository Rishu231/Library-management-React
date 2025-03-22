// import React, { useState } from "react";
// import API from "../services/api";

// const BookForm = () => {
// const [book, setBook] = useState({
//   title: "",
//   author: "",
//   published_date: "",
//   isbn: "",
//   available: true,
// });

// const handleChange = (e) => {
//   setBook({ ...book, [e.target.name]: e.target.value });
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const response = await API.post("api/books/create/", book, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("access_token")}`, // If JWT auth is required
//       },
//     });
//     alert("Book created successfully!");
//     console.log(response.data);
//   } catch (error) {
//     console.error("Error creating book:", error);
//     alert("Error creating book!");
//   }
// };

// return (
//   <form onSubmit={handleSubmit} className="container mt-4">
//     <div className="mb-3">
//       <label className="form-label">Title</label>
//       <input type="text" name="title" className="form-control" value={book.title} onChange={handleChange} required />
//     </div>

//     <div className="mb-3">
//       <label className="form-label">Author</label>
//       <input type="text" name="author" className="form-control" value={book.author} onChange={handleChange} required />
//     </div>

//     <div className="mb-3">
//       <label className="form-label">Published Date</label>
//       <input type="date" name="published_date" className="form-control" value={book.published_date} onChange={handleChange} required />
//     </div>

//     <div className="mb-3">
//       <label className="form-label">ISBN</label>
//       <input type="text" name="isbn" className="form-control" value={book.isbn} onChange={handleChange} required />
//     </div>

//     <button type="submit" className="btn btn-primary">Add Book</button>
//   </form>
// );
// };

// export default BookForm;


import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import API from "../services/api";

const BookForm = () => {
  const [book, setBook] = useState({
    title: "",
    author: "",
    published_date: "",
    isbn: "",
    available: true,
  });

  const [books, setBooks] = useState([]); // Book list
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch books from API
  const fetchBooks = async () => {
    try {
      const response = await API.get("api/books/");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  // Handle book creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("api/books/create/", book);
      alert("Book added successfully!");
      fetchBooks();
    } catch (error) {
      console.error("Error creating book:", error);
      alert("Error creating book!");
    }
  };

  // Open modal for editing a book
  const handleEditClick = (book) => {
    setEditingBook(book);
    setShowModal(true);
  };

  // Handle book update
  const handleUpdate = async () => {
    try {
      await API.put(`api/books/update/${editingBook.id}/`, editingBook);
      alert("Book updated successfully!");
      setShowModal(false);
      fetchBooks();
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  // Handle book deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await API.delete(`api/books/delete/${id}/`);
        alert("Book deleted successfully!");
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Book Management</h2>

      {/* Book Form */}
      <form onSubmit={handleSubmit}>
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

      {/* Book List Table */}
      <h3 className="mt-5">Book List</h3>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published Date</th>
            <th>ISBN</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.published_date}</td>
              <td>{b.isbn}</td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => handleEditClick(b)}>Update</button>
                <button className="btn btn-danger" onClick={() => handleDelete(b.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Modal */}
      {editingBook && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input type="text" name="title" className="form-control" value={editingBook.title} onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })} />
            </div>

            <div className="mb-3">
              <label className="form-label">Author</label>
              <input type="text" name="author" className="form-control" value={editingBook.author} onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })} />
            </div>

            <div className="mb-3">
              <label className="form-label">Published Date</label>
              <input type="date" name="published_date" className="form-control" value={editingBook.published_date} onChange={(e) => setEditingBook({ ...editingBook, published_date: e.target.value })} />
            </div>

            <div className="mb-3">
              <label className="form-label">ISBN</label>
              <input type="text" name="isbn" className="form-control" value={editingBook.isbn} onChange={(e) => setEditingBook({ ...editingBook, isbn: e.target.value })} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default BookForm;
