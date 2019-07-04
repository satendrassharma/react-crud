import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Listitem from "./components/Listitem";
import axios from "axios";
import loading from "./source.gif";

class App extends React.Component {
  state = {
    loading: true,
    alerttext: "",
    notification: false,
    newTodo: "",
    editmode: false,
    editid: null,
    todos: []
  };

  url = "https://5d1ddc373374890014f009ee.mockapi.io/";
  async componentDidMount() {
    const res = await axios.get(`${this.url}/todos`);
    // console.log(res.data);
    this.setState({
      todos: res.data,
      loading: false
    });
  }

  alert = alerttext => {
    this.setState({
      notification: true,
      alerttext
    });

    setTimeout(() => {
      this.setState({
        notification: false,
        alerttext: ""
      });
    }, 2000);
  };
  addTodo = async () => {
    // const newTodo = {
    //   id:
    //     this.state.todos.length > 0
    //       ? this.state.todos[this.state.todos.length - 1].id + 1
    //       : 1,
    //   name: this.state.newTodo
    // };
    const res = await axios.post(`${this.url}/todos`, {
      name: this.state.newTodo
    });
    //clone todos
    const todos = this.state.todos;
    todos.push(res.data);

    this.setState(
      {
        todos,
        newTodo: ""
      },
      this.alert("todo add successfully")
    );
  };
  EditTodo = id => {
    const todo = this.state.todos.filter(item => item.id === id);
    this.setState({
      newTodo: todo[0].name,
      editmode: true,
      editid: id
    });
  };
  deleteTodo = async id => {
    await axios.delete(`${this.url}/todos/${id}`);
    this.setState(
      ps => ({
        todos: ps.todos.filter(item => item.id !== id)
      }),
      this.alert("todo deleted successfully..")
    );
  };
  handleTodo = e => {
    this.setState({
      newTodo: e.target.value
    });
  };
  updateTodo = async () => {
    const id = this.state.editid;
    const index = this.state.todos.findIndex(item => item.id === id);
    await axios.put(`${this.url}/todos/${id}`, {
      name: this.state.newTodo
    });
    const oldTodo = this.state.todos;
    oldTodo[index].name = this.state.newTodo;
    this.setState(
      {
        todos: oldTodo,
        editmode: false,
        newTodo: "",
        editid: null
      },
      this.alert("todo updated successfully")
    );
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2 className="text-dark ">React Crud</h2>
          <div className="container ">
            <div className="row">
              <div className="col-xs-12 col-md-3" />
              <div className="col-xs-12 col-md-6">
                {this.state.notification && (
                  <div className="alert alert-success" role="alert">
                    {this.state.alerttext}
                  </div>
                )}
                <input
                  type="text"
                  className="form-control mt-4"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Add todo to list"
                  onChange={this.handleTodo}
                  value={this.state.newTodo}
                />
                <button
                  className="btn btn-info my-4 btn-block"
                  onClick={this.state.editmode ? this.updateTodo : this.addTodo}
                  disabled={this.state.newTodo.length < 5}
                >
                  {this.state.editmode ? "Update Todo" : "Add Todo"}
                </button>
                {this.state.loading && (
                  <img
                    style={{ width: "300px", backgroundColor: "white" }}
                    src={loading}
                    alt="..."
                  />
                )}
                {!this.state.editmode && !this.state.loading && (
                  <ul className="list-group py-4">
                    {this.state.todos.map(({ id, name }) => {
                      return (
                        <Listitem
                          key={id}
                          name={name}
                          EditTodo={() => this.EditTodo(id)}
                          deleteTodo={() => this.deleteTodo(id)}
                        />
                      );
                    })}
                  </ul>
                )}
              </div>
              <div className="col-xs-12 col-md-3" />
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
