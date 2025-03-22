import BookList from "../Components/BookList";
import BookForm from "../Components/BookForm";

const Books = () => (
  <div className="container mt-5">
    <div className="container col-4"> <h2>Manage Books</h2></div>
    <BookForm />
    <BookList />
  </div>
);

export default Books;
