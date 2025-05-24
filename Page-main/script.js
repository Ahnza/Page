// script.js - Maneja la lógica de todas las páginas

// --- Claves para localStorage ---
const FOOD_HISTORY_KEY = 'foodHistory';
const ACTIVITY_HISTORY_KEY = 'activityHistory';
const SLEEP_HISTORY_KEY = 'sleepHistory';
const STEPS_HISTORY_KEY = 'stepsHistory'; // Nueva clave
const CALORIES_HISTORY_KEY = 'caloriesHistory'; // Nueva clave

// --- Funciones Auxiliares ---
function renderHistory(dataListElement, history, formatter) {
    if (!dataListElement) return;
    dataListElement.innerHTML = ''; // Limpiar ítems anteriores
    if (history.length === 0) {
        const emptyItem = document.createElement('div');
        emptyItem.textContent = 'No hay registros aún.';
        dataListElement.appendChild(emptyItem);
    } else {
        history.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.textContent = formatter(item);
            dataListElement.appendChild(itemDiv);
        });
    }
}

function calculateSleepDuration(startTime, endTime) {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    if (end < start) { // Si la hora de despertar es del día siguiente
        end.setDate(end.getDate() + 1);
    }

    let diffMs = end - start;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    diffMs -= diffHrs * (1000 * 60 * 60);
    const diffMins = Math.floor(diffMs / (1000 * 60));

    return `${diffHrs} hora(s) ${diffMins} minuto(s)`;
}

// --- Página de Inicio de Sesión (index.html) ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Inicio de sesión exitoso (simulado)');
        window.location.href = 'dashboard.html';
    });
}

// --- Página de Registro (register.html) ---
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const edad = document.getElementById('edad').value;
        const peso = document.getElementById('peso').value;
        const altura = document.getElementById('altura').value;
        const correo = document.getElementById('correo').value;
        const password = document.getElementById('password').value;
        console.log('Datos de registro:', { nombre, edad, peso, altura, correo, password });
        alert('Registro exitoso. Serás redirigido al inicio de sesión.');
        window.location.href = 'index.html';
    });
}

// --- Página de Perfil (profile.html) ---
const editarDatosBtn = document.getElementById('editar-datos');
const changePasswordForm = document.getElementById('change-password-form');
const deleteAccountBtn = document.getElementById('delete-account-btn');

if (editarDatosBtn) { // Esta condición asegura que estamos en profile.html
    const profileDetailsContainer = document.querySelector('.profile-details'); // Contenedor específico de los detalles del perfil

    if (profileDetailsContainer) {
        const nombreProfileInput = profileDetailsContainer.querySelector('#nombre');
        const edadProfileInput = profileDetailsContainer.querySelector('#edad');
        const pesoProfileInput = profileDetailsContainer.querySelector('#peso');
        const alturaProfileInput = profileDetailsContainer.querySelector('#altura');

        // Asegurarse de que todos los campos fueron encontrados antes de añadir el listener
        if (nombreProfileInput && edadProfileInput && pesoProfileInput && alturaProfileInput) {
            editarDatosBtn.addEventListener('click', function() {
                const inputs = [nombreProfileInput, edadProfileInput, pesoProfileInput, alturaProfileInput];
                inputs.forEach(input => {
                    input.disabled = !input.disabled;
                });

                if (nombreProfileInput.disabled) {
                    editarDatosBtn.textContent = 'Editar Datos';
                    // SIMULACIÓN de guardado de datos
                    console.log('Datos a guardar:', {
                        nombre: nombreProfileInput.value,
                        edad: edadProfileInput.value,
                        peso: pesoProfileInput.value,
                        altura: alturaProfileInput.value
                    });
                    alert('Datos guardados (simulado)');
                } else {
                    editarDatosBtn.textContent = 'Guardar Datos';
                    nombreProfileInput.focus(); // Opcional: poner el foco en el primer campo editable
                }
            });
        } else {
            console.error("Error: No se encontraron todos los campos de entrada (nombre, edad, peso, altura) dentro de '.profile-details' en profile.html.");
        }
    } else {
        console.error("Error: No se encontró el contenedor '.profile-details' en profile.html.");
    }
}

