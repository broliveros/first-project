document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("task-form");
    const input = document.getElementById("task-input");
    const list = document.getElementById("task-list");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const task = input.value.trim();
        if (task === "") return;

        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = task;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => {
            list.removeChild(li);
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
});