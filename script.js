// DOM Object
todoListObject = document.getElementById("todo-list");
newTodoBtn = document.getElementById("add-btn");
removeAllBtn = document.getElementById("remove-all");

class Todo {
	constructor(id, title, description) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.created = new Date();
		this.completed = false;
		this.completedDate = undefined;
	}
}

let todoList = [];
let storage = localStorage.getItem("todos");

function createTodo() {}

function removeAllTodos() {}

let todo = new Todo("this is title", "this is description");

function renderTodos(todoList) {
	let todoId = 1;
	if (!todoList) {
		return;
	}
	todoList.forEach((todo) => {
		todoItem = document.createElement("li");
		todoItem.classList.add("todo");
		todoItem.id = todoId;

		actions = document.createElement("div");
		actions.classList.add("actions");

		checkBtn = '<i class="btn complete-todo" data-feather="check"></i>';
		removeBtn = '<i class="btn remove-todo" data-feather="x"></i>';

		actions.innerHTML = checkBtn + removeBtn;

		todoTitle = document.createElement("h3");
		todoTitle.classList.add("todo-heading");
		todoTitle.innerHTML = todo.todo;

		todoDescription = document.createElement("p");
		todoDescription.classList.add("description");
		if (!todo.description) {
			todoDescription.innerHTML = "No description provided";
		} else {
			todoDescription = todo.description;
		}
		todoItem.append(todoTitle, actions, todoDescription);
		todoListObject.append(todoItem);
		todoId++;
	});
	feather.replace();
}

renderTodos(todoList);

function main() {
	if (!storage) {
		fetchTodos();
	}
	function fetchTodos() {
		fetch("https://dummyjson.com/todos")
			.then((res) => res.json())
			.then((todoData) => {
				todoList = todoData.todos;
				renderTodos(todoList);
				return todoList;
			});
	}
}

main();
