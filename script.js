// DOM Object
todoListObject = document.getElementById("todo-list");
newTodoBtn = document.getElementById("add-btn");
removeAllBtn = document.getElementById("remove-all");
overlay = document.querySelector(".overlay");
inputTitle = document.getElementById("input-todo-title");
inputDescription = document.getElementById("input-todo-description");

// Variabler
const baseApiUrl = "https://dummyjson.com/todos";
let todoList = JSON.parse(localStorage.getItem("todos"));
let order = 1;
// Hårdkodar ett userId då api't behöver det vid callsen. I detta fall spelar det ingen roll vad id't är
let userId = 1;
// order är ordningen i renderingen
class Todo {
	constructor(id, title, description, state, check) {
		this.id = id;
		this.order = order;
		this.title = title;
		this.description = description;
		this.created = getDate();
		this.completed = state || false;
		this.completedDate = check;
		this.userId = userId;
	}
}
// funktion för att visa/ta bort "add todo" rutan
function toggleOverlay() {
	event.preventDefault();
	overlay.classList.toggle("hidden");
}

// hämtar forms och stoppar submit sen kör funktionen addNewTodo
// prettier-ignore
document.getElementById("input-form").addEventListener("submit", function (event) {
		event.preventDefault();
		addNewTodo();
	});

// funktion för att lägga till todo. använder "fake" responsen till att göra ett nytt object i listan
function addNewTodo() {
	let title = inputTitle.value;
	let description = inputDescription.value;
	fetch(`${baseApiUrl}/add`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			todo: title,
			completed: false,
			userId: userId,
		}),
	})
		.then((res) => res.json())
		.then((todoData) => {
			let createdTodo = new Todo(todoData.id, todoData.todo, description);
			todoList.push(createdTodo);
			renderTodos(todoList);
		});
	toggleOverlay();
}

// "fake" PUT request, använder responsen till att göra ändringar på objectet i listan
async function updateTodo(clicked) {
	target = clicked.id - 1;
	targetApiId = todoList[target].id;
	console.log(targetApiId);
	// Om det är egentillagd todo
	if (targetApiId > 150) {
		if (todoList[target].completed === false) {
			console.log("den kommer hit");
			todoList[target].completed = true;
			todoList[target].completedDate = getDate();
			return clicked.classList.toggle("done"), renderTodos(todoList);
		}
		if (todoList[target].completed === true) {
			todoList[target].completed = false;
			todoList[target].completedDate = undefined;
			return clicked.classList.toggle("done"), renderTodos(todoList);
		}

		// om det är en från todo apin
	} else if (targetApiId < 150) {
		if (todoList[target].completed === false) {
			await fetch(`${baseApiUrl}/${targetApiId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					completed: true,
				}),
			})
				.then((res) => res.json())
				.then((todoData) => {
					todoList[target].completed = todoData.completed;
					todoList[target].completedDate = getDate();
				});
		} else {
			await fetch(`${baseApiUrl}/${targetApiId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					completed: false,
				}),
			})
				.then((res) => res.json())
				.then((todoData) => {
					todoList[target].completed = todoData.completed;
					todoList[target].completedDate = undefined;
				});
		}
		clicked.classList.toggle("done");
		renderTodos(todoList);
	}
}
function removeTodo(clicked) {
	// tar bort egna tillagda todos
	target = clicked.id - 1;
	targetApiId = todoList[target].id;
	if (targetApiId > 150) {
		todoList.splice(target, 1);
		renderTodos(todoList);
	} else {
		//  "fake" DELETE post, skickas bara om id't finns i Apin, lite långsammare eftersom den måste gå igenom samtliga för att hitta vilken den ska ta bort
		fetch(`${baseApiUrl}/${todoList[target].id}`, {
			method: "DELETE",
		})
			.then((res) => res.json())
			.then((todoData) => {
				for (const [key, value] of Object.entries(todoList)) {
					if (value.id === todoData.id) {
						todoList.splice(key, 1);
						renderTodos(todoList);
					}
				}
			});
	}
}

// Tar bort samtliga todos - vid nästa refresh hämtar den 30 todos från apin
function removeAllTodos() {
	localStorage.clear();
}

// funktion som returnerar datum -> YYYY-MM-DD
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
	order = 1;
	todoListObject.innerHTML = "";
	todoList.forEach((todo) => {
		todoItem = document.createElement("li");
		todoItem.classList.add("todo");
		if (todo.completed === true) {
			todoItem.classList.add("done");
		}

		//varje gång jag kallar på render så sätts order till 1 och ökar med iteration, för att jag ska kunna ändra arrayn
		todoItem.id = order;

		actions = document.createElement("div");
		actions.classList.add("actions");

		//check och ta-bort knappar
		checkBtn = '<i class="btn complete-todo" data-feather="check"></i>';
		removeBtn = '<i class="btn remove-todo" data-feather="x"></i>';

		actions.innerHTML = checkBtn + removeBtn;
		//eventListener på div'en runt knapparna
		actions.addEventListener("click", (event) => {
			let clickedBtn = event.target;
			let clickedTodo = event.target.parentElement.parentElement;
			if (
				clickedTodo.classList.contains("todo") &&
				clickedBtn.classList.contains("complete-todo")
			) {
				updateTodo(clickedTodo);
			}
			if (
				clickedTodo.classList.contains("todo") &&
				clickedBtn.classList.contains("remove-todo")
			) {
				removeTodo(clickedTodo);
			}
		});
		// title
		todoTitle = document.createElement("h3");
		todoTitle.classList.add("todo-heading");
		todoTitle.innerHTML = todo.title;

		// description
		todoDescription = document.createElement("p");
		todoDescription.classList.add("description");
		if (!todo.description) {
			todoDescription.innerHTML = "No description provided";
		} else {
			todoDescription.innerHTML = todo.description;
		}
		// Timestamps
		createdTimestamp = document.createElement("span");
		createdTimestamp.classList.add("created-timestamp");
		createdTimestamp.innerHTML = "CREATED: " + todo.created;
		completedTimestamp = document.createElement("span");
		completedTimestamp.classList.add("completed-timestamp");
		if (todo.completed === true) {
			completedTimestamp.innerHTML = "DONE: " + todo.completedDate;
		}

		//appendar
		todoItem.append(
			todoTitle,
			actions,
			todoDescription,
			createdTimestamp,
			completedTimestamp
		);
		todoListObject.append(todoItem);
		order++;
	});

	// uppdaterar ikoner
	feather.replace();
	localStorage.todos = JSON.stringify(todoList);
}

function fetchTodos() {
	fetch(baseApiUrl)
		.then((res) => res.json())
		.then((todoData) => {
			let data = todoData.todos;
			data.forEach((todo) => {
				// Om fetchade todos redan är "done" vid fetch ger jag dom bara dagens datum för "completed" timestamp.
				let check = todo.completed;
				if (todo.completed === true) {
					check = getDate();
				}
				// för samstämmighet gör jag nya object av dom fetchade todos'en
				let currentTodo = new Todo(
					todo.id,
					todo.todo,
					undefined,
					todo.completed,
					check
				);
				todoList.push(currentTodo);
			});
			renderTodos(todoList);
			return todoList;
		});
}

function main() {
	// Om localstorage inte har nån data hämtar den från apin. Annars renderar den datan
	if (!todoList) {
		todoList = [];
		fetchTodos();
	} else {
		renderTodos(todoList);
	}
}

main();
