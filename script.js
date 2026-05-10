let categories = {};
let isAdmin = false;

// Исходные данные из листа Size (полностью)
const defaultData = {
    jar: {
        name: 'Regex mods | Luyten',
        suffix: 'Методы ниже',
        items: [
            "", 
        ]
    },
    weight: {
        name: 'Методы для Forge',
        suffix: '',
        items: [
            "func_174826_a|func_226277_ct_|func_174813_aQ().field_72338_b|func_226281_cx_func_226277_ct_|func_174813_aQ().field_72337_e|func_226281_cx_|AxisAlignedBB"
        ]
    },
    name: {
        name: 'Методы для Fabric',
        suffix: '',
        items: [
            "method_5829|class_238|method_23317|method_23321|method_5857"
        ]
    },
    vec: {
        name: 'Методы для LabyMod',
        suffix: '',
        items: [
            "dci|.cD()|.cc().b|.cH()|.cD()|.cc().e"
        ]
    },
    exe: {
        name: 'System Informer Regex',
        suffix: 'Методы ниже',
        items: [
            ""
        ]
    },
    doomsday: {
        name: 'Explorer',
        suffix: '',
        items: [
            '^[A-Za-z]:\\(?:[\w\-]+\\)*\w+\.\w+$'
        ]
    
    },
    holyworld: {
        name: 'csrss "exe" и "dll" процесс с большей памятью',
        suffix: '',
        items: [
            '^([a-zA-Z]:\\.+)\\?$'
        ]
    },
    fkjsfs: {
        name: 'csrss "exe" процесс с меньшей памятью ',
        suffix: '',
        items: [
            '^[A-Z]:\\.+\.(exe)$'
        ]
     },
    fkjsfr: {
        name: 'csrss "dll" процесс с большей памятью ',
        suffix: '',
        items: [
            '^[A-Z]:\\.+\.(dll)$'
        ]
     },
    fkjsfkt: {
        name: 'csrss процесс с большей памятью, шаблон для определения файлов с изменённым расширением ',
        suffix: '',
        items: [
            '^[a-z]:.+\.((?!exe|pyd|manifest|dll|config|\\|cpl|microsoft-|shell).)*$'
        ]
    },
    fkjsfrkq: {
        name: 'Regedit regex',
        suffix: 'Методы ниже',
        items: [
            ''
        ]
     },
    fkjsfrks: {
        name: 'Program Compatibility Assistant (PCA) Используется для просмотра .ехе файлов, зарегистрированных на ПК',
        suffix: '',
        items: [
            'HKCU\Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Compatibility Assistant\Store'
        ]
    },
    fkjsfrkv: {
        name: '',
        suffix: '',
        items: [
            'HKCU\Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\CompatibilityAssistant\Persisted'
        ]
    },
    fkjsfrkp: {
        name: 'Background Activity Moderator (BAM) Используется для просмотра .ехе файлов, зарегистрированных на ПК',
        suffix: '',
        items: [
            'HKLM\SYSTEM\CurrentControlSet\Services\bam\State\UserSettings\ '
        ]
    },
    fkjsfrkpd: {
        name: 'Open/Save Dialog MRU Просмотр различных открытых файлов, самый полезный раздел реестра для детекта .dll',
        suffix: '',
        items: [
            'HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\ComDlg32\OpenSavePidlMRU\ '
        ]
    },
    fkjsfrkpdz: {
        name: 'RecentDocs.Зеркальный раздел с информацией в shell:recent. Удобнее анализировать, так как файлы отсортированы по расширению.',
        suffix: '',
        items: [
            'HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\RecentDocs '
        ]
     },
    fkjsfrkpdzn: {
        name: 'Command Processor Autorun Процессы, запускаемые через cmd на автозапуске',
        suffix: '',
        items: [
            'HKLM\SOFTWARE\Microsoft\Command Processor\Autorun'
        ]
     },
    fkjsfrkpdznc: {
        name: 'RunMRU Программы на автозапуске',
        suffix: '',
        items: [
            'KCU\Software\Microsoft\Windows\CurrentVersion\Explorer\RunMRU'
        ]
        
        
    }
};

function loadData() {
    const saved = localStorage.getItem('sizeCategories');
    if (saved) {
        try {
            categories = JSON.parse(saved);
        } catch (e) {
            categories = JSON.parse(JSON.stringify(defaultData));
        }
    } else {
        categories = JSON.parse(JSON.stringify(defaultData));
    }
}

// Сохранение в localStorage
function saveData() {
    localStorage.setItem('sizeCategories', JSON.stringify(categories));
}