if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (newPassword === "") {
            alert('La nueva contraseña no puede estar vacía.');
            return;
        }
        if (newPassword === confirmPassword) {
            // SIMULACIÓN de cambio de contraseña
            console.log('Contraseña cambiada. Actual:', currentPassword, 'Nueva:', newPassword);
            alert('Contraseña cambiada (simulado)');
            changePasswordForm.reset(); // Limpiar el formulario
        } else {
            alert('Las nuevas contraseñas no coinciden.');
        }
    });
}

if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', function() {
        const confirmDelete = confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
        if (confirmDelete) {
            // SIMULACIÓN de eliminación de cuenta
            console.log('Cuenta eliminada');
            alert('Cuenta eliminada (simulado)');
            // Aquí podrías limpiar localStorage si lo deseas
            // localStorage.removeItem(FOOD_HISTORY_KEY);
            // localStorage.removeItem(ACTIVITY_HISTORY_KEY);
            // localStorage.removeItem(SLEEP_HISTORY_KEY);
            // localStorage.removeItem('userData'); // si guardas otros datos del usuario
            window.location.href = 'index.html';
        }
    });
}

// --- Página de Dashboard (dashboard.html) ---

// Inicializar el resumen en el dashboard al cargar la página
window.addEventListener('load', function() {
    // Para Sueño
    const sleepSummaryDashboard = document.getElementById('sleep-summary-dashboard');
    if (sleepSummaryDashboard) {
        let sleepHistory = JSON.parse(localStorage.getItem(SLEEP_HISTORY_KEY)) || [];
        if (sleepHistory.length > 0) {
            const latestSleep = sleepHistory[sleepHistory.length - 1];
            sleepSummaryDashboard.innerHTML = `<div>Último registro: ${latestSleep.duration} (Dormir: ${latestSleep.start}, Despertar: ${latestSleep.end})</div>`;
        } else {
            sleepSummaryDashboard.innerHTML = `<div>No hay registros aún.</div>`;
        }
    }

    // Para Pasos
    const stepsSummaryDashboard = document.getElementById('steps-summary-dashboard');
    if (stepsSummaryDashboard) {
        let stepsHistory = JSON.parse(localStorage.getItem(STEPS_HISTORY_KEY)) || [];
        if (stepsHistory.length > 0) {
            const latestSteps = stepsHistory[stepsHistory.length - 1];
            stepsSummaryDashboard.innerHTML = `<div>Último registro: ${latestSteps.value} pasos (${new Date(latestSteps.timestamp).toLocaleDateString()})</div>`;
        } else {
            stepsSummaryDashboard.innerHTML = `<div>No hay registros aún.</div>`;
        }
    }

    // Para Calorías
    const caloriesSummaryDashboard = document.getElementById('calories-summary-dashboard');
    if (caloriesSummaryDashboard) {
        let caloriesHistory = JSON.parse(localStorage.getItem(CALORIES_HISTORY_KEY)) || [];
        if (caloriesHistory.length > 0) {
            const latestCalories = caloriesHistory[caloriesHistory.length - 1];
            caloriesSummaryDashboard.innerHTML = `<div>Último registro: ${latestCalories.value} calorías (${new Date(latestCalories.timestamp).toLocaleDateString()})</div>`;
        } else {
            caloriesSummaryDashboard.innerHTML = `<div>No hay registros aún.</div>`;
        }
    }
});

// Manejo del registro de Sueño desde el Dashboard
const recordSleepDashboardButton = document.getElementById('record-sleep-dashboard');
const sleepDashboardHoursInput = document.getElementById('sleep-dashboard-hours');

