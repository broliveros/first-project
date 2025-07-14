document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("task-form");
    const input = document.getElementById("task-input");
    const list = document.getElementById("task-list");

    const filterButtons = document.querySelectorAll("#filter-buttons button");
    let currentFilter = "all";

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            currentFilter = button.dataset.filter;

            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            renderTasks();
        });
    });

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks() {
        list.innerHTML = "";

        tasks.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        });

        tasks.forEach((task, index) => {
            const isCompleted = task.completed;

            if (
                currentFilter === "active" && isCompleted ||
                currentFilter === "completed" && !isCompleted
            ) {
                return;
            }

            const li = document.createElement("li");
            const now = new Date();
            if (task.dueDate) {
                const dueDate = new Date(task.dueDate);
                const timeDiff = dueDate - now;
                const oneDay = 24 * 60 *60 * 1000;

                if (timeDiff < -oneDay) {
                    li.classList.add("task-overdue");
                } else if (timeDiff < oneDay) {
                    li.classList.add("task-due-soon");
                } else {
                    li.classList.add("task-future");
                }
             }
            
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = isCompleted;
            checkbox.addEventListener("change", () => {
                task.completed = checkbox.checked;
                saveTasks();
                renderTasks();
            });

            const span = document.createElement("span");
            if (task.dueDate) {
                span.innerHTML = `${task.text} <br><small style="color:gray;"><em>Due: ${task.dueDate}</em></small>`;
            } else {
                span.textContent = task.text;
            }

            if (isCompleted) span.classList.add("completed");
        
            const due = document.createElement("small");
            due.style.fontStyle = "italic";

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "X";
            deleteBtn.className = "delete-btn";
            deleteBtn.addEventListener("click", () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.className = "edit-btn";
            editBtn.addEventListener("click", () => {
                const editInput = document.createElement("input");
                editInput.type = "text";
                editInput.value = task.text;

                const editDate = document.createElement("input");
                editDate.type = "date";
                editDate.value = task.dueDate || "";

                const saveBtn = document.createElement("button");
                saveBtn.textContent = "Save";
                saveBtn.className = "save-btn";

                const cancelBtn = document.createElement("button");
                cancelBtn.textContent = "Cancel";
                cancelBtn.className = "cancel-btn";
            
            li.innerHTML = "";
            li.appendChild(checkbox);
            li.appendChild(editInput);
            li.appendChild(editDate);
            li.appendChild(saveBtn);
            li.appendChild(cancelBtn);

            saveBtn.addEventListener("click", () => {
                task.text = editInput.value.trim();
                task.dueDate = editDate.value;
                saveTasks();
                renderTasks();
             });

            cancelBtn.addEventListener("click", () => {
                renderTasks();
             });
    });

        li.appendChild(editBtn);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskText = input.value.trim();
        const dueDate = document.getElementById("due-date").value;

        if (!taskText) return;

        tasks.push({ text: taskText, completed: false, dueDate });
        saveTasks();
        renderTasks();
        input.value = "";
        document.getElementById("due-date").value = "";
    });

    renderTasks();

    document.getElementById("clear-completed-btn").addEventListener("click", () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    });
});