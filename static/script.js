const haircuts = [
    { name: 'Corte clásico', price: 10 },
    { name: 'Fade', price: 15 },
    { name: 'Afeitado completo', price: 12 },
];

function loadHaircuts() {
    const tableBody = document.querySelector('#haircutTable tbody');
    const select = document.getElementById('haircutSelect');
    haircuts.forEach((cut, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${cut.name}</td><td>$${cut.price}</td>`;
        tableBody.appendChild(row);
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${cut.name} - $${cut.price}`;
        select.appendChild(option);
    });
}

function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const tableBody = document.querySelector('#appointmentTable tbody');
    tableBody.innerHTML = '';
    appointments.forEach((app, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${app.client}</td>
            <td>${haircuts[app.cut].name}</td>
            <td>${app.date}</td>
            <td>${app.time}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="cancelAppointment(${index})">Anular</button>
            </td>`;
        tableBody.appendChild(row);
    });
}

function cancelAppointment(index) {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.splice(index, 1);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    loadAppointments();
}

function setupForm() {
    document.getElementById('appointmentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const client = document.getElementById('clientName').value;
        const cut = document.getElementById('haircutSelect').value;
        const date = document.getElementById('dateInput').value;
        const time = document.getElementById('timeInput').value;
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        // Check for existing appointment at the same date/time
        const conflict = appointments.some(a => a.date === date && a.time === time);
        if (conflict) {
            alert('Hora no disponible, por favor elige otra.');
            return;
        }
        appointments.push({ client, cut, date, time });
        localStorage.setItem('appointments', JSON.stringify(appointments));
        this.reset();
        loadAppointments();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadHaircuts();
    loadAppointments();
    setupForm();
});