if (recordSleepDashboardButton && sleepDashboardHoursInput) {
    recordSleepDashboardButton.addEventListener('click', function() {
        const hours = parseFloat(sleepDashboardHoursInput.value);

        if (isNaN(hours) || hours <= 0) {
            alert('Por favor, ingresa un número válido de horas de sueño.');
            return;
        }

        // SIMULACIÓN: Asumiendo que 8 horas es un valor de referencia, se puede ajustar
        // Para simplificar, aquí solo guardaremos las horas. Si se quiere detalle de inicio/fin,
        // se debería redirigir a sleep.html o tener campos de hora de inicio/fin en el dashboard.
        const newEntry = {
            start: "N/A", // No disponible desde solo las horas
            end: "N/A", // No disponible desde solo las horas
            duration: `${hours} hora(s)`,
            timestamp: new Date().toISOString()
        };

        let sleepHistory = JSON.parse(localStorage.getItem(SLEEP_HISTORY_KEY)) || [];
        sleepHistory.push(newEntry);
        localStorage.setItem(SLEEP_HISTORY_KEY, JSON.stringify(sleepHistory));

        const sleepSummaryDashboard = document.getElementById('sleep-summary-dashboard');
        if (sleepSummaryDashboard) {
            sleepSummaryDashboard.innerHTML = `<div>Último registro: ${newEntry.duration} (${new Date(newEntry.timestamp).toLocaleDateString()})</div>`;
        }
        alert(`Se han registrado ${hours} horas de sueño.`);
        sleepDashboardHoursInput.value = '';
    });
}

// Manejo del registro de Pasos desde el Dashboard
const recordStepsDashboardButton = document.getElementById('record-steps-dashboard');
const stepsDashboardInput = document.getElementById('steps-dashboard-input');

if (recordStepsDashboardButton && stepsDashboardInput) {
    recordStepsDashboardButton.addEventListener('click', function() {
        const steps = parseInt(stepsDashboardInput.value);

        if (isNaN(steps) || steps < 0) {
            alert('Por favor, ingresa un número válido de pasos.');
            return;
        }

        const newEntry = {
            value: steps,
            timestamp: new Date().toISOString()
        };

        let stepsHistory = JSON.parse(localStorage.getItem(STEPS_HISTORY_KEY)) || [];
        stepsHistory.push(newEntry);
        localStorage.setItem(STEPS_HISTORY_KEY, JSON.stringify(stepsHistory));

        const stepsSummaryDashboard = document.getElementById('steps-summary-dashboard');
        if (stepsSummaryDashboard) {
            stepsSummaryDashboard.innerHTML = `<div>Último registro: ${newEntry.value} pasos (${new Date(newEntry.timestamp).toLocaleDateString()})</div>`;
        }
        alert(`Se han registrado ${steps} pasos.`);
        stepsDashboardInput.value = '';
    });
}

// Manejo del registro de Calorías desde el Dashboard
const recordCaloriesDashboardButton = document.getElementById('record-calories-dashboard');
const caloriesDashboardInput = document.getElementById('calories-dashboard-input');

if (recordCaloriesDashboardButton && caloriesDashboardInput) {
    recordCaloriesDashboardButton.addEventListener('click', function() {
        const calories = parseInt(caloriesDashboardInput.value);

        if (isNaN(calories) || calories < 0) {
            alert('Por favor, ingresa un número válido de calorías.');
            return;
        }

        const newEntry = {
            value: calories,
            timestamp: new Date().toISOString()
        };

        let caloriesHistory = JSON.parse(localStorage.getItem(CALORIES_HISTORY_KEY)) || [];
        caloriesHistory.push(newEntry);
        localStorage.setItem(CALORIES_HISTORY_KEY, JSON.stringify(caloriesHistory));

        const caloriesSummaryDashboard = document.getElementById('calories-summary-dashboard');
        if (caloriesSummaryDashboard) {
            caloriesSummaryDashboard.innerHTML = `<div>Último registro: ${newEntry.value} calorías (${new Date(newEntry.timestamp).toLocaleDateString()})</div>`;
        }
        alert(`Se han registrado ${calories} calorías.`);
        caloriesDashboardInput.value = '';
    });
}


// --- Página de Registro de Alimentación (food.html) ---
const foodSearchButton = document.getElementById('search-button');
const foodTypeSelect = document.getElementById('food-type');
const foodSearchInput = document.getElementById('food-search');
const foodDataList = document.querySelector('.food-history .data-list'); // Selector específico

