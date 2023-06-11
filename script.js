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

let todoList = JSON.parse(localStorage.getItem("todos") || "[]");

function createTodo() {}

function removeAllTodos() {
	localStorage.clear();
}

let todo = new Todo("this is title", "this is description");
function getDate() {
	let newDate = new Date();
	let year = newDate.getFullYear();
	let month = newDate.getMonth();
	let day = newDate.getDate();
	if (month < 10) {
		month = "0" + newDate.getMonth();
	}
	if (day < 10) {
		day = "0" + newDate.getDate();
	}
	return year + "-" + month + "-" + day;
}

function renderTodos(todoList) {
	let todoId = 1;
	if (!todoList) {
		return;
	}
	todoList.forEach((todo) => {
		todoItem = document.createElement("li");
		todoItem.classList.add("todo");
		if (todo.completed === true) {
			todoItem.classList.add("done");
		}
		todoItem.id = todoId;

		actions = document.createElement("div");
		actions.classList.add("actions");

		checkBtn = '<i class="btn complete-todo" data-feather="check"></i>';
		removeBtn = '<i class="btn remove-todo" data-feather="x"></i>';

		actions.innerHTML = checkBtn + removeBtn;
		actions.addEventListener("click", (event) => {
			let clickedBtn = event.target;
			console.log(clickedBtn.classList.value);
			let clicked = event.target.parentElement.parentElement;
			if (
				clicked.classList.contains("todo") &&
				clickedBtn.classList.contains("complete-todo")
			) {
				clicked.classList.toggle("done");
			}
		});

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

		createdTimestamp = document.createElement("span");
		createdTimestamp.classList.add("created-timestamp");
		// Om det inte finns nåt datum så tar den bara dagens datum
		if (!todo.created) {
			createdTimestamp.innerHTML = "Created: " + getDate();
		}
		completedTimestamp = document.createElement("span");
		completedTimestamp.classList.add("completed-timestamp");

		todoItem.append(
			todoTitle,
			actions,
			todoDescription,
			createdTimestamp,
			completedTimestamp
		);
		todoListObject.append(todoItem);

		todoId++;
	});
	feather.replace();
}

function fetchTodos() {
	fetch("https://dummyjson.com/todos")
		.then((res) => res.json())
		.then((todoData) => {
			todoList = todoData.todos;
			renderTodos(todoList);
			localStorage.todos = JSON.stringify(todoList);
			return todoList;
		});
}

let storage = localStorage.getItem("todos");
function main() {
	if (!storage) {
		console.log("hämtade från APIN");
		fetchTodos();
		localStorage.todos = JSON.stringify(todoList);
	} else {
		console.log("hade data i localstorage");
		renderTodos(todoList);
	}
}

main();
