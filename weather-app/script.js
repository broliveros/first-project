document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("weather-form");
    const input = document.getElementById("city-input");
    const result = document.getElementById("weather-result")
    const icon = document.getElementById("weather-icon");
    const info = document.getElementById("weather-info");
    const loading = document.getElementById("loading");
    const historyList = document.getElementById("search-history");
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

    function renderHistory() {
        historyList.innerHTML = "";
        if (history.lenght === 0) {
            historyList.classList.add("hidden");
            return;
        }

        historyList.classList.remove("hidden");

        history.forEach((city) => {
            const li = document.createElement("li");
            li.textContent = city;
            li.addEventListener("click", () => {
                input.value = city;
                form.dispatchEvent(new Event("subtmit"));
                historyList.classList.add("hidden");
            });
            historyList.appendChild(li);
        });
    }

input.addEventListener("input", () => {
    if (input.value.trim() === "") {
        historyList.classList.add("hidden");
    } else {
        renderHistory();
    }
});

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        historyList.style.display = "none";

        const city = input.value.trim();
        if (!city) return;

        result.style.display = "none";
        loading.style.display = "block";
        icon.src = "";
        info.innerHTML = "";

        try {
            const apiKey = "15af2d85d2f044bbb7b21731250307";
            const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
        );

        if (!response.ok) throw new Error("City not found");

        const data = await response.json();

        const temp = data.current.temp_c;
        const condition = data.current.condition.text;
        const location = data.location.name;
        const country = data.location.country;
        const iconUrl = "https:" + data.current.condition.icon;

        icon.src = iconUrl;
        icon.alt = condition;
        icon.style.display = "block";

        info.innerHTML = `
        <h3>${location}, ${country}</h3>
        <p>${temp}°C - ${condition}</p>
        `;

        result.style.display = "block";

        if (!history.includes(location)) {
            history.unshift(location);
            history = history.slice(0, 5);
            localStorage.setItem("weatherHistory", JSON.stringify(history));
        }

    }   catch (error) {
        info.innerHTML = `<p style="color:red;">${error.message}</p>`;
        result.style.display = "block";
    }   finally {
        loading.style.display = "none";
    }
  });

  renderHistory();
});