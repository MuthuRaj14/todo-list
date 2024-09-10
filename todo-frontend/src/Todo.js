import { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [todos, setTodos] = useState([]);
  const [error, seterror] = useState("");
  const [message, setmessage] = useState("");

  const [editId, setEditId] = useState(-1);

  const apiUrl = "http://localhost:8000";

  const handleSubmit = () => {
    seterror("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => res.json())
        .then((newTodo) => {
          setTodos([...todos, newTodo]); // Add the new todo with its _id
          setTitle("");
          setDescription("");
          setmessage("Item added successfully");
          setTimeout(() => {
            setmessage("");
          }, 3000);
        })
        .catch(() => {
          seterror("Unable to create Todo list");
        });
    }
  };
  

  useEffect(() => {
    getItems();
  }, []);
  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setTodos(res);
      });
  };

  const handleEdit =(item)=>{
    setEditId(item._id) ; 
    setEditTitle(item.title) ; 
    setEditDescription(item.description)
  }


  const handleUpdate = () => {
    seterror("");
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiUrl + "/todos/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then((res) => {
          if (res.ok) {
            const updatedTodos = todos.map((item) => {
              if (item._id === editId) {
                return { ...item, title: editTitle, description: editDescription };
              }
              return item;
            });
            setTodos(updatedTodos);
            setmessage("Item updated successfully");
            setTimeout(() => {
              setmessage("");
            }, 3000);
            setEditId(-1);
          } else {
            seterror("Unable to update Todo list");
          }
        })
        .catch(() => {
          seterror("Unable to update Todo list");
        });
    }
  };
  

  const handleEditCancel =()=>{
    setEditId(-1)
  }

  const handleDelete =(id)=>{
    if(window.confirm('Are you sure do you want to delete')){
      fetch(apiUrl+'/todos/'+id , {
        method:"DELETE"
      }).then(()=>{
        const updatedTodos = todos.filter((item)=> item._id !== id)
        setTodos(updatedTodos)
      })
    }
  }
  return (
    <>
      <div className="row p-3 bg-success text-light">
        <h1>ToDo Project with MERN stack</h1>
      </div>
      <div className="row mx-4">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="Title"
            className="form-control"
            type="text"
          />
          <input
            value={description}
            placeholder="Description"
            className="form-control"
            type="text"
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>
      <div className="row mt-3 mx-4">
        <h3>Tasks</h3>
        <ul className="list-group">
          {todos.map((item) => (
            <li className="list-group-item my-2 bg-secondary align-items-center d-flex justify-content-between">
              <div className="d-flex flex-column me-2">
                {editId == -1 || editId !== item._id ? (
                  <>
                    <span className="fw-bold text-light">{item.title}</span>
                    <span className="text-light">{item.description}</span>
                  </>
                ) : (
                  <>
                    <div className="form-group d-flex gap-2">
                      <input
                        onChange={(e) => setEditTitle(e.target.value)}
                        value={editTitle}
                        placeholder="Title"
                        className="form-control"
                        type="text"
                      />
                      <input
                        value={editDescription}
                        placeholder="Description"
                        className="form-control"
                        type="text"
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                      
                    </div>
                  </>
                )}
              </div>

              <div className="d-flex gap-2">
                { editId == -1 || editId !== item._id? <button
                  onClick={()=>handleEdit(item)}
                  className="btn btn-warning"
                >
                  Edit
                </button> : <button onClick={handleUpdate} className="btn btn-warning">Update</button>}
                { editId == -1 || editId !== item._id?<button className="btn btn-danger" onClick={()=>handleDelete(item._id)}>Delete</button>
                :<button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>
                }
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
