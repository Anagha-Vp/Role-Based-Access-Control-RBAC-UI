// Arrays to store users and roles
let users = [];
let roles = [];
let editingUserIndex = null; // Track index for editing users
let editingRoleIndex = null; // Track index for editing roles

// Load data from local storage on page load
window.onload = function() {
  const storedUsers = localStorage.getItem('users');
  const storedRoles = localStorage.getItem('roles');

  if (storedUsers) {
    users = JSON.parse(storedUsers);
  }

  if (storedRoles) {
    roles = JSON.parse(storedRoles);
  }

  updateRoleDropdown();
  updateRoleTable();
  updateUserTable();
};

// Show Add User Form Modal
function showAddUserForm() {
    editingUserIndex = null; // Reset editing state
    const userModal = document.getElementById('userModal');
    userModal.classList.add('show');
    updateRoleDropdown(); // Ensure role dropdown is updated when the form is shown
}

// Show Edit User Form Modal
function showEditUserForm(index) {
    editingUserIndex = index; // Set the editing index
    const user = users[index];
    const userModal = document.getElementById('userModal');
    userModal.classList.add('show');
    updateRoleDropdown(); // Ensure role dropdown is updated
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userStatus').value = user.status; // Set status in the form
}

// Show Add Role Form Modal
function showAddRoleForm() {
    editingRoleIndex = null; // Reset editing state
    const roleModal = document.getElementById('roleModal');
    roleModal.classList.add('show');
}

// Show Edit Role Form Modal
function showEditRoleForm(index) {
    editingRoleIndex = index; // Set the editing index
    const role = roles[index];
    const roleModal = document.getElementById('roleModal');
    roleModal.classList.add('show');
    document.getElementById('roleName').value = role.name;
    // Check permissions
    const checkboxes = document.querySelectorAll('.permission-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = role.permissions.includes(checkbox.value);
    });
}

// Close Modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}

// Submit User Form (Add/Edit)
function submitUserForm(event) {
    event.preventDefault();

    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const role = document.getElementById('userRole').value;
    const status = document.getElementById('userStatus').value;

    if (!name || !email || !role || status === "No roles available") {
        alert('Please fill out all fields.');
        return;
    }

    if (editingUserIndex !== null) {
        // Edit existing user
        users[editingUserIndex] = { name, email, role, status };
    } else {
        // Add new user
        users.push({ name, email, role, status });
    }

    // Update the user table
    updateUserTable();
    closeModal('userModal');
    saveData();
}

// Submit Role Form (Add/Edit)
function submitRoleForm(event) {
    event.preventDefault();

    const roleName = document.getElementById('roleName').value.trim();
    const permissions = getSelectedPermissions();

    if (!roleName || permissions.length === 0) {
        alert('Please provide a valid role name and at least one permission.');
        return;
    }

    if (editingRoleIndex !== null) {
        // Edit existing role
        roles[editingRoleIndex] = { name: roleName, permissions };
    } else {
        // Add new role
        roles.push({ name: roleName, permissions });
    }

    // Update the role table
    updateRoleTable();
    closeModal('roleModal');
    saveData();
}

// Update the user table
function updateUserTable() {
    const userTableBody = document.getElementById('userTable').querySelector('tbody');
    userTableBody.innerHTML = ''; // Clear existing rows

    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.status}</td> <!-- Display Status -->
            <td>
                <button class="btn btn-warning btn-sm" onclick="showEditUserForm(${index})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${index})">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

// Update the role table
function updateRoleTable() {
    const roleTableBody = document.getElementById('roleTable').querySelector('tbody');
    roleTableBody.innerHTML = ''; // Clear existing rows

    roles.forEach((role, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${role.name}</td>
            <td>${role.permissions.join(', ')}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="showEditRoleForm(${index})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteRole(${index})">Delete</button>
            </td>
        `;
        roleTableBody.appendChild(row);
    });
}

// Delete a user
function deleteUser(index) {
    users.splice(index, 1); // Remove the user from the array
    updateUserTable(); // Update the user table
    saveData(); // Save data to local storage
}

// Delete a role
function deleteRole(index) {
    roles.splice(index, 1); // Remove the role from the array
    updateRoleDropdown(); // Update the role dropdown
    updateRoleTable(); // Update the role table
    saveData(); // Save data to local storage
}

// Get selected permissions from the checkboxes
function getSelectedPermissions() {
    const permissions = [];
    const checkboxes = document.querySelectorAll('.permission-checkbox:checked');
    checkboxes.forEach(checkbox => {
        permissions.push(checkbox.value);
    });
    return permissions;
}

// Save data to local storage
function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('roles', JSON.stringify(roles));
}

// Update the role dropdown for user form
function updateRoleDropdown() {
    const userRoleDropdown = document.getElementById('userRole');
    userRoleDropdown.innerHTML = ''; // Clear previous options
    if (roles.length > 0) {
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.name;
            option.textContent = role.name;
            userRoleDropdown.appendChild(option);
        });
    } else {
        const option = document.createElement('option');
        option.value = 'No roles available';
        option.textContent = 'No roles available';
        userRoleDropdown.appendChild(option);
    }
}
