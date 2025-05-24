document.addEventListener("DOMContentLoaded", () => {
    const forma = document.querySelector(".forma");

    forma.addEventListener("submit", (e) => {
        e.preventDefault();

        let naziv = document.querySelector(".input-naziv").value.trim();
        let datum = document.querySelector(".input-datum").value

        const grupa = {
            naziv: naziv,
            datumOsnivanja: datum
        };

        fetch("http://localhost:21271/api/grupe/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(grupa)
        })
        .then(response => {
            if (!response.ok) throw new Error("Greška pri slanju podataka");
            return response.json();
        })
        .then(data => {
            alert("Grupa uspešno dodata!");
            forma.reset();
        })
        .catch(error => {
            console.error("Greška:", error);
            alert("Došlo je do greške pri dodavanju grupe.");
        });
    });
});
