document.addEventListener('DOMContentLoaded', () => {
    const USERS_KEY = 'agriTerroirUsers';
    const historyContainer = document.getElementById('history-container');

    function displayHistory() {
        const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

        if (users.length === 0) {
            historyContainer.innerHTML = '<p>No registrations found yet.</p>';
            return;
        }

        const tableHeader = `
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Profile Type</th>
                    <th>Organization</th>
                    <th>Registration Date</th>
                </tr>
            </thead>
        `;

        const tableBody = users.map(user => `
            <tr>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.userType}</td>
                <td>${user.organization || 'N/A'}</td>
                <td>${new Date(user.date).toLocaleDateString()}</td>
            </tr>
        `).join('');

        historyContainer.innerHTML = `
            <table id="history-table">
                ${tableHeader}
                <tbody>${tableBody}</tbody>
            </table>
        `;
    }

    displayHistory();
});