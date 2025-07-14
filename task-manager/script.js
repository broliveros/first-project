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
            const li = document.createElement("li");
            const isCompleted = task.completed;

            li.setAttribute("draggable", "true");

            li.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", index);
                li.style.opacity = "0.5";
            });

            li.addEventListener("dragover", (e) => {
                e.preventDefault();
                li.style.borderTop = "2px dashed #333";
            });

            li.addEventListener("dragleave", () => {
                li.style.borderTop = "";
            });

            li.addEventListener("drop", (e) => {
                e.preventDefault();
                li.style.borderTop = "";
                li.style.opacity = "1";

                const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"));
                const targetIndex = index;

                if (draggedIndex === targetIndex) return;

                const [movedTask] = tasks.splice(draggedIndex, 1);
                tasks.splice(targetIndex, 0, movedTask);
                
                saveTasks();
                renderTasks();
            });

            const now = new Date();

            if (
                (currentFilter === "active" && isCompleted) ||
                (currentFilter === "completed" && !isCompleted)
            ) {
                return;
            }

            if (task.dueDate) {
                const dueDate = new Date(task.dueDate);
                const timeDiff = dueDate - now;
                const oneDay = 24 * 60 * 60 * 1000;
             
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
            span.innerHTML = task.dueDate
                ? `${task.text}<br><small style="color: gray;"><em>Due: ${task.dueDate}</em></small>`
                : task.text;
                if (isCompleted) span.classList.add("completed");

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.className = "edit-btn";
            editBtn.addEventListener("click", () => {
                li.innerHTML= "";

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

                saveBtn.addEventListener("click",() => {
                    task.text = editInput.value.trim();
                    task.dueDate = editDate.value;
                    saveTasks();
                    renderTasks();
                });

                cancelBtn.addEventListener("click", () => {
                    renderTasks();
                });

            li.innerHTML = "";
            li.appendChild(checkbox);
            li.appendChild(editInput);
            li.appendChild(editDate);
            li.appendChild(saveBtn);
            li.appendChild(cancelBtn);
        });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "X";
            deleteBtn.className = "delete-btn";
            deleteBtn.addEventListener("click", () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

                const contentDiv = document.createElement("div");
                contentDiv.className = "task-content";
                contentDiv.appendChild(checkbox);
                contentDiv.appendChild(span);

                const btnDiv = document.createElement("div");
                btnDiv.className = "task-buttons";
                btnDiv.appendChild(editBtn);
                btnDiv.appendChild(deleteBtn);

                li.appendChild(contentDiv);
                li.appendChild(btnDiv);
                list.appendChild(li);
        });
    }
     
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