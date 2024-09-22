document.addEventListener("DOMContentLoaded", function() {
    const matrizContainer = document.getElementById("matriz-container");
    const formModal = document.getElementById("form-modal");
    const closeModal = document.querySelector(".close");
    const selectedNumberElem = document.getElementById("selected-number");
    const form = document.getElementById("user-form");
    const exportCsvBtn = document.getElementById("export-csv");
    const reservedInfoSection = document.getElementById("reserved-info");
    const reservedNumberElem = document.getElementById("reserved-number");
    const reservedNameElem = document.getElementById("reserved-name");
    const reservedIdElem = document.getElementById("reserved-id");
    const reservedPhoneElem = document.getElementById("reserved-phone");
    const reservedPaymentElem = document.getElementById("reserved-payment");
    const reservedObservationsElem = document.getElementById("reserved-observations");
    const resetMatrixBtn = document.getElementById("reset-matrix");

    let selectedNumber = null;

    // Simulación de base de datos con localStorage
    const selectedNumbers = JSON.parse(localStorage.getItem("selectedNumbers")) || [];
    const userData = JSON.parse(localStorage.getItem("userData")) || [];

    // Generar matriz 10x10
    for (let i = 1; i <= 100; i++) {
        const gridItem = document.createElement("div");
        gridItem.classList.add("grid-item");
        gridItem.textContent = i;

        // Verificar si el número ya fue seleccionado
        if (selectedNumbers.includes(i)) {
            gridItem.classList.add("selected");
        }

        // Evento de clic para seleccionar o mostrar información del número
        gridItem.addEventListener("click", function() {
            selectedNumber = i;

            if (selectedNumbers.includes(i)) {
                // Si el número ya está seleccionado, muestra la información del jugador
                const user = userData.find(user => user.number === i);
                if (user) {
                    // Mostrar la información en el modal
                    reservedNumberElem.textContent = i;
                    reservedNameElem.textContent = user.name;
                    reservedIdElem.textContent = user.idNumber;
                    reservedPhoneElem.textContent = user.phone;
                    reservedPaymentElem.textContent = user.payment;
                    reservedObservationsElem.textContent = user.observations;

                    // Mostrar la sección de información y ocultar el formulario
                    form.style.display = "none";
                    reservedInfoSection.style.display = "block";

                    // Mostrar el modal
                    formModal.style.display = "block";
                }
            } else {
                // Si el número no está seleccionado, abrir el formulario
                selectedNumberElem.textContent = i;

                // Mostrar el formulario y ocultar la sección de información
                form.style.display = "block";
                reservedInfoSection.style.display = "none";

                // Mostrar el modal
                formModal.style.display = "block";
            }
        });

        matrizContainer.appendChild(gridItem);
    }

    // Cerrar el modal
    closeModal.addEventListener("click", function() {
        formModal.style.display = "none";
    });

    // Guardar datos del formulario
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const idNumber = document.getElementById("id-number").value;
        const phone = document.getElementById("phone").value;
        const payment = document.querySelector('input[name="payment"]:checked').value;
        const observations = document.getElementById("observations").value;

        // Guardar el número seleccionado
        selectedNumbers.push(selectedNumber);
        localStorage.setItem("selectedNumbers", JSON.stringify(selectedNumbers));

        // Guardar los datos del usuario
        userData.push({ number: selectedNumber, name, idNumber, phone, payment, observations });
        localStorage.setItem("userData", JSON.stringify(userData));

        // Actualizar la interfaz visual
        const selectedGridItem = Array.from(matrizContainer.children).find(item => parseInt(item.textContent) === selectedNumber);
        selectedGridItem.classList.add("selected");

        // Cerrar modal
        formModal.style.display = "none";
        form.reset();
    });

    // Exportar datos como CSV
    exportCsvBtn.addEventListener("click", function() {
        const csvRows = [];
        const headers = ["Número", "Nombre", "Número de Identificación", "Teléfono", "Pago", "Observaciones"];
        csvRows.push(headers.join(","));

        userData.forEach(user => {
            const row = [user.number, user.name, user.idNumber, user.phone, user.payment, user.observations];
            csvRows.push(row.join(","));
        });

        const csvData = csvRows.join("\n");
        const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvData);
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "datos_rifa.csv");
        document.body.appendChild(downloadAnchorNode); // requerido para Firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    // Evento para resetear la matriz
    resetMatrixBtn.addEventListener("click", function() {
        // Confirmar si el usuario realmente quiere reiniciar la matriz
        const confirmReset = confirm("¿Estás seguro de que quieres reiniciar la matriz y eliminar todos los datos?");
        
        if (confirmReset) {
            // Limpiar los datos almacenados en localStorage
            localStorage.removeItem("selectedNumbers");
            localStorage.removeItem("userData");

            // Resetear la interfaz visual
            const gridItems = matrizContainer.querySelectorAll(".grid-item");
            gridItems.forEach(item => {
                item.classList.remove("selected");
                item.style.pointerEvents = "auto"; // Reactivar el clic
            });

            alert("La matriz ha sido reiniciada con éxito.");
        }
    });
});