// Сохранение в файл
window.saveToFile = function() {
    const dataStr = JSON.stringify(categories, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `sizes-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
};

// Загрузка из файла
window.loadFromFile = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const loaded = JSON.parse(e.target.result);
                categories = loaded;
                saveData(); // сохраняем в localStorage
                render();
                alert('✅ Категории загружены из файла');
            } catch (err) {
                alert('❌ Ошибка загрузки файла: ' + err);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
};

// Сброс к дефолтным
window.resetToDefault = function() {
    if (confirm('Сбросить все категории к исходным? Все изменения будут потеряны.')) {
        categories = JSON.parse(JSON.stringify(defaultData));
        saveData();
        render();
    }
};

// Загружаем данные при старте
loadData();

function render() {
    const container = document.getElementById('categories');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let [key, cat] of Object.entries(categories)) {
        const block = document.createElement('div');
        block.className = 'block';
        block.id = `cat-${key}`;
        
        // Заголовок
        const header = document.createElement('div');
        header.className = 'block-header';
        header.innerHTML = `
            <h2>${cat.name}</h2>
            <button class="copy-btn" onclick="copyCategory('${key}')"> ✂︎ Скопировать</button>
        `;
        block.appendChild(header);
        
        // Контент с сайзами
        const content = document.createElement('div');
        content.className = 'content-box';
        
        let displayText = cat.items.join('|');
        if (cat.suffix) displayText += cat.suffix;
        
        if (isAdmin) {
            // Для админа показываем сайзы с кнопками удаления
            cat.items.forEach((item, idx) => {
                const span = document.createElement('span');
                span.className = 'size-item';
                span.innerHTML = `<span>${item}</span><button class="delete-size" onclick="deleteItem('${key}', ${idx})">✕</button>`;
                content.appendChild(span);
            });
        } else {
            content.textContent = displayText;
        }
        block.appendChild(content);
        
        // Админ-контролы (только для админа)
        if (isAdmin) {
            const adminDiv = document.createElement('div');
            adminDiv.className = 'admin-controls';
            adminDiv.innerHTML = `
                <input type="text" id="input-${key}" placeholder="новый сайз">
                <button onclick="addItem('${key}')">➕ добавить</button>
                <button class="delete-cat" onclick="deleteCategory('${key}')">🗑️ удалить категорию</button>
            `;
            block.appendChild(adminDiv);
        }
        
        container.appendChild(block);
    }
}

// Копирование
window.copyCategory = function(key) {
    const cat = categories[key];
    let text = cat.items.join('|');
    if (cat.suffix) text += cat.suffix;
    
    navigator.clipboard.writeText(text);
};

// Добавление элемента (админ)
window.addItem = function(key) {
    const input = document.getElementById(`input-${key}`);
    let value = input.value.trim();
    if (!value) return;
    
    categories[key].items.push(value);
    render();
    saveData();
};

// Удаление элемента (админ)
window.deleteItem = function(key, index) {
    categories[key].items.splice(index, 1);
    render();
    saveData();
};

// Новая категория (админ)
window.newCategory = function() {
    const name = prompt('Название новой категории (например: "📁 Мои размеры"):');
    if (!name) return;
    
    const id = 'cat_' + Date.now();
    categories[id] = {
        name: name,
        suffix: '',
        items: []
    };
    render();
    saveData();
};

// Удаление категории (админ)
window.deleteCategory = function(key) {
    const baseCategories = ['jar', 'weight', 'name', 'vec', 'exe', 'doomsday', 'autoreconnect', 'viewmodel', 'creativecore', 'perspective', 'optifile', 'size11740', 'lwjgl', 'bgn', 'anapa', 'cscheat', 'sound', 'nixploit_dll', 'nixploit_jar', 'nixploit_txt', 'nixploit_exe', 'holyworld'];
    
    if (baseCategories.includes(key)) {
        alert('❌ базовые категории нельзя удалить');
        return;
    }
    if (confirm(`Удалить категорию "${categories[key].name}"?`)) {
        delete categories[key];
        render();
        saveData();
    }
};

// Авторизация
window.login = function() {
    const login = document.getElementById('login-input').value;
    const pass = document.getElementById('pass-input').value;
    
    if (login === 'Otrada143' && pass === 'Otrada143') {
        isAdmin = true;
        document.getElementById('user-role').innerHTML = 'Admin';
        document.getElementById('admin-panel').style.display = 'block';
        document.getElementById('logout-btn').style.display = 'inline-block';
        render();
    } else {
        alert('❌ Неверный логин/пароль');
    }
};

window.logout = function() {
    isAdmin = false;
    document.getElementById('user-role').innerHTML = '👁️ Читатель';
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
    document.getElementById('login-input').value = '';
    document.getElementById('pass-input').value = '';
    render();
};

// Старт
window.onload = function() {
    loadData();
    render();
};
		function copyPanelContent(btn) {
			const originalText = 'Копировать'; // текст без иконки
			const copiedText = '✓ Скопировано!';

			const panelContent = btn.parentNode.querySelector('.panel-content').textContent;

			navigator.clipboard.writeText(panelContent).then(() => {
				btn.textContent = copiedText; // временно заменяем текст (иконка пропадёт)
				btn.removeAttribute('data-label'); // убираем иконку

				setTimeout(() => {
					btn.textContent = originalText;
					btn.setAttribute('data-label', '⎘'); // возвращаем иконку
				}, 2000);
			}).catch(err => {
				console.error('Ошибка копирования: ', err);
				btn.textContent = 'Ошибка';
				btn.removeAttribute('data-label');
			});
		}



        // Добавляем небольшую задержку для последовательной анимации панелей
        document.addEventListener('DOMContentLoaded', () => {
            const panels = document.querySelectorAll('.panel');
            panels.forEach((panel, index) => {
                panel.style.animationDelay = `${index * 0.1}s`;
            });
        });


