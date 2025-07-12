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

        tasks.forEach((task, index) => {
            const isCompleted = task.completed;

            if (
                currentFilter === "active" && isCompleted ||
                currentFilter === "completed" && !isCompleted
            ) {
                return;
            }

            const li = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = isCompleted;
            checkbox.addEventListener("change", () => {
                task.completed = checkbox.checked;
                saveTasks();
                renderTasks();
            });

            const span = document.createElement("span");
            span.textContent = task.text;
            if (isCompleted) span.classList.add("completed");
        
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "X";
            deleteBtn.className = "delete-btn";
            deleteBtn.addEventListener("click", () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });
            
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            list.appendChild(li);
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskText = input.value.trim();
        if (!taskText) return;

        tasks.push({ text: taskText, completed: false });
        saveTasks();
        renderTasks();
        input.value = "";
    });

    renderTasks();

    document.getElementById("clear-completed-btn").addEventListener("click", () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    });
});

