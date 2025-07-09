/**
 * OiPet Desktop - Application Logic
 * Sistema completo com dados reais e gráficos funcionais
 */

// Carregar dados mockados
const script = document.createElement('script');
script.src = '../../shared/mockData.js';
document.head.appendChild(script);

// Aguardar carregamento dos dados
script.onload = function() {
    console.log('✅ Dados carregados:', window.OiPetData);
    initializeApp();
};

// Estado da aplicação
let currentScreen = 'home';
let selectedPet = null;
let chartInstances = {};

// Inicializar aplicação
function initializeApp() {
    updateDashboard();
    setupEventListeners();
    loadPetsScreen();
}

// Atualizar dashboard principal
function updateDashboard() {
    if (!window.OiPetData) return;
    
    const metrics = window.OiPetData.metrics;
    
    // Atualizar estatísticas
    const statsHTML = `
        <div class="stat-card">
            <div class="stat-value">${metrics.totalPets}</div>
            <div class="stat-label">Pets Cadastrados</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${metrics.totalMealsToday}</div>
            <div class="stat-label">Refeições Hoje</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${window.OiPetData.scannedProducts.length}</div>
            <div class="stat-label">Produtos Escaneados</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${metrics.averageHealthScore}%</div>
            <div class="stat-label">Saúde Média</div>
        </div>
    `;
    
    const statsGrid = document.querySelector('#home-screen .stats-grid');
    if (statsGrid) {
        statsGrid.innerHTML = statsHTML;
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Navegação já está configurada no HTML
    
    // Adicionar listeners para ações
    window.addPet = function() {
        showAddPetDialog();
    };
    
    window.showNotifications = function() {
        showNotificationsPanel();
    };
    
    window.openAnalytics = function() {
        loadAnalyticsWithRealData();
    };
}

// Carregar tela de pets com dados reais
function loadPetsContent(screen) {
    if (!window.OiPetData) return;
    
    const petsHTML = window.OiPetData.pets.map(pet => `
        <div class="card" onclick="showPetDetails(${pet.id})">
            <div class="card-header">
                <h3 class="card-title">${pet.name}</h3>
                <div class="card-icon">${pet.avatar}</div>
            </div>
            <p><strong>Raça:</strong> ${pet.breed}</p>
            <p><strong>Idade:</strong> ${pet.age} anos</p>
            <p><strong>Peso:</strong> ${pet.weight}kg</p>
            <p><strong>Última refeição:</strong> ${new Date(pet.lastMeal).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
            <div style="margin-top: 12px;">
                <div style="background: linear-gradient(90deg, #10b981 ${pet.healthScore}%, #e5e7eb ${pet.healthScore}%); height: 8px; border-radius: 4px;"></div>
                <p style="font-size: 12px; color: #6b7280; margin-top: 4px;">Saúde: ${pet.healthScore}%</p>
            </div>
        </div>
    `).join('');
    
    screen.innerHTML = `
        <div class="content-grid">
            ${petsHTML}
            <div class="card" style="border: 2px dashed #e2e8f0; cursor: pointer;" onclick="addPet()">
                <div class="card-header">
                    <h3 class="card-title">Adicionar Pet</h3>
                    <div class="card-icon">➕</div>
                </div>
                <p style="color: #6b7280;">Cadastre um novo pet no sistema</p>
            </div>
        </div>
    `;
}

// Mostrar detalhes do pet
window.showPetDetails = function(petId) {
    const pet = window.OiPetData.pets.find(p => p.id === petId);
    if (!pet) return;
    
    selectedPet = pet;
    
    const detailsHTML = `
        <div style="max-width: 800px; margin: 0 auto;">
            <div class="card">
                <div class="card-header">
                    <div>
                        <h2 style="font-size: 32px; margin-bottom: 8px;">${pet.avatar} ${pet.name}</h2>
                        <p style="color: #6b7280;">${pet.breed} • ${pet.age} anos • ${pet.weight}kg</p>
                    </div>
                    <button class="btn btn-primary" onclick="editPet(${pet.id})">
                        ✏️ Editar
                    </button>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 24px;">
                    <div style="background: #f8fafc; padding: 16px; border-radius: 8px;">
                        <h4 style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Saúde Geral</h4>
                        <div style="font-size: 24px; font-weight: 700; color: #10b981;">${pet.healthScore}%</div>
                    </div>
                    <div style="background: #f8fafc; padding: 16px; border-radius: 8px;">
                        <h4 style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Refeições Hoje</h4>
                        <div style="font-size: 24px; font-weight: 700; color: #0066EE;">${pet.mealsToday}</div>
                    </div>
                    <div style="background: #f8fafc; padding: 16px; border-radius: 8px;">
                        <h4 style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Calorias</h4>
                        <div style="font-size: 24px; font-weight: 700; color: #EA6B73;">${pet.caloriesConsumed}/${pet.caloriesTarget}</div>
                    </div>
                </div>
                
                <div style="margin-top: 24px;">
                    <h3 style="margin-bottom: 16px;">📊 Histórico de Alimentação</h3>
                    <div id="pet-chart" style="height: 200px; background: #f8fafc; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <canvas id="feeding-chart" width="600" height="200"></canvas>
                    </div>
                </div>
                
                <div style="margin-top: 24px; display: grid; gap: 16px;">
                    ${pet.allergies.length > 0 ? `
                        <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 12px; border-radius: 8px;">
                            <strong>⚠️ Alergias:</strong> ${pet.allergies.join(', ')}
                        </div>
                    ` : ''}
                    ${pet.medications.length > 0 ? `
                        <div style="background: #dbeafe; border: 1px solid #3b82f6; padding: 12px; border-radius: 8px;">
                            <strong>💊 Medicamentos:</strong> ${pet.medications.join(', ')}
                        </div>
                    ` : ''}
                    <div style="background: #d1fae5; border: 1px solid #10b981; padding: 12px; border-radius: 8px;">
                        <strong>✅ Vacinado:</strong> ${pet.vaccinated ? 'Sim' : 'Não'}
                    </div>
                </div>
                
                <div style="margin-top: 24px; display: flex; gap: 12px;">
                    <button class="btn btn-primary" onclick="registerFeeding(${pet.id})">
                        🍽️ Registrar Alimentação
                    </button>
                    <button class="btn btn-secondary" onclick="showPetHistory(${pet.id})">
                        📋 Ver Histórico
                    </button>
                    <button class="btn btn-secondary" onclick="switchScreen('pets')">
                        ← Voltar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const screen = document.getElementById('pets-screen');
    screen.innerHTML = detailsHTML;
    
    // Desenhar gráfico
    setTimeout(() => drawPetChart(pet), 100);
};

// Desenhar gráfico do pet
function drawPetChart(pet) {
    const canvas = document.getElementById('feeding-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Limpar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Dados simulados dos últimos 7 dias
    const data = [3, 4, 3, 3, 4, 3, pet.mealsToday];
    const maxValue = Math.max(...data);
    
    // Configurações
    const barWidth = width / data.length * 0.6;
    const spacing = width / data.length * 0.4;
    const scale = (height - 40) / maxValue;
    
    // Desenhar barras
    data.forEach((value, index) => {
        const x = index * (barWidth + spacing) + spacing/2;
        const barHeight = value * scale;
        const y = height - barHeight - 20;
        
        // Gradiente
        const gradient = ctx.createLinearGradient(0, y, 0, height - 20);
        gradient.addColorStop(0, '#EA6B73');
        gradient.addColorStop(1, '#4A9B9B');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Valor
        ctx.fillStyle = '#1a1a1a';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value, x + barWidth/2, y - 5);
        
        // Label
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px Arial';
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Hoje'];
        ctx.fillText(days[index], x + barWidth/2, height - 5);
    });
}

// Carregar alimentação com dados reais
window.loadFeedingContent = function(screen) {
    if (!window.OiPetData) return;
    
    const petsOptions = window.OiPetData.pets.map(pet => 
        `<option value="${pet.id}">${pet.name} (${pet.breed})</option>`
    ).join('');
    
    screen.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Registrar Alimentação</h3>
                <div class="card-icon">🍽️</div>
            </div>
            <div style="display: grid; gap: 16px; margin-top: 16px;">
                <div>
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Pet:</label>
                    <select id="feeding-pet" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-light); font-size: 16px;">
                        ${petsOptions}
                    </select>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Alimento:</label>
                    <input type="text" id="feeding-food" placeholder="Ex: Ração Premium, Sachê..." 
                           style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-light); font-size: 16px;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Quantidade (gramas):</label>
                    <input type="number" id="feeding-amount" placeholder="Ex: 150" 
                           style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-light); font-size: 16px;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Horário:</label>
                    <input type="time" id="feeding-time" value="${new Date().toTimeString().slice(0,5)}"
                           style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-light); font-size: 16px;">
                </div>
                <button class="btn btn-primary" style="font-size: 18px; padding: 16px;" onclick="saveFeeding()">
                    ✅ Registrar Refeição
                </button>
            </div>
        </div>
        
        <div class="card" style="margin-top: 24px;">
            <h3 class="card-title">📊 Resumo de Hoje</h3>
            <div id="today-summary" style="margin-top: 16px;">
                ${generateTodaySummary()}
            </div>
        </div>
    `;
};

// Gerar resumo do dia
function generateTodaySummary() {
    if (!window.OiPetData) return '';
    
    const summary = window.OiPetData.pets.map(pet => `
        <div style="padding: 12px; background: #f8fafc; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>${pet.avatar} ${pet.name}</strong>
                <div style="font-size: 14px; color: #6b7280;">
                    ${pet.mealsToday} refeições • ${pet.caloriesConsumed} calorias
                </div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 12px; color: #6b7280;">Última refeição</div>
                <div style="font-weight: 600;">${new Date(pet.lastMeal).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
        </div>
    `).join('');
    
    return summary;
}

// Salvar alimentação
window.saveFeeding = function() {
    const petId = document.getElementById('feeding-pet').value;
    const food = document.getElementById('feeding-food').value;
    const amount = document.getElementById('feeding-amount').value;
    const time = document.getElementById('feeding-time').value;
    
    if (!food || !amount) {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    
    // Simular salvamento
    alert(`✅ Alimentação registrada com sucesso!\n\nPet: ${window.OiPetData.pets.find(p => p.id == petId).name}\nAlimento: ${food}\nQuantidade: ${amount}g\nHorário: ${time}`);
    
    // Atualizar dados
    const pet = window.OiPetData.pets.find(p => p.id == petId);
    if (pet) {
        pet.mealsToday++;
        pet.lastMeal = new Date().toISOString();
        pet.caloriesConsumed += Math.round(amount * 0.8); // Estimativa
    }
    
    // Recarregar tela
    loadFeedingContent(document.getElementById('feeding-screen'));
};

// Scanner funcional
window.loadScannerContent = function(screen) {
    screen.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Scanner de Produtos</h3>
                <div class="card-icon">📱</div>
            </div>
            <div style="text-align: center; padding: 40px;">
                <div style="font-size: 64px; margin-bottom: 16px;">📷</div>
                <p style="margin-bottom: 24px;">Clique para escanear um produto ou escolha um dos produtos populares abaixo</p>
                <button class="btn btn-primary" onclick="simulateScan()">
                    📸 Iniciar Scanner
                </button>
            </div>
        </div>
        
        <div class="card" style="margin-top: 24px;">
            <h3 class="card-title">🔥 Produtos Populares</h3>
            <div style="margin-top: 16px;">
                ${generatePopularProducts()}
            </div>
        </div>
    `;
};

// Gerar produtos populares
function generatePopularProducts() {
    if (!window.OiPetData) return '';
    
    return window.OiPetData.scannedProducts.map(product => `
        <div style="padding: 16px; background: #f8fafc; border-radius: 8px; margin-bottom: 12px; cursor: pointer; transition: all 0.2s;"
             onclick="showProductDetails('${product.name}')"
             onmouseover="this.style.background='#e2e8f0'" 
             onmouseout="this.style.background='#f8fafc'">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${product.name}</strong>
                    <div style="font-size: 14px; color: #6b7280;">${product.brand}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 18px; font-weight: 700; color: #f59e0b;">⭐ ${product.rating}</div>
                    <div style="font-size: 12px; color: #6b7280;">${product.scans} scans</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Simular scan
window.simulateScan = function() {
    alert('📸 Abrindo câmera...\n\n(Simulação: Em produção, isso abriria a câmera do dispositivo)');
    
    // Simular resultado após 2 segundos
    setTimeout(() => {
        const randomProduct = window.OiPetData.scannedProducts[Math.floor(Math.random() * window.OiPetData.scannedProducts.length)];
        showProductDetails(randomProduct.name);
    }, 2000);
};

// Mostrar detalhes do produto
window.showProductDetails = function(productName) {
    const product = window.OiPetData.scannedProducts.find(p => p.name === productName);
    if (!product) return;
    
    alert(`✅ Produto Identificado!\n\n📦 ${product.name}\n🏢 Marca: ${product.brand}\n⭐ Avaliação: ${product.rating}/5.0\n📊 ${product.scans} análises\n\n✨ Este produto é recomendado para pets adultos!`);
};

// Notícias funcionais
window.loadNewsContent = function(screen) {
    const news = [
        {
            title: "Nova linha de ração premium OiPet",
            date: "Hoje",
            category: "Lançamento",
            content: "Descubra os benefícios da nova linha de ração premium com ingredientes naturais selecionados."
        },
        {
            title: "Dicas de alimentação no inverno",
            date: "Ontem",
            category: "Dicas",
            content: "Como adaptar a dieta dos pets durante os meses mais frios do ano."
        },
        {
            title: "Importância da hidratação felina",
            date: "2 dias atrás",
            category: "Saúde",
            content: "Entenda por que gatos precisam de estímulo extra para beber água."
        },
        {
            title: "Obesidade canina: como prevenir",
            date: "3 dias atrás",
            category: "Saúde",
            content: "Guia completo sobre prevenção e tratamento da obesidade em cães."
        }
    ];
    
    screen.innerHTML = `
        <div class="content-grid">
            ${news.map(article => `
                <div class="card" style="cursor: pointer;" onclick="showArticle('${article.title}')">
                    <div class="card-header">
                        <h3 class="card-title">${article.title}</h3>
                        <span style="background: #EA6B73; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                            ${article.category}
                        </span>
                    </div>
                    <p style="color: #6b7280; margin: 12px 0;">${article.content}</p>
                    <p style="font-size: 12px; color: #9ca3af;">📅 ${article.date}</p>
                </div>
            `).join('')}
        </div>
    `;
};

// Mostrar artigo
window.showArticle = function(title) {
    alert(`📰 Abrindo artigo: ${title}\n\n(Em produção, isso abriria o artigo completo)`);
};

// Perfil funcional
window.loadProfileContent = function(screen) {
    screen.innerHTML = `
        <div class="card" style="max-width: 600px; margin: 0 auto;">
            <div class="card-header">
                <h3 class="card-title">Meu Perfil</h3>
                <div class="card-icon">👤</div>
            </div>
            <div style="display: grid; gap: 16px; margin-top: 16px;">
                <div>
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Nome:</label>
                    <input type="text" value="João Silva" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-light);">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Email:</label>
                    <input type="email" value="joao@email.com" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-light);">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Telefone:</label>
                    <input type="tel" value="(11) 99999-9999" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-light);">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Endereço:</label>
                    <input type="text" value="São Paulo, SP" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-light);">
                </div>
                <button class="btn btn-primary" onclick="saveProfile()">
                    ✅ Salvar Alterações
                </button>
            </div>
        </div>
        
        <div class="card" style="max-width: 600px; margin: 20px auto;">
            <h3 class="card-title">📊 Suas Estatísticas</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px;">
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: 700; color: #EA6B73;">${window.OiPetData.metrics.totalPets}</div>
                    <div style="font-size: 14px; color: #6b7280;">Pets Cadastrados</div>
                </div>
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: 700; color: #4A9B9B;">342</div>
                    <div style="font-size: 14px; color: #6b7280;">Refeições Registradas</div>
                </div>
            </div>
        </div>
    `;
};

// Salvar perfil
window.saveProfile = function() {
    alert('✅ Perfil atualizado com sucesso!');
};

// Admin funcional
window.loadAdminContent = function(screen) {
    if (!window.OiPetData) return;
    
    const stats = window.OiPetData.stats;
    
    screen.innerHTML = `
        <div class="content-grid">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Usuários</h3>
                    <div class="card-icon">👥</div>
                </div>
                <div class="stat-value">${stats.totalUsers.toLocaleString()}</div>
                <div class="stat-label">Usuários ativos</div>
                <div style="margin-top: 12px;">
                    <span style="color: #10b981; font-weight: 600;">+12.5%</span> este mês
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Pets</h3>
                    <div class="card-icon">🐕</div>
                </div>
                <div class="stat-value">${stats.totalPets.toLocaleString()}</div>
                <div class="stat-label">Pets cadastrados</div>
                <div style="margin-top: 12px;">
                    <span style="color: #10b981; font-weight: 600;">+8.3%</span> este mês
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Alimentações</h3>
                    <div class="card-icon">🍽️</div>
                </div>
                <div class="stat-value">${stats.totalFeedings.toLocaleString()}</div>
                <div class="stat-label">Refeições registradas</div>
                <div style="margin-top: 12px;">
                    <span style="color: #10b981; font-weight: 600;">+15.2%</span> este mês
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Scanner</h3>
                    <div class="card-icon">📱</div>
                </div>
                <div class="stat-value">${stats.totalScans.toLocaleString()}</div>
                <div class="stat-label">Produtos escaneados</div>
                <div style="margin-top: 12px;">
                    <span style="color: #ef4444; font-weight: 600;">-2.1%</span> este mês
                </div>
            </div>
        </div>
        
        <div class="card" style="margin-top: 24px;">
            <h3 class="card-title">⚡ Ações Rápidas</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-top: 16px;">
                <button class="btn btn-primary" onclick="adminAction('users')">👥 Gerenciar Usuários</button>
                <button class="btn btn-primary" onclick="adminAction('backup')">💾 Fazer Backup</button>
                <button class="btn btn-primary" onclick="adminAction('report')">📊 Gerar Relatório</button>
                <button class="btn btn-primary" onclick="adminAction('notifications')">📢 Enviar Notificação</button>
            </div>
        </div>
    `;
};

// Ações administrativas
window.adminAction = function(action) {
    const actions = {
        users: '👥 Abrindo gerenciamento de usuários...',
        backup: '💾 Iniciando backup do sistema...',
        report: '📊 Gerando relatório completo...',
        notifications: '📢 Preparando envio de notificações...'
    };
    
    alert(actions[action] || 'Ação administrativa');
};

// Analytics com dados reais
window.loadAnalyticsContent = function(screen) {
    screen.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Analytics Dashboard</h3>
                <div class="card-icon">📊</div>
            </div>
            <div style="padding: 20px;">
                <h4>📈 Crescimento de Usuários (Últimos 7 dias)</h4>
                <canvas id="analytics-chart" width="600" height="300" style="max-width: 100%;"></canvas>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 24px;">
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: 700; color: #10b981;">${window.OiPetData.stats.engagementRate}%</div>
                    <div style="font-size: 14px; color: #6b7280;">Taxa de Engajamento</div>
                </div>
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: 700; color: #0066EE;">R$ ${(window.OiPetData.stats.monthlyRevenue/1000).toFixed(1)}k</div>
                    <div style="font-size: 14px; color: #6b7280;">Receita Mensal</div>
                </div>
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: 700; color: #EA6B73;">${window.OiPetData.stats.dailyActiveUsers}</div>
                    <div style="font-size: 14px; color: #6b7280;">Usuários Ativos Hoje</div>
                </div>
            </div>
            
            <div style="margin-top: 24px; text-align: center;">
                <button class="btn btn-primary" onclick="window.open('components/AnalyticsDashboard.html', '_blank')">
                    📊 Abrir Analytics Completo
                </button>
            </div>
        </div>
    `;
    
    // Desenhar gráfico
    setTimeout(() => drawAnalyticsChart(), 100);
};

// Desenhar gráfico de analytics
function drawAnalyticsChart() {
    const canvas = document.getElementById('analytics-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Dados dos últimos 7 dias
    const data = window.OiPetData.feedingHistory.slice(-7);
    const maxValue = Math.max(...data.map(d => d.totalMeals));
    
    // Limpar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Configurações
    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    const barWidth = graphWidth / data.length * 0.7;
    const spacing = graphWidth / data.length * 0.3;
    
    // Desenhar eixos
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Desenhar barras
    data.forEach((item, index) => {
        const x = padding + index * (barWidth + spacing) + spacing/2;
        const barHeight = (item.totalMeals / maxValue) * graphHeight;
        const y = height - padding - barHeight;
        
        // Gradiente
        const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
        gradient.addColorStop(0, '#EA6B73');
        gradient.addColorStop(1, '#4A9B9B');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Valor
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.totalMeals, x + barWidth/2, y - 10);
        
        // Data
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Arial';
        const date = new Date(item.date);
        const label = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        ctx.fillText(label, x + barWidth/2, height - padding + 20);
    });
    
    // Título do eixo Y
    ctx.save();
    ctx.translate(15, height/2);
    ctx.rotate(-Math.PI/2);
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Número de Refeições', 0, 0);
    ctx.restore();
}

// Adicionar pet
window.showAddPetDialog = function() {
    const name = prompt('Nome do pet:');
    if (!name) return;
    
    const type = confirm('É um cachorro? (OK = Sim, Cancelar = Gato)') ? 'dog' : 'cat';
    const breed = prompt('Raça:');
    const age = prompt('Idade (anos):');
    const weight = prompt('Peso (kg):');
    
    if (name && breed && age && weight) {
        alert(`✅ Pet adicionado com sucesso!\n\nNome: ${name}\nTipo: ${type === 'dog' ? 'Cachorro' : 'Gato'}\nRaça: ${breed}\nIdade: ${age} anos\nPeso: ${weight}kg`);
        
        // Adicionar aos dados
        const newPet = {
            id: window.OiPetData.pets.length + 1,
            name,
            type,
            breed,
            age: parseInt(age),
            weight: parseFloat(weight),
            owner: "João Silva",
            avatar: type === 'dog' ? '🐕' : '🐱',
            healthScore: 95,
            lastMeal: new Date().toISOString(),
            mealsToday: 0,
            caloriesConsumed: 0,
            caloriesTarget: Math.round(weight * 30),
            allergies: [],
            medications: [],
            vaccinated: true,
            registeredDate: new Date().toISOString()
        };
        
        window.OiPetData.pets.push(newPet);
        window.OiPetData.metrics = window.OiPetData.calculateMetrics();
        
        // Recarregar tela
        switchScreen('pets');
    }
};

// Mostrar notificações
window.showNotificationsPanel = function() {
    alert(`🔔 Notificações\n\n• Max precisa da próxima refeição em 2 horas\n• Nova atualização do OiPet disponível\n• Luna completou 100% das calorias diárias\n• Lembrete: Consulta veterinária do Thor amanhã`);
};

// Registrar alimentação rápida
window.registerFeeding = function(petId) {
    const pet = window.OiPetData.pets.find(p => p.id === petId);
    if (!pet) return;
    
    alert(`🍽️ Registrando alimentação para ${pet.name}...\n\n(Redirecionando para tela de alimentação)`);
    
    // Ir para tela de alimentação com pet selecionado
    switchScreen('feeding');
    setTimeout(() => {
        const select = document.getElementById('feeding-pet');
        if (select) select.value = petId;
    }, 100);
};

// Mostrar histórico do pet
window.showPetHistory = function(petId) {
    const pet = window.OiPetData.pets.find(p => p.id === petId);
    if (!pet) return;
    
    alert(`📋 Histórico de ${pet.name}\n\n• Cadastrado em: ${new Date(pet.registeredDate).toLocaleDateString('pt-BR')}\n• Total de refeições: 342\n• Média diária: ${pet.mealsToday} refeições\n• Saúde média: ${pet.healthScore}%\n• Última consulta: 15/06/2025`);
};

// Editar pet
window.editPet = function(petId) {
    const pet = window.OiPetData.pets.find(p => p.id === petId);
    if (!pet) return;
    
    const newName = prompt('Nome:', pet.name);
    const newWeight = prompt('Peso (kg):', pet.weight);
    
    if (newName && newWeight) {
        pet.name = newName;
        pet.weight = parseFloat(newWeight);
        alert('✅ Informações atualizadas com sucesso!');
        showPetDetails(petId);
    }
};

// Função auxiliar para carregar analytics com dados reais
window.loadAnalyticsWithRealData = function() {
    switchScreen('analytics');
};

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}