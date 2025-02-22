document.getElementById("contactForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page reload

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;

    console.log("Sending Data:", { name, email, message }); // Debugging

    fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById("responseMessage").textContent = data;
        document.getElementById("contactForm").reset();
    })
    .catch(error => console.error("❌ Error Sending Data:", error));
});
document.addEventListener("DOMContentLoaded", function () {
    const welcomeText = document.querySelector(".welcome-section h2");

    function getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning! Welcome to Neptune Shipyard.";
        if (hour < 18) return "Good Afternoon! Welcome to Neptune Shipyard.";
        return "Good Evening! Welcome to Neptune Shipyard.";
    }

    welcomeText.textContent = getGreeting();
});


