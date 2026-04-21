// 推栏AI中枢管理后台 - 主应用JavaScript

class CenterSystemApp {
    constructor() {
        this.currentModule = 'dashboard';
        this.simulatedData = this.initSimulatedData();
        this.init();
    }
    
    init() {
        console.log('CenterSystem App 初始化...');
        this.initNavigation();
        this.initCharts();
        this.initModuleContents();
        this.initInteractions();
        this.initSimulatedUpdates();
    }
    
    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const contentSections = document.querySelectorAll('.content-section');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('href').substring(1);
                this.switchModule(targetId);
            });
        });
        
        // 定义导航项样式
        const style = document.createElement('style');
        style.textContent = `
            .nav-item {
                display: flex;
                align-items: center;
                padding: 10px 12px;
                border-radius: 8px;
                color: #4b5563;
                text-decoration: none;
                transition: all 0.2s ease;
            }
            .nav-item:hover {
                background-color: #f3f4f6;
                color: #1f2937;
            }
            .nav-item.active {
                background-color: #eff6ff;
                color: #1d4ed8;
                font-weight: 600;
            }
            .content-section {
                display: block;
            }
            .content-section.hidden {
                display: none;
            }
        `;
        document.head.appendChild(style);
    }
    
    switchModule(moduleId) {
        this.currentModule = moduleId;
        
        // 更新导航项状态
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
            if (nav.getAttribute('href') === `#${moduleId}`) {
                nav.classList.add('active');
            }
        });
        
        // 显示对应内容区
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('hidden');
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(moduleId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('active');
            
            // 动态加载模块内容
            this.loadModuleContent(moduleId);
        }
    }
    
    loadModuleContent(moduleId) {
        switch(moduleId) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'projects':
                this.renderProjects();
                break;
            case 'knowledge':
                this.renderKnowledge();
                break;
            case 'ai':
                this.renderAI();
                break;
            case 'workflow':
                this.renderWorkflow();
                break;
            case 'skills':
                this.renderSkills();
                break;
            case 'memory':
                this.renderMemory();
                break;
            case 'context':
                this.renderContext();
                break;
        }
    }
    
    initCharts() {
        // 项目进度图表
        this.renderProjectProgressChart();
        
        // AI模型使用图表
        this.renderAIModelChart();
    }
    
    renderProjectProgressChart() {
        const canvas = document.getElementById('projectProgressChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['V2.5聊天互通', 'V2.6页面优化', 'V2.7江湖榜单', 'V2.8规划中', 'V3.0设计'],
                datasets: [{
                    label: '完成度 (%)',
                    data: [100, 100, 100, 45, 20],
                    backgroundColor: [
                        '#10b981',
                        '#3b82f6',
                        '#8b5cf6',
                        '#f59e0b',
                        '#6b7280'
                    ],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { callback: value => value + '%' }
                    }
                }
            }
        });
    }
    
    renderAIModelChart() {
        const canvas = document.getElementById('aiModelChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Claude系列', 'GPT系列', 'GLM系列', 'DeepSeek', '其他'],
                datasets: [{
                    data: [42, 28, 18, 8, 4],
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#8b5cf6',
                        '#f59e0b',
                        '#6b7280'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } }
            }
        });
    }
    
    initModuleContents() {
        // 初始渲染仪表盘
        this.renderDashboard();
    }
    
    renderDashboard() {
        // 仪表盘内容已在HTML中定义
        // 可以在这里添加动态更新
    }
    
    renderProjects() {
        const container = document.getElementById('projects');
        if (!container) return;
        
        // 清空并重新渲染
        const existingContent = container.querySelector('.dynamic-content');
        if (existingContent) existingContent.remove();
        
        const content = document.createElement('div');
        content.className = 'dynamic-content';
        content.innerHTML = `
            <div class="mb-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">版本管理</h3>
                    <button id="createVersionBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
                        <i class="fas fa-plus mr-2"></i>创建新版本
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    ${this.renderVersionCards()}
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">需求看板</h4>
                        <div id="requirementsBoard" class="space-y-3">
                            ${this.renderRequirements()}
                        </div>
                        <div class="mt-4">
                            <button id="addRequirementBtn" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                <i class="fas fa-plus mr-1"></i>添加需求
                            </button>
                        </div>
                    </div>
                    
                    <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">任务甘特图</h4>
                        <div class="h-64">
                            <canvas id="ganttChart"></canvas>
                        </div>
                        <div class="mt-4 text-sm text-gray-500">
                            显示V2.8版本的任务时间线
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(content);
        
        // 初始化甘特图
        this.renderGanttChart();
        
        // 绑定事件
        this.bindProjectEvents();
    }
    
    renderVersionCards() {
        const versions = this.simulatedData.versions;
        return versions.map(version => `
            <div class="card-hover bg-white p-5 rounded-xl shadow border border-gray-100">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h4 class="font-bold text-gray-800">${version.name}</h4>
                        <p class="text-sm text-gray-500">${version.description}</p>
                    </div>
                    <span class="phase-badge phase-${version.phase}">${version.status}</span>
                </div>
                <div class="mb-4">
                    <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-600">进度</span>
                        <span class="font-medium">${version.progress}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full" style="width: ${version.progress}%"></div>
                    </div>
                </div>
                <div class="flex justify-between text-sm text-gray-500">
                    <span><i class="far fa-calendar mr-1"></i>${version.dueDate}</span>
                    <span><i class="fas fa-tasks mr-1"></i>${version.taskCount} 任务</span>
                </div>
            </div>
        `).join('');
    }
    
    renderRequirements() {
        const requirements = this.simulatedData.requirements;
        return requirements.map(req => `
            <div class="requirement-item p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" data-id="${req.id}">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h5 class="font-medium text-gray-800">${req.title}</h5>
                        <p class="text-sm text-gray-500 truncate">${req.description}</p>
                    </div>
                    <span class="ml-2 px-2 py-1 text-xs rounded-full ${this.getPriorityClass(req.priority)}">
                        ${req.priority}
                    </span>
                </div>
                <div class="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>版本: ${req.version}</span>
                    <span>${req.status}</span>
                </div>
            </div>
        `).join('');
    }
    
    getPriorityClass(priority) {
        const classes = {
            'critical': 'bg-red-100 text-red-800',
            'high': 'bg-orange-100 text-orange-800',
            'medium': 'bg-yellow-100 text-yellow-800',
            'low': 'bg-gray-100 text-gray-800'
        };
        return classes[priority] || classes.medium;
    }
    
    renderGanttChart() {
        const canvas = document.getElementById('ganttChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        // 简化版的甘特图
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['需求分析', 'UI设计', 'API开发', '测试', '部署'],
                datasets: [{
                    label: '计划时间',
                    data: [5, 3, 7, 4, 2],
                    backgroundColor: '#93c5fd',
                    borderColor: '#3b82f6',
                    borderWidth: 1
                }, {
                    label: '实际进度',
                    data: [4, 2, 3, 1, 0],
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '天数'
                        }
                    }
                }
            }
        });
    }
    
    bindProjectEvents() {
        // 创建版本按钮
        document.getElementById('createVersionBtn')?.addEventListener('click', () => {
            this.showCreateVersionModal();
        });
        
        // 添加需求按钮
        document.getElementById('addRequirementBtn')?.addEventListener('click', () => {
            this.showCreateRequirementModal();
        });
        
        // 需求项点击
        document.querySelectorAll('.requirement-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const id = item.getAttribute('data-id');
                this.showRequirementDetail(id);
            });
        });
    }
    
    showCreateVersionModal() {
        alert('创建新版本功能\n\n在实际系统中，这将打开一个表单用于定义新版本：\n- 版本号 (如 V2.8)\n- 目标发布日期\n- 里程碑设置\n- 关联的需求列表\n\nAI将协助分析需求并制定初步实施计划。');
    }
    
    showCreateRequirementModal() {
        alert('添加新需求功能\n\n表单包含：\n- 需求标题和详细描述\n- 优先级 (critical/high/medium/low)\n- 关联的版本\n- 预估工作量\n- 依赖关系\n\nAI将自动分析需求并关联现有知识库条目。');
    }
    
    showRequirementDetail(id) {
        const req = this.simulatedData.requirements.find(r => r.id === id);
        if (req) {
            alert(`需求详情: ${req.title}\n\n描述: ${req.description}\n\n优先级: ${req.priority}\n状态: ${req.status}\n版本: ${req.version}\n\nAI建议: 此需求涉及聊天功能，建议参考V2.5的历史实现经验。`);
        }
    }
    
    // 其他模块的渲染函数
    renderKnowledge() {
        const container = document.getElementById('knowledge');
        if (!container) return;
        
        const existingContent = container.querySelector('.dynamic-content');
        if (existingContent) existingContent.remove();
        
        const content = document.createElement('div');
        content.className = 'dynamic-content';
        content.innerHTML = `
            <div class="mb-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">知识库浏览器</h3>
                    <div class="flex space-x-2">
                        <div class="relative">
                            <input type="text" placeholder="搜索知识库..." class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                        </div>
                        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
                            <i class="fas fa-sync-alt mr-2"></i>同步Obsidian
                        </button>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">知识图谱</h4>
                        <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div class="text-center">
                                <i class="fas fa-project-diagram text-4xl text-gray-400 mb-3"></i>
                                <p class="text-gray-500">可视化知识关联图</p>
                                <button class="mt-3 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
                                    查看完整图谱
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100 lg:col-span-2">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">最近更新的知识页面</h4>
                        <div class="space-y-3">
                            ${this.renderKnowledgePages()}
                        </div>
                    </div>
                </div>
                
                <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4">知识分类统计</h4>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="text-center p-4 bg-blue-50 rounded-lg">
                            <div class="text-2xl font-bold text-blue-600">8</div>
                            <div class="text-sm text-gray-600 mt-1">Entities</div>
                        </div>
                        <div class="text-center p-4 bg-green-50 rounded-lg">
                            <div class="text-2xl font-bold text-green-600">6</div>
                            <div class="text-sm text-gray-600 mt-1">Concepts</div>
                        </div>
                        <div class="text-center p-4 bg-purple-50 rounded-lg">
                            <div class="text-2xl font-bold text-purple-600">2</div>
                            <div class="text-sm text-gray-600 mt-1">Queries</div>
                        </div>
                        <div class="text-center p-4 bg-orange-50 rounded-lg">
                            <div class="text-2xl font-bold text-orange-600">13</div>
                            <div class="text-sm text-gray-600 mt-1">总页面</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(content);
        
        // 绑定知识库事件
        this.bindKnowledgeEvents();
    }
    
    renderKnowledgePages() {
        const pages = this.simulatedData.knowledgePages;
        return pages.map(page => `
            <div class="knowledge-page-item p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" data-id="${page.id}">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h5 class="font-medium text-gray-800">${page.title}</h5>
                        <p class="text-sm text-gray-500">${page.description}</p>
                    </div>
                    <span class="ml-2 px-2 py-1 text-xs rounded-full ${page.type === 'entity' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
                        ${page.type}
                    </span>
                </div>
                <div class="flex items-center mt-2 text-xs text-gray-500">
                    <span class="mr-3"><i class="far fa-calendar mr-1"></i>${page.updated}</span>
                    <span><i class="fas fa-tags mr-1"></i>${page.tags.join(', ')}</span>
                </div>
            </div>
        `).join('');
    }
    
    bindKnowledgeEvents() {
        // 知识页面点击
        document.querySelectorAll('.knowledge-page-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const id = item.getAttribute('data-id');
                this.showKnowledgePageDetail(id);
            });
        });
        
        // 搜索功能
        const searchInput = document.querySelector('#knowledge input[type="text"]');
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    this.searchKnowledge(e.target.value);
                }
            });
        }
    }
    
    showKnowledgePageDetail(id) {
        const page = this.simulatedData.knowledgePages.find(p => p.id === id);
        if (page) {
            alert(`知识页面: ${page.title}\n\n类型: ${page.type}\n描述: ${page.description}\n\n标签: ${page.tags.join(', ')}\n最后更新: ${page.updated}\n\n关联版本: ${page.relatedVersions.join(', ')}\n\nAI建议: 此页面内容可用于当前V2.8的需求分析。`);
        }
    }
    
    searchKnowledge(query) {
        alert(`搜索知识库: "${query}"\n\n在实际系统中，这将执行语义搜索，返回相关的知识页面、历史记忆和最佳实践。\n\n搜索结果将按相关性排序，并显示与当前任务上下文的匹配度。`);
    }
    
    // AI调度中心
    renderAI() {
        const container = document.getElementById('ai');
        if (!container) return;
        
        const existingContent = container.querySelector('.dynamic-content');
        if (existingContent) existingContent.remove();
        
        const content = document.createElement('div');
        content.className = 'dynamic-content';
        content.innerHTML = `
            <div class="mb-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-semibold text-gray-800">AI模型调度中心</h3>
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
                        <i class="fas fa-cog mr-2"></i>模型配置
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    ${this.renderAIModelCards()}
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                    <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">计划生成器</h4>
                        <div class="mb-4">
                            <textarea id="aiPlanInput" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="4" placeholder="输入需求描述...&#10;例如：优化推栏小程序聊天界面，增加消息撤回功能"></textarea>
                        </div>
                        <button id="generatePlanBtn" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition">
                            <i class="fas fa-magic mr-2"></i>生成实施计划
                        </button>
                        <div class="mt-4 text-sm text-gray-500">
                            将自动调用Claude分析需求，检索历史记忆，输出详细实施计划。
                        </div>
                    </div>
                    
                    <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">任务分解面板</h4>
                        <div id="taskDecomposition" class="space-y-3">
                            ${this.renderAITasks()}
                        </div>
                        <div class="mt-4">
                            <button id="assignTasksBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
                                <i class="fas fa-robot mr-2"></i>分配AI执行
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4">AI代理调度日志</h4>
                    <div class="space-y-3">
                        ${this.renderAILogs()}
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(content);
        
        // 绑定AI事件
        this.bindAIEvents();
    }
    
    renderAIModelCards() {
        const models = this.simulatedData.aiModels;
        return models.map(model => `
            <div class="card-hover bg-white p-5 rounded-xl shadow border border-gray-100">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h4 class="font-bold text-gray-800">${model.name}</h4>
                        <p class="text-sm text-gray-500">${model.provider}</p>
                    </div>
                    <span class="px-2 py-1 text-xs rounded-full ${model.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${model.status}
                    </span>
                </div>
                <div class="mb-3">
                    <div class="text-xs text-gray-500 mb-1">今日使用</div>
                    <div class="text-xl font-bold">${model.usageToday}</div>
                </div>
                <div class="text-xs text-gray-500">
                    擅长: ${model.expertise}
                </div>
            </div>
        `).join('');
    }
    
    renderAITasks() {
        const tasks = this.simulatedData.aiTasks;
        return tasks.map(task => `
            <div class="ai-task-item p-3 border border-gray-200 rounded-lg">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h5 class="font-medium text-gray-800">${task.title}</h5>
                        <p class="text-sm text-gray-500">${task.description}</p>
                    </div>
                    <span class="ml-2 px-2 py-1 text-xs rounded-full ${this.getTaskStatusClass(task.status)}">
                        ${task.status}
                    </span>
                </div>
                <div class="flex items-center mt-2 text-xs text-gray-500">
                    <span class="mr-3"><i class="fas fa-robot mr-1"></i>${task.assignedModel}</span>
                    <span><i class="far fa-clock mr-1"></i>${task.estimatedTime}</span>
                </div>
            </div>
        `).join('');
    }
    
    getTaskStatusClass(status) {
        const classes = {
            'pending': 'bg-gray-100 text-gray-800',
            'in_progress': 'bg-blue-100 text-blue-800',
            'completed': 'bg-green-100 text-green-800',
            'failed': 'bg-red-100 text-red-800'
        };
        return classes[status] || classes.pending;
    }
    
    renderAILogs() {
        const logs = this.simulatedData.aiLogs;
        return logs.map(log => `
            <div class="ai-log-item p-3 border-l-4 ${log.type === 'success' ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'}">
                <div class="flex justify-between">
                    <span class="font-medium">${log.action}</span>
                    <span class="text-sm text-gray-500">${log.time}</span>
                </div>
                <div class="text-sm text-gray-600 mt-1">${log.details}</div>
            </div>
        `).join('');
    }
    
    bindAIEvents() {
        // 生成计划按钮
        document.getElementById('generatePlanBtn')?.addEventListener('click', () => {
            const input = document.getElementById('aiPlanInput')?.value;
            this.generatePlan(input);
        });
        
        // 分配任务按钮
        document.getElementById('assignTasksBtn')?.addEventListener('click', () => {
            this.assignAITasks();
        });
    }
    
    generatePlan(input) {
        if (!input || input.trim() === '') {
            alert('请输入需求描述');
            return;
        }
        
        alert(`正在生成实施计划...\n\n需求: "${input}"\n\nAI正在执行:\n1. 分析需求范围和技术要求\n2. 检索相关历史记忆和知识库\n3. 制定详细的任务分解\n4. 预估工作量和资源需求\n\n预计耗时: 30-60秒\n完成后将显示详细计划。`);
        
        // 模拟异步生成
        setTimeout(() => {
            alert(`计划生成完成!\n\n基于需求"${input}"，AI已制定详细实施计划:\n\n1. 需求分析 (2天)\n   - 明确功能范围\n   - 技术方案设计\n   - API接口定义\n\n2. UI/UX设计 (3天)\n   - 界面原型\n   - 交互流程\n\n3. 开发实施 (7天)\n   - 前端组件开发\n   - 后端API实现\n   - 数据库设计\n\n4. 测试部署 (3天)\n   - 单元测试\n   - 集成测试\n   - 生产部署\n\n总计: 15天\n推荐AI代理: Claude Code + GPT-4\n推荐Skills: github-pr-workflow, taro-4-testing-setup`);
        }, 1000);
    }
    
    assignAITasks() {
        alert('正在分配AI执行任务...\n\nAI调度系统将:\n1. 为每个任务选择最合适的模型\n2. 分配执行资源\n3. 设置任务优先级\n4. 监控执行进度\n5. 自动处理失败重试\n\n所有任务将进入工作流编排引擎执行。');
    }
    
    // 其他模块的渲染函数（简化版）
    renderWorkflow() {
        this.renderModuleTemplate('workflow', '工作流编排', '可视化工作流设计、执行监控与自动化任务处理');
    }
    
    renderSkills() {
        this.renderModuleTemplate('skills', 'Skill仓库', 'Hermes Agent技能管理、分类、编排与执行监控');
    }
    
    renderMemory() {
        this.renderModuleTemplate('memory', '记忆系统', '历史经验存储、语义检索、关联分析与智能推荐');
    }
    
    renderContext() {
        this.renderModuleTemplate('context', '上下文管理系统', '任务上下文构建、维护、注入与版本控制');
    }
    
    renderModuleTemplate(moduleId, title, description) {
        const container = document.getElementById(moduleId);
        if (!container) return;
        
        const existingContent = container.querySelector('.dynamic-content');
        if (existingContent) existingContent.remove();
        
        const content = document.createElement('div');
        content.className = 'dynamic-content';
        content.innerHTML = `
            <div class="mb-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">${title}</h3>
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
                        <i class="fas fa-plus mr-2"></i>新建
                    </button>
                </div>
                
                <div class="card-hover bg-white p-8 rounded-xl shadow border border-gray-100">
                    <div class="text-center">
                        <i class="fas fa-cogs text-4xl text-gray-400 mb-4"></i>
                        <h4 class="text-xl font-semibold text-gray-700 mb-2">${title}</h4>
                        <p class="text-gray-500 mb-6">${description}</p>
                        <p class="text-gray-400 text-sm">
                            此模块的完整功能需要后端API支持。当前为演示界面。
                            在实际系统中，这里将提供完整的${title}功能。
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(content);
    }
    
    initInteractions() {
        // 新建任务按钮
        document.querySelector('button.bg-blue-600:not(#createVersionBtn):not(#generatePlanBtn):not(#assignTasksBtn)')?.addEventListener('click', function() {
            alert('新建任务功能\n\n在实际系统中，这将打开任务创建表单，AI将协助您分解需求、制定计划并分配执行资源。');
        });
        
        // 活动项点击
        document.querySelectorAll('.hover\\:bg-gray-50').forEach(item => {
            item.addEventListener('click', function() {
                const title = this.querySelector('.font-medium')?.textContent || '活动项';
                alert(`查看活动详情: ${title}\n\n点击可以查看完整的执行日志、相关上下文和输出结果。`);
            });
        });
    }
    
    initSimulatedUpdates() {
        // 模拟实时更新
        setInterval(() => {
            this.updateSimulatedData();
        }, 30000); // 每30秒更新一次
    }
    
    updateSimulatedData() {
        // 模拟数据更新
        console.log('模拟数据更新...');
    }
    
    initSimulatedData() {
        return {
            versions: [
                { id: 1, name: 'V2.5', description: '游戏聊天互通', status: '已发布', phase: 1, progress: 100, dueDate: '2025-12-31', taskCount: 42 },
                { id: 2, name: 'V2.6', description: '复合页面优化', status: '已发布', phase: 2, progress: 100, dueDate: '2026-01-28', taskCount: 38 },
                { id: 3, name: 'V2.7', description: '江湖榜单', status: '测试中', phase: 3, progress: 85, dueDate: '2026-04-23', taskCount: 56 },
                { id: 4, name: 'V2.8', description: '聊天功能优化', status: '规划中', phase: 4, progress: 45, dueDate: '2026-06-30', taskCount: 24 },
                { id: 5, name: 'V3.0', description: '架构重构', status: '设计中', phase: 4, progress: 20, dueDate: '2026-12-31', taskCount: 12 }
            ],
            requirements: [
                { id: 'req-001', title: '聊天消息撤回功能', description: '增加微信小程序聊天消息撤回功能', priority: 'high', version: 'V2.8', status: '待分析' },
                { id: 'req-002', title: '复合页面样式优化', description: '优化现有复合页面配置样式', priority: 'medium', version: 'V2.8', status: '已计划' },
                { id: 'req-003', title: 'API性能优化', description: '优化聊天API响应时间', priority: 'critical', version: 'V2.8', status: '进行中' },
                { id: 'req-004', title: '多语言支持', description: '增加英文界面支持', priority: 'low', version: 'V3.0', status: '待排期' }
            ],
            knowledgePages: [
                { id: 'page-001', title: '游戏聊天互通', type: 'concept', description: 'V2.5版本的核心功能，打通游戏-APP社交闭环', updated: '2026-04-18', tags: ['feature', 'chat', 'core'], relatedVersions: ['V2.5'] },
                { id: 'page-002', title: '推栏 App', type: 'entity', description: '推栏小程序主产品页面', updated: '2026-04-18', tags: ['product', 'app', 'frontend'], relatedVersions: ['V2.5', 'V2.6', 'V2.7'] },
                { id: 'page-003', title: '复合页面配置', type: 'concept', description: 'V2.6版本的后台可配置复合页面', updated: '2026-04-18', tags: ['feature', 'backend', 'ui'], relatedVersions: ['V2.6'] },
                { id: 'page-004', title: '江湖榜单评分系统', type: 'concept', description: 'V2.7版本的玩家评分社区功能', updated: '2026-04-18', tags: ['feature', 'ranking', 'community'], relatedVersions: ['V2.7'] }
            ],
            aiModels: [
                { id: 1, name: 'Claude 3.5 Sonnet', provider: 'Anthropic', status: 'online', usageToday: '142', expertise: '代码生成、复杂推理' },
                { id: 2, name: 'GPT-4 Turbo', provider: 'OpenAI', status: 'online', usageToday: '98', expertise: '创意写作、多轮对话' },
                { id: 3, name: 'GLM-4', provider: '智谱AI', status: 'online', usageToday: '76', expertise: '中文理解、本地化' },
                { id: 4, name: 'DeepSeek V3', provider: '深度求索', status: 'online', usageToday: '45', expertise: '数学推理、代码分析' }
            ],
            aiTasks: [
                { id: 1, title: '需求分析: 消息撤回', description: '分析消息撤回功能的技术实现方案', status: 'completed', assignedModel: 'Claude 3.5', estimatedTime: '2小时' },
                { id: 2, title: 'API接口设计', description: '设计撤回功能的API接口规范', status: 'in_progress', assignedModel: 'GPT-4', estimatedTime: '4小时' },
                { id: 3, title: '前端组件开发', description: '开发消息撤回的前端UI组件', status: 'pending', assignedModel: 'Claude Code', estimatedTime: '8小时' },
                { id: 4, title: '测试用例编写', description: '编写撤回功能的自动化测试', status: 'pending', assignedModel: 'GLM-4', estimatedTime: '3小时' }
            ],
            aiLogs: [
                { id: 1, action: '需求分析完成', time: '10:24', type: 'success', details: 'V2.8聊天功能优化需求分析完成，输出技术方案文档' },
                { id: 2, action: '模型调度', time: '09:45', type: 'success', details: '分配Claude 3.5执行代码审查任务' },
                { id: 3, action: '计划生成', time: '昨天 16:30', type: 'success', details: '生成复合页面优化实施计划，包含12个子任务' },
                { id: 4, action: '技能调用', time: '昨天 14:15', type: 'success', details: '成功调用github-pr-workflow技能，创建PR#42' }
            ]
        };
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CenterSystemApp();
});