if (foodSearchButton && foodTypeSelect && foodSearchInput && foodDataList) { // Asegura que todos los elementos necesarios existen
    let foodHistory = JSON.parse(localStorage.getItem(FOOD_HISTORY_KEY)) || [];
    renderHistory(foodDataList, foodHistory, item =>
        `Tipo: ${item.type}, Alimento: ${item.name} (Registrado: ${new Date(item.timestamp).toLocaleDateString()})`
    );

    foodSearchButton.addEventListener('click', function() {
        const foodType = foodTypeSelect.value;
        const foodSearch = foodSearchInput.value.trim();

        if (foodSearch === "") {
            alert("Por favor, ingresa un alimento.");
            return;
        }

        const newEntry = {
            type: foodType,
            name: foodSearch,
            timestamp: new Date().toISOString()
        };

        foodHistory.push(newEntry);
        localStorage.setItem(FOOD_HISTORY_KEY, JSON.stringify(foodHistory));
        renderHistory(foodDataList, foodHistory, item =>
            `Tipo: ${item.type}, Alimento: ${item.name} (Registrado: ${new Date(item.timestamp).toLocaleDateString()})`
        );
        foodSearchInput.value = '';
    });
}

// --- Página de Registro de Actividad Física (activity.html) ---
const searchActivityButton = document.getElementById('search-activity-button');
const activityTypeSelect = document.getElementById('activity-type');
const activitySearchInput = document.getElementById('activity-search');
const activityDataList = document.querySelector('.activity-history .data-list'); // Selector específico

if (searchActivityButton && activityTypeSelect && activitySearchInput && activityDataList) { // Asegura que todos los elementos necesarios existen
    let activityHistory = JSON.parse(localStorage.getItem(ACTIVITY_HISTORY_KEY)) || [];
    renderHistory(activityDataList, activityHistory, item =>
        `Tipo: ${item.type}, Actividad: ${item.name} (Registrado: ${new Date(item.timestamp).toLocaleDateString()})`
    );

    searchActivityButton.addEventListener('click', function() {
        const activityType = activityTypeSelect.value;
        const activitySearch = activitySearchInput.value.trim();

        if (activitySearch === "") {
            alert("Por favor, ingresa una actividad.");
            return;
        }

        const newEntry = {
            type: activityType,
            name: activitySearch,
            timestamp: new Date().toISOString()
        };

        activityHistory.push(newEntry);
        localStorage.setItem(ACTIVITY_HISTORY_KEY, JSON.stringify(activityHistory));
        renderHistory(activityDataList, activityHistory, item =>
            `Tipo: ${item.type}, Actividad: ${item.name} (Registrado: ${new Date(item.timestamp).toLocaleDateString()})`
        );
        activitySearchInput.value = '';
    });
}

// --- Página de Registro de Sueño (sleep.html) ---
const recordSleepButton = document.getElementById('record-sleep');
const sleepStartInput = document.getElementById('sleep-start');
const sleepEndInput = document.getElementById('sleep-end');
const sleepDataList = document.querySelector('.sleep-history .data-list'); // Selector específico

if (recordSleepButton && sleepStartInput && sleepEndInput && sleepDataList) { // Asegura que todos los elementos necesarios existen
    let sleepHistory = JSON.parse(localStorage.getItem(SLEEP_HISTORY_KEY)) || [];
    renderHistory(sleepDataList, sleepHistory, item =>
        `Dormir: ${item.start}, Despertar: ${item.end} (${item.duration}) - (Registrado: ${new Date(item.timestamp).toLocaleDateString()})`
    );

    recordSleepButton.addEventListener('click', function() {
        const sleepStart = sleepStartInput.value;
        const sleepEnd = sleepEndInput.value;

        if (!sleepStart || !sleepEnd) {
            alert('Por favor, introduce la hora de dormir y despertar.');
            return;
        }
        if (sleepStart === sleepEnd) {
            alert('La hora de dormir y despertar no pueden ser la misma.');
            return;
        }

        const duration = calculateSleepDuration(sleepStart, sleepEnd);

        const newEntry = {
            start: sleepStart,
            end: sleepEnd,
            duration: duration,
            timestamp: new Date().toISOString()
        };

        sleepHistory.push(newEntry);
        localStorage.setItem(SLEEP_HISTORY_KEY, JSON.stringify(sleepHistory));
        renderHistory(sleepDataList, sleepHistory, item =>
             `Dormir: ${item.start}, Despertar: ${item.end} (${item.duration}) - (Registrado: ${new Date(item.timestamp).toLocaleDateString()})`
        );
        sleepStartInput.value = '';
        sleepEndInput.value = '';
    });
}