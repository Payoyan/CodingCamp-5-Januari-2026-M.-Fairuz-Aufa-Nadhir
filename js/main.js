document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const dateInput = document.getElementById('todo-date');
    const todoList = document.getElementById('todo-list');
    const sortSelect = document.getElementById('sort-select');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    const renderTodos = () => {
        const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;
        const sortBy = sortSelect.value;

        todoList.innerHTML = '';
        
        // 1. Logic Filter Status
        let filtered = todos.filter(t => {
            if (currentFilter === 'completed') return t.completed;
            if (currentFilter === 'pending') return !t.completed;
            return true;
        });

        // --- TAMBAHAN LOGIKA NO TASK FOUND ---
        if (filtered.length === 0) {
            const noTaskMsg = document.createElement('div');
            noTaskMsg.className = 'no-task-found';
            noTaskMsg.innerHTML = `
                <p>No Task Found</p>
                <small>Silahkan tambah tugas baru di atas.</small>
            `;
            todoList.appendChild(noTaskMsg);
        } else {
            // 2. Logic Sorting (Hanya jalan jika ada data)
            filtered.sort((a, b) => {
                if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
                if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
                if (sortBy === 'alpha') return a.text.localeCompare(b.text);
                return 0;
            });

            filtered.forEach((todo) => {
                const index = todos.indexOf(todo);
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <div>
                        <span><strong>${todo.text}</strong></span><br>
                        <small>📅 ${todo.date}</small>
                    </div>
                    <div class="actions">
                        <button style="background:#10b981; color:white" onclick="toggleTodo(${index})">✓</button>
                        <button style="background:#ff5e5e; color:white" onclick="deleteTodo(${index})">✕</button>
                    </div>
                `;
                todoList.appendChild(li);
            });
        }
        // --------------------------------------

        localStorage.setItem('todos', JSON.stringify(todos));
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        todos.push({
            text: input.value,
            date: dateInput.value,
            completed: false
        });
        input.value = '';
        dateInput.value = '';
        renderTodos();
    });

    window.toggleTodo = (i) => { todos[i].completed = !todos[i].completed; renderTodos(); };
    window.deleteTodo = (i) => { todos.splice(i, 1); renderTodos(); };

    deleteAllBtn.addEventListener('click', () => {
        if (confirm("Hapus semua tugas?")) { todos = []; renderTodos(); }
    });

    sortSelect.addEventListener('change', renderTodos);
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTodos();
        });
    });

    renderTodos();
});