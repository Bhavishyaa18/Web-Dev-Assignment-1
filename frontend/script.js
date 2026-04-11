const input = document.getElementById("taskInput");
const prioritySelect = document.getElementById("priority");
const taskList = document.getElementById("taskList");

// LOAD TASKS
async function loadTasks() {
  const res = await fetch("http://localhost:3000/tasks");
  const tasks = await res.json();

  renderTasks(tasks);
}

function renderTasks(tasks) {
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = `${task.title} (${task.priority})`;

    if (task.isDone) {
      text.style.textDecoration = "line-through";
      text.style.color = "gray";
    }

    const actions = document.createElement("div");

    const doneBtn = document.createElement("button");
    doneBtn.textContent = task.isDone ? "Undo" : "Done";
    doneBtn.onclick = () => toggleTask(task.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteTask(task.id);

    actions.appendChild(doneBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(text);
    li.appendChild(actions);

    taskList.appendChild(li);
  });
}

// ADD TASK
async function addTask(title, priority) {
  await fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, priority }),
  });

  loadTasks();
}

// DELETE TASK
async function deleteTask(id) {
  await fetch(`http://localhost:3000/tasks/${id}`, {
    method: "DELETE",
  });

  loadTasks();
}

// TOGGLE TASK
async function toggleTask(id) {
  await fetch(`http://localhost:3000/tasks/${id}/status`, {
    method: "PATCH",
  });

  loadTasks();
}

async function handleAddClick() {
  const title = input.value;
  const priority = prioritySelect.value;

  if (!title) return;

  // Optimistic UI update
  const tempTask = {
    id: Date.now(),
    title,
    priority,
    isDone: 0
  };

  renderTasks([tempTask, ...taskList.children]);

  await addTask(title, priority);

  input.value = "";
}