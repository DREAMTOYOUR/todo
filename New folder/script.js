let todos = [];
if (localStorage.getItem("todos")) {
    todos = JSON.parse(localStorage.getItem("todos"));
}
const form = document.getElementById("form");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("desc");
const result = document.querySelector(".result");
const count = document.querySelector(".count");

let editingTodoId = null; // To track if we are editing a todo

// Form submission handler
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    const description = descInput.value.trim();

    if (title === "") {
        alert("Please enter a title!");
        return;
    }

    if (editingTodoId) {
        // Edit existing todo
        const index = todos.findIndex(todo => todo.id === editingTodoId);
        if (index !== -1) {
            todos[index].title = title;
            todos[index].description = description;
        }
        editingTodoId = null;
    } else {
        // Add new todo
        const newTodo = {
            id: Date.now(),
            title: title,
            description: description,
            completed: false
        };
        todos.push(newTodo);
    }

    form.reset();
    renderTodos();
});

// Render todos in the UI
function renderTodos() {
    result.innerHTML = ""; // Clear previous items

    todos.forEach(todo => {
        const todoDiv = document.createElement("div");
        todoDiv.className = "todo";

        // Checkbox for completion
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.addEventListener("change", () => {
            todo.completed = !todo.completed;
            renderTodos();
        });

        // Todo content
        const p = document.createElement("p");
        p.innerHTML = `<strong>${todo.title}</strong><br>${todo.description}`;
        if (todo.completed) {
            p.style.textDecoration = "line-through";
            p.style.opacity = "0.6";
        }

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit";
        editBtn.addEventListener("click", () => {
            titleInput.value = todo.title;
            descInput.value = todo.description;
            editingTodoId = todo.id;
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete";
        deleteBtn.addEventListener("click", () => {
            todos = todos.filter(t => t.id !== todo.id);
            renderTodos();
        });

        // Append elements
        todoDiv.appendChild(checkbox);
        todoDiv.appendChild(p);
        todoDiv.appendChild(editBtn);
        todoDiv.appendChild(deleteBtn);
        result.appendChild(todoDiv);

        localStorage.setItem("todos" , JSON.stringify(todos));
    });

    // Update count of active (incomplete) todos
    const activeTodos = todos.filter(todo => !todo.completed).length;
    count.textContent = `${activeTodos} Todos left`;
}
