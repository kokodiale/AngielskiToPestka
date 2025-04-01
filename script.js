// Globalne funkcje
function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'block';
    }
}

// Funkcja do wyświetlania powiadomień
function showNotification(message, type) {
    console.log('Wyświetlanie powiadomienia:', { message, type });
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Funkcja sprawdzająca czy użytkownik jest twórcą
function isUserCreator(user) {
    return user && user.role === 'creator';
}

function updateUIForLoggedInUser(user) {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <span class="user-name">Witaj, ${user.name}</span>
            ${isUserCreator(user) ? '<button class="btn btn-primary" onclick="showAddTaskModal()">Dodaj zadanie</button>' : ''}
            <button class="btn btn-logout" onclick="handleLogout()">Wyloguj</button>
        `;
    }

    // Aktualizacja widoku dla zalogowanego użytkownika
    const authRequired = document.getElementById('auth-required');
    const tasksContent = document.getElementById('tasks-content');
    const rewardsContent = document.getElementById('rewards-content');
    const rankingContent = document.getElementById('ranking-content');

    if (authRequired) authRequired.style.display = 'none';
    if (tasksContent) tasksContent.style.display = 'block';
    if (rewardsContent) rewardsContent.style.display = 'block';
    if (rankingContent) rankingContent.style.display = 'block';

    // Aktualizacja punktów użytkownika na stronie nagród
    const userPoints = document.getElementById('userPoints');
    if (userPoints) {
        userPoints.textContent = user.points || 0;
    }
}

// Mock API dla logowania
async function mockLoginAPI(email, password) {
    console.log('Próba logowania:', { email, password });
    return new Promise((resolve) => {
        setTimeout(() => {
            // Symulacja logowania
            if (email === 'admin@example.com' && password === 'admin123') {
                console.log('Logowanie udane dla admina');
                resolve({
                    success: true,
                    user: {
                        name: 'Admin',
                        email: email,
                        role: 'creator',
                        points: 1000
                    }
                });
            } else if (email === 'user@example.com' && password === 'user123') {
                console.log('Logowanie udane dla użytkownika');
                resolve({
                    success: true,
                    user: {
                        name: 'User',
                        email: email,
                        role: 'user',
                        points: 500
                    }
                });
            } else {
                console.log('Logowanie nieudane');
                resolve({
                    success: false,
                    message: 'Nieprawidłowy email lub hasło'
                });
            }
        }, 1000);
    });
}

// Obsługa przycisków logowania i rejestracji
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('.btn-login');
    const registerBtn = document.querySelector('.btn-register');
    const startLearningBtn = document.querySelector('.btn-primary');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeButtons = document.querySelectorAll('.close');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Animacja przycisków
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.05)';
        });
        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
        });
    });

    // Obsługa modali
    function showModal(modal) {
        modal.style.display = 'block';
    }

    function hideModal(modal) {
        modal.style.display = 'none';
    }

    // Otwieranie modali
    loginBtn.addEventListener('click', () => {
        showModal(loginModal);
    });

    registerBtn.addEventListener('click', () => {
        showModal(registerModal);
    });

    // Zamykanie modali
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            hideModal(loginModal);
            hideModal(registerModal);
        });
    });

    // Przełączanie między modalami
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(loginModal);
        showModal(registerModal);
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(registerModal);
        showModal(loginModal);
    });

    // Zamykanie modali po kliknięciu poza nimi
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            hideModal(loginModal);
        }
        if (e.target === registerModal) {
            hideModal(registerModal);
        }
    });

    // Obsługa formularza logowania
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        console.log('Wysłano formularz logowania:', { email, password });

        try {
            console.log('Wywołanie mockLoginAPI...');
            const response = await mockLoginAPI(email, password);
            console.log('Odpowiedź z API:', response);
            
            if (response.success) {
                console.log('Logowanie udane, zapisywanie użytkownika w localStorage...');
                localStorage.setItem('user', JSON.stringify(response.user));
                console.log('Aktualizacja UI...');
                updateUIForLoggedInUser(response.user);
                console.log('Zamykanie modalu...');
                hideModal(loginModal);
                console.log('Pokazywanie powiadomienia...');
                showNotification('Zalogowano pomyślnie!', 'success');
                // Przekierowanie do strony z zadaniami po zalogowaniu
                if (window.location.pathname.includes('index.html')) {
                    console.log('Przekierowanie do tasks.html...');
                    window.location.href = 'tasks.html';
                }
            } else {
                console.log('Logowanie nieudane:', response.message);
                showNotification('Błąd logowania: ' + response.message, 'error');
            }
        } catch (error) {
            console.error('Szczegóły błędu podczas logowania:', error);
            showNotification('Wystąpił błąd podczas logowania: ' + error.message, 'error');
        }
    });

    // Obsługa formularza rejestracji
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

        if (password !== passwordConfirm) {
            showNotification('Hasła nie są identyczne', 'error');
            return;
        }

        try {
            const response = await mockRegisterAPI(name, email, password);
            if (response.success) {
                localStorage.setItem('user', JSON.stringify(response.user));
                updateUIForLoggedInUser(response.user);
                hideModal(registerModal);
                showNotification('Zarejestrowano pomyślnie!', 'success');
            } else {
                showNotification('Błąd rejestracji: ' + response.message, 'error');
            }
        } catch (error) {
            showNotification('Wystąpił błąd podczas rejestracji', 'error');
        }
    });

    // Sprawdzanie stanu logowania przy ładowaniu strony
    const user = JSON.parse(localStorage.getItem('user'));
    const currentPage = window.location.pathname.split('/').pop();

    // Jeśli użytkownik nie jest zalogowany i próbuje wejść na chronioną stronę
    if (!user && currentPage !== 'index.html') {
        showLoginModal();
        return;
    }

    // Jeśli użytkownik jest zalogowany, aktualizuj UI
    if (user) {
        updateUIForLoggedInUser(user);
    }

    // Mock API dla rejestracji
    async function mockRegisterAPI(name, email, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Symulacja rejestracji
                resolve({
                    success: true,
                    user: {
                        name: name,
                        email: email,
                        role: 'user',
                        points: 0
                    }
                });
            }, 1000);
        });
    }

    // Animacja kart z funkcjami
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Płynne przewijanie do sekcji
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Obsługa filtrów zadań
    const difficultyFilter = document.getElementById('difficultyFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const taskCards = document.querySelectorAll('.task-card');

    if (difficultyFilter && categoryFilter && taskCards.length > 0) {
        function filterTasks() {
            const selectedDifficulty = difficultyFilter.value;
            const selectedCategory = categoryFilter.value;

            taskCards.forEach(card => {
                const difficulty = card.querySelector('.difficulty').classList[1];
                const category = card.querySelector('.category').textContent.split(': ')[1].toLowerCase();
                
                const difficultyMatch = selectedDifficulty === 'all' || difficulty === selectedDifficulty;
                const categoryMatch = selectedCategory === 'all' || category === selectedCategory;

                card.style.display = difficultyMatch && categoryMatch ? 'block' : 'none';
            });
        }

        difficultyFilter.addEventListener('change', filterTasks);
        categoryFilter.addEventListener('change', filterTasks);
    }

    // Obsługa nawigacji
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user && link.getAttribute('href') !== 'index.html') {
                e.preventDefault();
                showLoginModal();
            }
        });
    });
});

// Obsługa wylogowania
function handleLogout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Funkcja do pokazywania modalu dodawania zadania
function showAddTaskModal() {
    const addTaskModal = document.getElementById('addTaskModal');
    if (addTaskModal) {
        addTaskModal.style.display = 'block';
    }
} 