document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("task-form");
    const input = document.getElementById("task-input");
    const list = document.getElementById("task-list");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function saveTask() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks() {
        list.innerHTML = "";
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.addEventListener("change", () => {
                tasks[index].completed = checkbox.checked;
                saveTask();
                renderTasks();
            });

            const label = document.createElement("span");
            label.textContent = task.text;
            if (task.completed) {
                label.classList.add("completed");
            }

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "X";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", () => {
                tasks.splice(index, 1);
                saveTask();
                renderTasks();
            });
            
            li.appendChild(checkbox);
            li.appendChild(label);
            li.appendChild(deleteBtn);
            list.appendChild(li);
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskText = input.value.trim();
        if (!taskText) return;

        tasks.push({ text: taskText, completed: false });
        saveTask();
        renderTasks();
        input.value = "";
    });

    renderTasks();

    document.getElementById("clear-completed-btn").addEventListener("click", () => {
        tasks = tasks.filter(task => !task.completed);
        saveTask();
        renderTasks();
    });
});

