import { useEffect, useState } from "react";
import api from "../api";
import Note from "../components/Note";
import '../styles/Home.css'

function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  };
  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status == 204) alert("note deleted successfully");
        else alert("Failed to delete the Note");
        getNotes();
      })
      .catch((error) => console.log(error));
  };
  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status == 201) alert("Note created SuccessFully");
        else alert("Failed to Create the Note");
        getNotes();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
        <a href="/logout">Logout</a><br />
        <a href="/register">Register</a><br />
        <a href="/login">Login</a>
      <div>
        <h1>Notes</h1>
        {notes.map((note) => (
            <Note note={note} onDelete={deleteNote} key={note.id} />
        ))}
      </div>
      <h1>Create Note</h1>
      <form onSubmit={createNote}>
        <input
          type="text"
          value={title}
          name="title"
          placeholder="Enter Title"
          id="title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          name="content"
          id="content"
          value={content}
          placeholder="Enter Content"
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
export default Home;
