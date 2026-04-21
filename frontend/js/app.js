// 推栏AI中枢管理后台 - 主应用JavaScript (支持双层级角色架构)
class CenterSystemApp {
  constructor() {
    this.auth = window.authManager;
    this.currentModule = 'dashboard';
    this.simulatedData = this.initSimulatedData();
    this.roleModules = this.initRoleModules();
    this.init();
  }
  
  init() {
    console.log('CenterSystem App 初始化...');
    
    // 检查认证状态
    if (!this.auth.isAuthenticated()) {
      this.showLoginPage();
      return;
    }
    
    this.initUI();
  }

  initUI() {
    console.log('初始化UI，角色:', this.auth.getRole());
    this.initNavigation();
    this.initTopBar();
    this.initCharts();
    this.initModuleContents();
    this.initInteractions();
    this.initSimulatedUpdates();
  }

  showLoginPage() {
    // 隐藏主应用，显示登录页面
    const appContainer = document.getElementById('app-container');
    const loginPage = document.getElementById('login-page');
    
    if (appContainer) appContainer.classList.add('hidden');
    if (loginPage) loginPage.classList.remove('hidden');
    
    // 重置登录按钮状态
    this.resetLoginButtons();
    
    // 绑定登录按钮事件
    this.bindLoginEvents();
  }
  
  resetLoginButtons() {
    const deptLeaderBtn = document.getElementById('login-dept-leader');
    const projLeaderBtn = document.getElementById('login-proj-leader');
    
    if (deptLeaderBtn) {
      deptLeaderBtn.disabled = false;
      deptLeaderBtn.innerHTML = '<i class="fas fa-user-tie mr-2"></i> 以部门负责人登录';
    }
    
    if (projLeaderBtn) {
      projLeaderBtn.disabled = false;
      projLeaderBtn.innerHTML = '<i class="fas fa-user-check mr-2"></i> 以项目负责人登录';
    }
    
    // 重置角色卡片选择状态
    const deptCard = document.getElementById('dept-leader-card');
    const projCard = document.getElementById('proj-leader-card');
    if (deptCard) deptCard.classList.remove('selected');
    if (projCard) projCard.classList.remove('selected');
  }

  bindLoginEvents() {
    const deptLeaderBtn = document.getElementById('login-dept-leader');
    const projLeaderBtn = document.getElementById('login-proj-leader');
    const logoutBtn = document.getElementById('logout-btn');
    
    // 清除可能存在的旧事件处理器
    if (deptLeaderBtn) {
      deptLeaderBtn.onclick = null;
      deptLeaderBtn.onclick = async () => {
        try {
          console.log('部门负责人登录点击');
          deptLeaderBtn.disabled = true;
          deptLeaderBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>登录中...';
          
          await this.auth.login('department_leader');
          this.handleLoginSuccess();
          
          deptLeaderBtn.disabled = false;
          deptLeaderBtn.innerHTML = '<i class="fas fa-user-tie mr-2"></i> 以部门负责人登录';
        } catch (error) {
          console.error('部门负责人登录失败:', error);
          deptLeaderBtn.disabled = false;
          deptLeaderBtn.innerHTML = '<i class="fas fa-user-tie mr-2"></i> 以部门负责人登录';
          this.showToast('登录失败，请重试');
        }
      };
    }
    
    if (projLeaderBtn) {
      projLeaderBtn.onclick = null;
      projLeaderBtn.onclick = async () => {
        try {
          console.log('项目负责人登录点击');
          projLeaderBtn.disabled = true;
          projLeaderBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>登录中...';
          
          // 模拟项目选择 - 实际项目中应从API获取
          const projectId = 'proj-001'; // 默认项目
          await this.auth.login('project_leader', projectId);
          this.handleLoginSuccess();
          
          projLeaderBtn.disabled = false;
          projLeaderBtn.innerHTML = '<i class="fas fa-user-check mr-2"></i> 以项目负责人登录';
        } catch (error) {
          console.error('项目负责人登录失败:', error);
          projLeaderBtn.disabled = false;
          projLeaderBtn.innerHTML = '<i class="fas fa-user-check mr-2"></i> 以项目负责人登录';
          this.showToast('登录失败，请重试');
        }
      };
    }
    
    if (logoutBtn) {
      logoutBtn.onclick = null;
      logoutBtn.onclick = () => {
        this.auth.logout();
        this.showLoginPage();
      };
    }
  }

  handleLoginSuccess() {
    // 隐藏登录页面，显示主应用
    const appContainer = document.getElementById('app-container');
    const loginPage = document.getElementById('login-page');
    
    if (appContainer) appContainer.classList.remove('hidden');
    if (loginPage) loginPage.classList.add('hidden');
    
    // 重新初始化UI
    this.initUI();
    
    // 显示欢迎消息
    this.showWelcomeMessage();
  }

  showWelcomeMessage() {
    const roleName = this.auth.getRoleDisplayName();
    const userName = this.auth.getUser()?.name || '用户';
    
    // 显示Toast通知
    setTimeout(() => {
      this.showToast(`欢迎回来，${roleName} ${userName}！系统已根据您的角色优化界面。`);
    }, 500);
  }

  showToast(message) {
    // 创建Toast元素
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-y-0';
    toast.innerHTML = `
      <div class="flex items-center">
        <i class="fas fa-check-circle text-green-400 mr-2"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // 3秒后自动移除
    setTimeout(() => {
      toast.classList.add('translate-y-full');
      setTimeout(() => {
        if (toast.parentNode) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  initNavigation() {
    const navContainer = document.querySelector('nav.space-y-2');
    if (!navContainer) return;
    
    // 根据角色生成导航
    const navConfig = this.auth.getNavigationConfig();
    let navHTML = '';
    
    navConfig.forEach(item => {
      if (item.type === 'divider') {
        navHTML += `
          <div class="my-4 border-t border-gray-200 pt-4">
            <h4 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">${item.label}</h4>
          </div>
        `;
      } else {
        const isActive = this.currentModule === item.id;
        navHTML += `
          <a href="#${item.id}" class="nav-item ${isActive ? 'active' : ''}" data-module="${item.id}">
            <i class="fas fa-${item.icon} mr-3"></i> ${item.name}
          </a>
        `;
      }
    });
    
    navContainer.innerHTML = navHTML;
    
    // 绑定导航事件
    this.bindNavigationEvents();
  }

  bindNavigationEvents() {
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
    const dataScope = this.auth.getDataScope();
    
    // 根据角色和模块加载不同的内容
    if (this.auth.isDepartmentLeader()) {
      this.loadDepartmentLeaderModule(moduleId, dataScope);
    } else if (this.auth.isProjectLeader()) {
      this.loadProjectLeaderModule(moduleId, dataScope);
    } else {
      // 默认加载
      this.loadDefaultModule(moduleId);
    }
  }

  loadDepartmentLeaderModule(moduleId, dataScope) {
    switch(moduleId) {
      case 'dashboard':
        this.renderDashboard({ ...dataScope, level: 'department' });
        break;
      case 'projects':
        this.renderProjectPortfolio(dataScope);
        break;
      case 'resources':
        this.renderResourceCenter(dataScope);
        break;
      case 'strategy':
        this.renderStrategyPlanner(dataScope);
        break;
      case 'collaboration':
        this.renderCrossProjectCollaboration(dataScope);
        break;
      case 'knowledge':
        this.renderKnowledgeHub({ ...dataScope, filter: 'strategic' });
        break;
      case 'ai':
        this.renderAIScheduling({ ...dataScope, level: 'department' });
        break;
      case 'workflow':
        this.renderWorkflowOrchestration({ ...dataScope, type: 'strategic' });
        break;
      case 'skills':
        this.renderSkills({ ...dataScope, view: 'all' });
        break;
      case 'memory':
        this.renderMemory({ ...dataScope, scope: 'department' });
        break;
      case 'context':
        this.renderContext({ ...dataScope, scope: 'department' });
        break;
      default:
        this.renderDefaultModule(moduleId, dataScope);
    }
  }

  loadProjectLeaderModule(moduleId, dataScope) {
    switch(moduleId) {
      case 'workspace':
        this.renderProjectWorkspace(dataScope);
        break;
      case 'tasks':
        this.renderTaskManagement(dataScope);
        break;
      case 'team':
        this.renderTeamCollaboration(dataScope);
        break;
      case 'execution':
        this.renderExecutionEngine(dataScope);
        break;
      case 'issues':
        this.renderIssueResolution(dataScope);
        break;
      case 'knowledge':
        this.renderKnowledgeHub({ ...dataScope, filter: 'project' });
        break;
      case 'ai':
        this.renderAIScheduling({ ...dataScope, level: 'project' });
        break;
      case 'workflow':
        this.renderWorkflowOrchestration({ ...dataScope, type: 'execution' });
        break;
      case 'skills':
        this.renderSkills({ ...dataScope, view: 'project' });
        break;
      case 'memory':
        this.renderMemory({ ...dataScope, scope: 'project' });
        break;
      case 'context':
        this.renderContext({ ...dataScope, scope: 'project' });
        break;
      default:
        this.renderDefaultModule(moduleId, dataScope);
    }
  }

  loadDefaultModule(moduleId) {
    // 默认模块渲染（兼容旧版）
    switch(moduleId) {
      case 'dashboard':
        this.renderDashboard({ scope: 'default' });
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

  // ==================== 部门负责人模块 ====================
  
  renderDashboard(options = {}) {
    const container = document.getElementById('dashboard');
    if (!container) return;
    
    const existingContent = container.querySelector('.dynamic-content');
    if (existingContent) existingContent.remove();
    
    const isDepartmentView = options.level === 'department';
    const title = isDepartmentView ? '全局仪表盘 - 部门视图' : '项目仪表盘';
    const description = isDepartmentView 
      ? '部门级项目组合健康度、资源利用与战略对齐监控' 
      : '推栏小程序AI中枢管理后台 - 实时监控与智能控制';
    
    let contentHTML = '';
    
    if (isDepartmentView) {
      contentHTML = this.renderDepartmentDashboard(options);
    } else {
      contentHTML = this.renderDefaultDashboard();
    }
    
    const content = document.createElement('div');
    content.className = 'dynamic-content';
    content.innerHTML = `
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">${title}</h2>
        <p class="text-gray-600">${description}</p>
        ${isDepartmentView ? '<div class="mt-2 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"><i class="fas fa-user-tie mr-1"></i> 部门负责人视图</div>' : ''}
      </div>
      
      ${contentHTML}
    `;
    
    container.appendChild(content);
    
    // 初始化图表
    if (isDepartmentView) {
      this.renderDepartmentCharts();
    } else {
      this.initCharts();
    }
  }

  renderDepartmentDashboard(options) {
    return `
      <!-- 部门级关键指标 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">项目组合</p>
              <h3 class="text-2xl font-bold mt-2">8</h3>
            </div>
            <div class="bg-blue-100 p-3 rounded-lg">
              <i class="fas fa-project-diagram text-blue-600 text-xl"></i>
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-500">
            <span class="text-green-600 font-medium"><i class="fas fa-arrow-up mr-1"></i>2个新增</span> 本月
          </div>
        </div>
        
        <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">资源利用率</p>
              <h3 class="text-2xl font-bold mt-2">87%</h3>
            </div>
            <div class="bg-green-100 p-3 rounded-lg">
              <i class="fas fa-chart-line text-green-600 text-xl"></i>
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-500">
            <span class="text-yellow-600 font-medium"><i class="fas fa-exclamation-triangle mr-1"></i>优化空间</span> AI配额
          </div>
        </div>
        
        <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">战略对齐度</p>
              <h3 class="text-2xl font-bold mt-2">92%</h3>
            </div>
            <div class="bg-purple-100 p-3 rounded-lg">
              <i class="fas fa-bullseye text-purple-600 text-xl"></i>
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-500">
            <span class="text-green-600 font-medium"><i class="fas fa-check-circle mr-1"></i>良好</span> 目标达成
          </div>
        </div>
        
        <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">风险项目</p>
              <h3 class="text-2xl font-bold mt-2">2</h3>
            </div>
            <div class="bg-red-100 p-3 rounded-lg">
              <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-500">
            <span class="text-red-600 font-medium"><i class="fas fa-arrow-up mr-1"></i>需关注</span> V2.8, V3.0
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">项目组合健康度</h3>
          <div class="h-64">
            <canvas id="portfolioHealthChart"></canvas>
          </div>
          <div class="mt-4 text-sm text-gray-500">
            按项目阶段和风险等级分布
          </div>
        </div>
        
        <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">资源分配概览</h3>
          <div class="h-64">
            <canvas id="resourceAllocationChart"></canvas>
          </div>
          <div class="mt-4 text-sm text-gray-500">
            人力、AI、预算资源分布
          </div>
        </div>
      </div>
      
      <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold text-gray-800">项目组合列表</h3>
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
            <i class="fas fa-plus mr-2"></i>新建项目
          </button>
        </div>
        
        <div class="space-y-4">
          ${this.renderPortfolioProjects()}
        </div>
      </div>
    `;
  }

  renderPortfolioProjects() {
    const projects = [
      { id: 1, name: '推栏小程序V2.8', manager: '张三', status: 'active', health: 'good', progress: 45, risks: 2 },
      { id: 2, name: 'AI中枢平台', manager: '李四', status: 'active', health: 'good', progress: 78, risks: 1 },
      { id: 3, name: '数据中台建设', manager: '王五', status: 'active', health: 'warning', progress: 62, risks: 3 },
      { id: 4, name: '用户增长计划', manager: '赵六', status: 'planning', health: 'good', progress: 20, risks: 0 },
      { id: 5, name: '技术架构升级', manager: '钱七', status: 'active', health: 'critical', progress: 35, risks: 5 }
    ];
    
    return projects.map(project => {
      const healthColors = {
        good: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        critical: 'bg-red-100 text-red-800'
      };
      
      const statusColors = {
        active: 'bg-blue-100 text-blue-800',
        planning: 'bg-gray-100 text-gray-800',
        completed: 'bg-green-100 text-green-800'
      };
      
      return `
        <div class="portfolio-project-item p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h4 class="font-bold text-gray-800">${project.name}</h4>
              <div class="flex items-center mt-1 text-sm text-gray-500">
                <span class="mr-4"><i class="fas fa-user mr-1"></i>${project.manager}</span>
                <span><i class="fas fa-tasks mr-1"></i>进度: ${project.progress}%</span>
              </div>
            </div>
            <div class="flex space-x-2">
              <span class="px-2 py-1 text-xs rounded-full ${statusColors[project.status]}">${project.status}</span>
              <span class="px-2 py-1 text-xs rounded-full ${healthColors[project.health]}">${project.health}</span>
            </div>
          </div>
          <div class="mt-3">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600">项目进度</span>
              <span class="font-medium">${project.progress}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="h-2 rounded-full ${project.health === 'good' ? 'bg-green-600' : project.health === 'warning' ? 'bg-yellow-600' : 'bg-red-600'}" style="width: ${project.progress}%"></div>
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            <i class="fas fa-exclamation-circle mr-1"></i>风险点: ${project.risks} 个
          </div>
        </div>
      `;
    }).join('');
  }

  renderDepartmentCharts() {
    // 项目组合健康度图表
    const portfolioCanvas = document.getElementById('portfolioHealthChart');
    if (portfolioCanvas) {
      const ctx = portfolioCanvas.getContext('2d');
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['进度', '质量', '资源', '风险', '战略对齐', '团队协作'],
          datasets: [{
            label: '推栏小程序V2.8',
            data: [45, 70, 60, 30, 80, 65],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3b82f6',
            borderWidth: 2
          }, {
            label: 'AI中枢平台',
            data: [78, 85, 75, 45, 90, 80],
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: '#10b981',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    }
    
    // 资源分配图表
    const resourceCanvas = document.getElementById('resourceAllocationChart');
    if (resourceCanvas) {
      const ctx = resourceCanvas.getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['推栏小程序', 'AI中枢平台', '数据中台', '用户增长', '技术架构'],
          datasets: [{
            data: [35, 25, 20, 10, 10],
            backgroundColor: [
              '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right' }
          }
        }
      });
    }
  }

  renderProjectPortfolio(dataScope) {
    const container = document.getElementById('projects');
    if (!container) return;
    
    const existingContent = container.querySelector('.dynamic-content');
    if (existingContent) existingContent.remove();
    
    const content = document.createElement('div');
    content.className = 'dynamic-content';
    content.innerHTML = `
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">项目组合管理</h2>
            <p class="text-gray-600">跨项目对比分析、优先级矩阵与生命周期管理</p>
            <div class="mt-2 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              <i class="fas fa-user-tie mr-1"></i> 部门负责人视图
            </div>
          </div>
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
            <i class="fas fa-plus mr-2"></i>新建项目组合
          </button>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">优先级矩阵</h3>
            <div class="h-64 flex items-center justify-center">
              <div class="text-center">
                <i class="fas fa-chart-pie text-4xl text-gray-400 mb-3"></i>
                <p class="text-gray-500">项目优先级与战略价值矩阵</p>
              </div>
            </div>
            <div class="mt-4 text-sm text-gray-500">
              基于战略价值和实施难度进行项目优先级排序
            </div>
          </div>
          
          <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">生命周期分析</h3>
            <div class="h-64">
              <canvas id="projectLifecycleChart"></canvas>
            </div>
            <div class="mt-4 text-sm text-gray-500">
              项目从规划到发布的完整生命周期
            </div>
          </div>
          
          <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">跨项目依赖</h3>
            <div class="h-64 flex items-center justify-center">
              <div class="text-center">
                <i class="fas fa-project-diagram text-4xl text-gray-400 mb-3"></i>
                <p class="text-gray-500">项目间依赖关系图</p>
                <button class="mt-3 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
                  查看完整关系图
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-800">项目对比分析</h3>
            <div class="flex space-x-2">
              <select class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>按战略价值排序</option>
                <option>按进度排序</option>
                <option>按风险排序</option>
              </select>
              <button class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition">
                <i class="fas fa-download mr-2"></i>导出报告
              </button>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th class="px-4 py-3">项目名称</th>
                  <th class="px-4 py-3">负责人</th>
                  <th class="px-4 py-3">阶段</th>
                  <th class="px-4 py-3">进度</th>
                  <th class="px-4 py-3">战略价值</th>
                  <th class="px-4 py-3">风险等级</th>
                  <th class="px-4 py-3">资源占用</th>
                  <th class="px-4 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                ${this.renderPortfolioComparisonTable()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(content);
    
    // 初始化生命周期图表
    this.renderProjectLifecycleChart();
  }

  renderPortfolioComparisonTable() {
    const projects = [
      { name: '推栏小程序V2.8', manager: '张三', phase: '实施', progress: 45, value: '高', risk: '中', resources: '35%' },
      { name: 'AI中枢平台', manager: '李四', phase: '测试', progress: 78, value: '极高', risk: '低', resources: '25%' },
      { name: '数据中台建设', manager: '王五', phase: '开发', progress: 62, value: '高', risk: '高', resources: '20%' },
      { name: '用户增长计划', manager: '赵六', phase: '规划', progress: 20, value: '中', risk: '低', resources: '10%' },
      { name: '技术架构升级', manager: '钱七', phase: '设计', progress: 35, value: '极高', risk: '高', resources: '10%' }
    ];
    
    return projects.map(project => {
      const valueColor = project.value === '极高' ? 'text-red-600 bg-red-50' : 
                        project.value === '高' ? 'text-orange-600 bg-orange-50' : 
                        'text-green-600 bg-green-50';
      
      const riskColor = project.risk === '高' ? 'text-red-600 bg-red-50' : 
                       project.risk === '中' ? 'text-yellow-600 bg-yellow-50' : 
                       'text-green-600 bg-green-50';
      
      return `
        <tr class="border-b border-gray-200 hover:bg-gray-50">
          <td class="px-4 py-3 font-medium text-gray-900">${project.name}</td>
          <td class="px-4 py-3">${project.manager}</td>
          <td class="px-4 py-3">
            <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">${project.phase}</span>
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center">
              <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                <div class="h-2 rounded-full bg-green-600" style="width: ${project.progress}%"></div>
              </div>
              <span>${project.progress}%</span>
            </div>
          </td>
          <td class="px-4 py-3">
            <span class="px-2 py-1 text-xs rounded-full ${valueColor}">${project.value}</span>
          </td>
          <td class="px-4 py-3">
            <span class="px-2 py-1 text-xs rounded-full ${riskColor}">${project.risk}</span>
          </td>
          <td class="px-4 py-3">${project.resources}</td>
          <td class="px-4 py-3">
            <button class="text-blue-600 hover:text-blue-800 text-sm">
              <i class="fas fa-chart-bar mr-1"></i>详情
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  renderProjectLifecycleChart() {
    const canvas = document.getElementById('projectLifecycleChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        datasets: [{
          label: '推栏小程序',
          data: [10, 15, 25, 35, 45, 55, 65, 75, 82, 88, 92, 95],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        }, {
          label: 'AI中枢平台',
          data: [5, 10, 20, 30, 45, 60, 70, 78, 85, 90, 93, 95],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        }, {
          label: '数据中台',
          data: [0, 5, 15, 25, 40, 55, 62, 68, 72, 78, 82, 85],
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: '完成度 (%)'
            }
          }
        }
      }
    });
  }

  renderResourceCenter(dataScope) {
    const container = document.getElementById('resources');
    if (!container) return;
    
    const existingContent = container.querySelector('.dynamic-content');
    if (existingContent) existingContent.remove();
    
    const content = document.createElement('div');
    content.className = 'dynamic-content';
    content.innerHTML = `
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">资源调配中心</h2>
            <p class="text-gray-600">人员资源池、AI配额管理、预算分配与冲突检测</p>
            <div class="mt-2 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              <i class="fas fa-user-tie mr-1"></i> 部门负责人视图
            </div>
          </div>
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
            <i class="fas fa-cog mr-2"></i>资源规划
          </button>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">人员资源池</h3>
            <div class="space-y-4">
              ${this.renderResourcePool()}
            </div>
          </div>
          
          <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">AI配额管理</h3>
            <div class="h-64">
              <canvas id="aiQuotaChart"></canvas>
            </div>
            <div class="mt-4 text-sm text-gray-500">
              各项目AI模型使用配额与实际情况
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">预算分配</h3>
            <div class="space-y-3">
              ${this.renderBudgetAllocation()}
            </div>
          </div>
          
          <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">冲突检测</h3>
            <div class="space-y-3">
              ${this.renderResourceConflicts()}
            </div>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(content);
    
    // 初始化AI配额图表
    this.renderAIQuotaChart();
  }

  renderResourcePool() {
    const resources = [
      { role: '前端工程师', total: 8, available: 3, projects: ['推栏小程序', 'AI中枢'] },
      { role: '后端工程师', total: 10, available: 2, projects: ['推栏小程序', '数据中台', 'AI中枢'] },
      { role: 'AI工程师', total: 6, available: 1, projects: ['AI中枢', '技术架构'] },
      { role: '产品经理', total: 4, available: 2, projects: ['推栏小程序', '用户增长'] },
      { role: '测试工程师', total: 5, available: 3, projects: ['推栏小程序', '数据中台'] }
    ];
    
    return resources.map(resource => {
      const utilization = ((resource.total - resource.available) / resource.total * 100).toFixed(1);
      const utilizationColor = utilization > 80 ? 'text-red-600' : utilization > 60 ? 'text-yellow-600' : 'text-green-600';
      
      return `
        <div class="resource-item p-3 border border-gray-200 rounded-lg">
          <div class="flex justify-between items-center">
            <div>
              <h4 class="font-medium text-gray-800">${resource.role}</h4>
              <p class="text-sm text-gray-500">项目: ${resource.projects.join(', ')}</p>
            </div>
            <div class="text-right">
              <div class="font-medium">${resource.available}/${resource.total}</div>
              <div class="text-sm ${utilizationColor}">利用率: ${utilization}%</div>
            </div>
          </div>
          <div class="mt-2">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="h-2 rounded-full ${utilization > 80 ? 'bg-red-600' : utilization > 60 ? 'bg-yellow-600' : 'bg-green-600'}" style="width: ${utilization}%"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderAIQuotaChart() {
    const canvas = document.getElementById('aiQuotaChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Claude', 'GPT-4', 'GLM-4', 'DeepSeek'],
        datasets: [{
          label: '计划配额',
          data: [1000, 800, 500, 300],
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: '#3b82f6',
          borderWidth: 1
        }, {
          label: '实际使用',
          data: [850, 720, 420, 280],
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          borderColor: '#10b981',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Token数 (千)'
            }
          }
        }
      }
    });
  }

  renderBudgetAllocation() {
    const budgets = [
      { project: '推栏小程序', allocated: 150, used: 95, remaining: 55 },
      { project: 'AI中枢平台', allocated: 200, used: 120, remaining: 80 },
      { project: '数据中台', allocated: 100, used: 65, remaining: 35 },
      { project: '用户增长', allocated: 80, used: 25, remaining: 55 },
      { project: '技术架构', allocated: 120, used: 85, remaining: 35 }
    ];
    
    return budgets.map(budget => {
      const usedPercent = (budget.used / budget.allocated * 100).toFixed(1);
      
      return `
        <div class="budget-item p-3 border border-gray-200 rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <h4 class="font-medium text-gray-800">${budget.project}</h4>
            <div class="text-right">
              <div class="font-medium">¥${budget.used}万</div>
              <div class="text-sm text-gray-500">/ ¥${budget.allocated}万</div>
            </div>
          </div>
          <div class="flex justify-between text-sm text-gray-500 mb-1">
            <span>使用率</span>
            <span>${usedPercent}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="h-2 rounded-full ${usedPercent > 80 ? 'bg-red-600' : usedPercent > 60 ? 'bg-yellow-600' : 'bg-green-600'}" style="width: ${usedPercent}%"></div>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            剩余预算: ¥${budget.remaining}万
          </div>
        </div>
      `;
    }).join('');
  }

  renderResourceConflicts() {
    const conflicts = [
      { type: '人员冲突', projects: ['推栏小程序', '数据中台'], resource: '前端工程师', severity: '高', since: '2天前' },
      { type: 'AI配额', projects: ['AI中枢', '技术架构'], resource: 'GPT-4配额', severity: '中', since: '1天前' },
      { type: '预算超支', projects: ['数据中台'], resource: '云服务器预算', severity: '高', since: '3天前' },
      { type: '时间冲突', projects: ['推栏小程序', '用户增长'], resource: '产品评审时间', severity: '低', since: '今天' }
    ];
    
    return conflicts.map(conflict => {
      const severityColor = conflict.severity === '高' ? 'text-red-600 bg-red-50' : 
                           conflict.severity === '中' ? 'text-yellow-600 bg-yellow-50' : 
                           'text-green-600 bg-green-50';
      
      return `
        <div class="conflict-item p-3 border border-gray-200 rounded-lg">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-medium text-gray-800">${conflict.type}</h4>
              <p class="text-sm text-gray-500">项目: ${conflict.projects.join(', ')}</p>
              <p class="text-xs text-gray-500 mt-1">资源: ${conflict.resource}</p>
            </div>
            <span class="px-2 py-1 text-xs rounded-full ${severityColor}">${conflict.severity}</span>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            <i class="far fa-clock mr-1"></i>${conflict.since}
            <button class="ml-3 text-blue-600 hover:text-blue-800 text-xs">
              <i class="fas fa-wrench mr-1"></i>解决
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // ==================== 项目负责人模块 ====================

  renderProjectWorkspace(dataScope) {
    const container = document.getElementById('workspace');
    if (!container) return;
    
    const existingContent = container.querySelector('.dynamic-content');
    if (existingContent) existingContent.remove();
    
    const projectId = dataScope.project_id || 'proj-001';
    const projectName = projectId === 'proj-001' ? '推栏小程序V2.8' : `项目 ${projectId}`;
    
    const content = document.createElement('div');
    content.className = 'dynamic-content';
    content.innerHTML = `
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">${projectName} - 项目工作台</h2>
            <p class="text-gray-600">一站式项目管理界面 - 进度跟踪、健康度监控与快速操作</p>
            <div class="mt-2 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              <i class="fas fa-user-check mr-1"></i> 项目负责人视图
            </div>
          </div>
          <div class="flex space-x-2">
            <button class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition">
              <i class="fas fa-sync-alt mr-2"></i>刷新
            </button>
            <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
              <i class="fas fa-plus mr-2"></i>快速任务
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-gray-500 text-sm">项目进度</p>
                <h3 class="text-2xl font-bold mt-2">45%</h3>
              </div>
              <div class="bg-blue-100 p-3 rounded-lg">
                <i class="fas fa-chart-line text-blue-600 text-xl"></i>
              </div>
            </div>
            <div class="mt-4 text-sm text-gray-500">
              <span class="text-green-600 font-medium"><i class="fas fa-arrow-up mr-1"></i>5%</span> 本周增长
            </div>
          </div>
          
          <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-gray-500 text-sm">活跃任务</p>
                <h3 class="text-2xl font-bold mt-2">24</h3>
              </div>
              <div class="bg-green-100 p-3 rounded-lg">
                <i class="fas fa-tasks text-green-600 text-xl"></i>
              </div>
            </div>
            <div class="mt-4 text-sm text-gray-500">
              <span class="text-yellow-600 font-medium"><i class="fas fa-exclamation-circle mr-1"></i>3个阻塞</span>
            </div>
          </div>
          
          <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-gray-500 text-sm">团队成员</p>
                <h3 class="text-2xl font-bold mt-2">8</h3>
              </div>
              <div class="bg-purple-100 p-3 rounded-lg">
                <i class="fas fa-users text-purple-600 text-xl"></i>
              </div>
            </div>
            <div class="mt-4 text-sm text-gray-500">
              <span class="text-green-600 font-medium"><i class="fas fa-check-circle mr-1"></i>全勤</span> 今日
            </div>
          </div>
          
          <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-gray-500 text-sm">风险问题</p>
                <h3 class="text-2xl font-bold mt-2">2</h3>
              </div>
              <div class="bg-red-100 p-3 rounded-lg">
                <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
              </div>
            </div>
            <div class="mt-4 text-sm text-gray-500">
              <span class="text-red-600 font-medium"><i class="fas fa-arrow-up mr-1"></i>需立即处理</span>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">项目进度概览</h3>
            <div class="h-64">
              <canvas id="projectProgressChart"></canvas>
            </div>
            <div class="mt-4 text-sm text-gray-500">
              按里程碑显示项目进度与计划对比
            </div>
          </div>
          
          <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">健康度监控</h3>
            <div class="h-64">
              <canvas id="projectHealthChart"></canvas>
            </div>
            <div class="mt-4 text-sm text-gray-500">
              进度、质量、团队士气、风险综合评估
            </div>
          </div>
        </div>
        
        <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-800">快速操作</h3>
            <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
              <i class="fas fa-history mr-1"></i>查看操作历史
            </button>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button class="quick-action-btn p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-center transition">
              <div class="bg-blue-100 p-3 rounded-lg inline-block mb-2">
                <i class="fas fa-plus text-blue-600 text-xl"></i>
              </div>
              <div class="font-medium text-gray-800">新建任务</div>
              <div class="text-xs text-gray-500 mt-1">AI辅助分解</div>
            </button>
            
            <button class="quick-action-btn p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-center transition">
              <div class="bg-green-100 p-3 rounded-lg inline-block mb-2">
                <i class="fas fa-robot text-green-600 text-xl"></i>
              </div>
              <div class="font-medium text-gray-800">AI协助</div>
              <div class="text-xs text-gray-500 mt-1">解决技术问题</div>
            </button>
            
            <button class="quick-action-btn p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-center transition">
              <div class="bg-purple-100 p-3 rounded-lg inline-block mb-2">
                <i class="fas fa-users text-purple-600 text-xl"></i>
              </div>
              <div class="font-medium text-gray-800">团队会议</div>
              <div class="text-xs text-gray-500 mt-1">安排站会/评审</div>
            </button>
            
            <button class="quick-action-btn p-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg text-center transition">
              <div class="bg-orange-100 p-3 rounded-lg inline-block mb-2">
                <i class="fas fa-chart-bar text-orange-600 text-xl"></i>
              </div>
              <div class="font-medium text-gray-800">生成报告</div>
              <div class="text-xs text-gray-500 mt-1">进度/风险报告</div>
            </button>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(content);
    
    // 初始化项目图表
    this.renderProjectWorkspaceCharts();
  }

  renderProjectWorkspaceCharts() {
    // 项目进度图表
    const progressCanvas = document.getElementById('projectProgressChart');
    if (progressCanvas) {
      const ctx = progressCanvas.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['需求分析', 'UI设计', 'API开发', '测试', '部署'],
          datasets: [{
            label: '计划',
            data: [5, 3, 7, 4, 2],
            backgroundColor: '#93c5fd',
            borderColor: '#3b82f6',
            borderWidth: 1
          }, {
            label: '实际',
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
    
    // 项目健康度图表
    const healthCanvas = document.getElementById('projectHealthChart');
    if (healthCanvas) {
      const ctx = healthCanvas.getContext('2d');
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['进度', '质量', '团队士气', '风险控制', '客户满意度', '创新度'],
          datasets: [{
            label: '当前健康度',
            data: [45, 70, 65, 40, 75, 60],
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: '#10b981',
            borderWidth: 2
          }, {
            label: '目标',
            data: [65, 80, 75, 60, 85, 70],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3b82f6',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    }
  }

  renderTaskManagement(dataScope) {
    const container = document.getElementById('tasks');
    if (!container) return;
    
    const existingContent = container.querySelector('.dynamic-content');
    if (existingContent) existingContent.remove();
    
    const content = document.createElement('div');
    content.className = 'dynamic-content';
    content.innerHTML = `
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">任务管理</h2>
            <p class="text-gray-600">需求拆解器、任务看板、依赖关系图与自动分配</p>
            <div class="mt-2 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              <i class="fas fa-user-check mr-1"></i> 项目负责人视图
            </div>
          </div>
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
            <i class="fas fa-plus mr-2"></i>AI需求拆解
          </button>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">需求拆解器</h3>
            <div class="mb-4">
              <textarea class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="4" placeholder="输入需求描述...&#10;例如：实现聊天消息撤回功能，支持2分钟内撤回"></textarea>
            </div>
            <button class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition">
              <i class="fas fa-magic mr-2"></i>AI拆解需求
            </button>
            <div class="mt-4 text-sm text-gray-500">
              AI将自动分解为技术任务、预估工作量、识别依赖
            </div>
          </div>
          
          <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">任务看板</h3>
            <div class="space-y-3">
              ${this.renderTaskKanban()}
            </div>
          </div>
          
          <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">依赖关系图</h3>
            <div class="h-64 flex items-center justify-center">
              <div class="text-center">
                <i class="fas fa-project-diagram text-4xl text-gray-400 mb-3"></i>
                <p class="text-gray-500">任务依赖可视化图</p>
                <button class="mt-3 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
                  查看完整关系图
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-800">任务列表</h3>
            <div class="flex space-x-2">
              <select class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>按优先级排序</option>
                <option>按截止日期</option>
                <option>按负责人</option>
              </select>
              <button class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition">
                <i class="fas fa-filter mr-2"></i>筛选
              </button>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th class="px-4 py-3">任务名称</th>
                  <th class="px-4 py-3">负责人</th>
                  <th class="px-4 py-3">状态</th>
                  <th class="px-4 py-3">优先级</th>
                  <th class="px-4 py-3">截止日期</th>
                  <th class="px-4 py-3">工作量</th>
                  <th class="px-4 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                ${this.renderTaskListTable()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(content);
  }

  renderTaskKanban() {
    const columns = [
      { title: '待处理', tasks: ['需求分析', 'API设计'], count: 2, color: 'gray' },
      { title: '进行中', tasks: ['UI开发', '后端实现'], count: 2, color: 'blue' },
      { title: '待审核', tasks: ['单元测试'], count: 1, color: 'yellow' },
      { title: '已完成', tasks: ['需求评审', '技术方案'], count: 2, color: 'green' }
    ];
    
    return columns.map(col => `
      <div class="kanban-column">
        <div class="flex justify-between items-center mb-3">
          <h4 class="font-medium text-gray-800">${col.title}</h4>
          <span class="px-2 py-1 text-xs rounded-full bg-${col.color}-100 text-${col.color}-800">${col.count}</span>
        </div>
        <div class="space-y-2">
          ${col.tasks.map(task => `
            <div class="kanban-task p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:shadow-sm">
              <div class="font-medium text-gray-800">${task}</div>
              <div class="mt-1 text-xs text-gray-500">
                <span class="mr-2"><i class="far fa-clock mr-1"></i>3d</span>
                <span><i class="fas fa-user mr-1"></i>张三</span>
              </div>
            </div>
          `).join('')}
        </div>
        <button class="w-full mt-2 p-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 text-sm">
          <i class="fas fa-plus mr-1"></i>添加任务
        </button>
      </div>
    `).join('');
  }

  renderTaskListTable() {
    const tasks = [
      { name: '消息撤回UI组件', assignee: '张三', status: '进行中', priority: '高', due: '2026-04-25', effort: '3人天' },
      { name: '撤回API接口', assignee: '李四', status: '待处理', priority: '高', due: '2026-04-26', effort: '2人天' },
      { name: '数据库设计', assignee: '王五', status: '已完成', priority: '中', due: '2026-04-22', effort: '1.5人天' },
      { name: '单元测试编写', assignee: '赵六', status: '待审核', priority: '中', due: '2026-04-28', effort: '2人天' },
      { name: '集成测试', assignee: '钱七', status: '待处理', priority: '低', due: '2026-05-02', effort: '3人天' }
    ];
    
    return tasks.map(task => {
      const statusColor = task.status === '进行中' ? 'bg-blue-100 text-blue-800' :
                        task.status === '已完成' ? 'bg-green-100 text-green-800' :
                        task.status === '待审核' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800';
      
      const priorityColor = task.priority === '高' ? 'text-red-600' :
                           task.priority === '中' ? 'text-yellow-600' :
                           'text-green-600';
      
      return `
        <tr class="border-b border-gray-200 hover:bg-gray-50">
          <td class="px-4 py-3 font-medium text-gray-900">${task.name}</td>
          <td class="px-4 py-3">${task.assignee}</td>
          <td class="px-4 py-3">
            <span class="px-2 py-1 text-xs rounded-full ${statusColor}">${task.status}</span>
          </td>
          <td class="px-4 py-3">
            <span class="font-medium ${priorityColor}">${task.priority}</span>
          </td>
          <td class="px-4 py-3">${task.due}</td>
          <td class="px-4 py-3">${task.effort}</td>
          <td class="px-4 py-3">
            <div class="flex space-x-2">
              <button class="text-blue-600 hover:text-blue-800 text-sm">
                <i class="fas fa-edit mr-1"></i>编辑
              </button>
              <button class="text-green-600 hover:text-green-800 text-sm">
                <i class="fas fa-play mr-1"></i>开始
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ==================== 共享模块的角色化渲染 ====================

  renderKnowledgeHub(options) {
    const container = document.getElementById('knowledge');
    if (!container) return;
    
    const existingContent = container.querySelector('.dynamic-content');
    if (existingContent) existingContent.remove();
    
    const isStrategic = options.filter === 'strategic';
    const title = isStrategic ? '知识库中枢 - 战略知识' : '知识库中枢 - 项目知识';
    const description = isStrategic 
      ? '战略知识、行业趋势、技术雷达与最佳实践' 
      : '项目相关知识、技术方案、实现细节与经验总结';
    
    const content = document.createElement('div');
    content.className = 'dynamic-content';
    content.innerHTML = `
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">${title}</h2>
            <p class="text-gray-600">${description}</p>
            ${isStrategic ? 
              '<div class="mt-2 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"><i class="fas fa-user-tie mr-1"></i> 部门负责人视图</div>' :
              '<div class="mt-2 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"><i class="fas fa-user-check mr-1"></i> 项目负责人视图</div>'
            }
          </div>
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
            <i class="fas fa-sync-alt mr-2"></i>${isStrategic ? '同步战略知识' : '同步项目知识'}
          </button>
        </div>
        
        ${isStrategic ? this.renderStrategicKnowledge() : this.renderProjectKnowledge()}
      </div>
    `;
    
    container.appendChild(content);
  }

  renderStrategicKnowledge() {
    return `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">行业趋势</h3>
          <div class="space-y-3">
            <div class="trend-item p-3 border border-gray-200 rounded-lg">
              <h4 class="font-medium text-gray-800">AI Agent 架构演进</h4>
              <p class="text-sm text-gray-500 mt-1">从单代理到多代理协作系统的技术趋势分析</p>
              <div class="mt-2 text-xs text-gray-500">
                <span class="mr-3"><i class="far fa-calendar mr-1"></i>2026-04-18</span>
                <span><i class="fas fa-tag mr-1"></i>技术趋势</span>
              </div>
            </div>
            <div class="trend-item p-3 border border-gray-200 rounded-lg">
              <h4 class="font-medium text-gray-800">小程序生态分析</h4>
              <p class="text-sm text-gray-500 mt-1">微信、支付宝、字节跳动小程序平台对比</p>
              <div class="mt-2 text-xs text-gray-500">
                <span class="mr-3"><i class="far fa-calendar mr-1"></i>2026-04-15</span>
                <span><i class="fas fa-tag mr-1"></i>市场分析</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">技术雷达</h3>
          <div class="h-64">
            <canvas id="techRadarChart"></canvas>
          </div>
          <div class="mt-4 text-sm text-gray-500">
            评估、试验、采纳、淘汰的技术栈分析
          </div>
        </div>
        
        <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">竞品分析</h3>
          <div class="space-y-3">
            <div class="competitor-item p-3 border border-gray-200 rounded-lg">
              <h4 class="font-medium text-gray-800">某某游戏社区</h4>
              <p class="text-sm text-gray-500 mt-1">功能对比: 聊天互通、社区活跃度、AI集成</p>
              <div class="mt-2">
                <span class="inline-block px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 mr-2">劣势</span>
                <span class="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">优势</span>
              </div>
            </div>
            <div class="competitor-item p-3 border border-gray-200 rounded-lg">
              <h4 class="font-medium text-gray-800">某某AI工具</h4>
              <p class="text-sm text-gray-500 mt-1">技术架构对比: Agent系统、知识库集成</p>
              <div class="mt-2">
                <span class="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 mr-2">领先</span>
                <span class="inline-block px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">跟进</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderProjectKnowledge() {
    return `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100 lg:col-span-2">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">项目知识页面</h3>
          <div class="space-y-3">
            ${this.renderProjectKnowledgePages()}
          </div>
        </div>
        
        <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">技术方案库</h3>
          <div class="space-y-3">
            <div class="solution-item p-3 border border-gray-200 rounded-lg">
              <h4 class="font-medium text-gray-800">消息撤回实现</h4>
              <p class="text-sm text-gray-500 mt-1">前端组件 + 后端API + 数据库设计完整方案</p>
              <div class="mt-2 text-xs text-gray-500">
                <span class="mr-3"><i class="fas fa-code mr-1"></i>参考V2.5</span>
                <span><i class="fas fa-user mr-1"></i>张三</span>
              </div>
            </div>
            <div class="solution-item p-3 border border-gray-200 rounded-lg">
              <h4 class="font-medium text-gray-800">Taro兼容性处理</h4>
              <p class="text-sm text-gray-500 mt-1">常见兼容性问题及解决方案汇总</p>
              <div class="mt-2 text-xs text-gray-500">
                <span class="mr-3"><i class="fas fa-bug mr-1"></i>已验证</span>
                <span><i class="fas fa-user mr-1"></i>李四</span>
              </div>
            </div>
            <div class="solution-item p-3 border border-gray-200 rounded-lg">
              <h4 class="font-medium text-gray-800">API性能优化</h4>
              <p class="text-sm text-gray-500 mt-1">数据库索引、缓存策略、异步处理</p>
              <div class="mt-2 text-xs text-gray-500">
                <span class="mr-3"><i class="fas fa-rocket mr-1"></i>效果+65%</span>
                <span><i class="fas fa-user mr-1"></i>王五</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderProjectKnowledgePages() {
    const pages = [
      { title: '聊天消息撤回功能', type: '技术方案', description: 'V2.8版本的核心功能实现方案', tags: ['chat', 'V2.8', 'frontend', 'backend'], updated: '今天' },
      { title: '复合页面配置优化', type: '最佳实践', description: '基于V2.6经验的配置优化指南', tags: ['ui', 'configuration', 'V2.6'], updated: '昨天' },
      { title: 'Taro小程序调试技巧', type: '经验总结', description: '开发过程中积累的调试方法和工具', tags: ['taro', 'debug', 'frontend'], updated: '2天前' },
      { title: 'API接口设计规范', type: '规范文档', description: '项目统一的API设计标准和约定', tags: ['api', 'backend', 'standard'], updated: '3天前' }
    ];
    
    return pages.map(page => `
      <div class="knowledge-page-item p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h4 class="font-medium text-gray-800">${page.title}</h4>
            <p class="text-sm text-gray-500 mt-1">${page.description}</p>
          </div>
          <span class="ml-2 px-2 py-1 text-xs rounded-full ${page.type === '技术方案' ? 'bg-blue-100 text-blue-800' : page.type === '最佳实践' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
            ${page.type}
          </span>
        </div>
        <div class="flex items-center mt-2 text-xs text-gray-500">
          <span class="mr-3"><i class="fas fa-tags mr-1"></i>${page.tags.map(tag => `#${tag}`).join(' ')}</span>
          <span><i class="far fa-clock mr-1"></i>${page.updated}更新</span>
        </div>
      </div>
    `).join('');
  }

  // ==================== 其他现有方法 ====================

  initTopBar() {
    const userInfo = document.getElementById('user-info');
    if (userInfo && this.auth.isAuthenticated()) {
      const user = this.auth.getUser();
      const roleName = this.auth.getRoleDisplayName();
      
      userInfo.innerHTML = `
        <div class="flex items-center space-x-3">
          <div class="h-10 w-10 rounded-full ${this.auth.isDepartmentLeader() ? 'bg-blue-100' : 'bg-green-100'} flex items-center justify-center">
            <span class="${this.auth.isDepartmentLeader() ? 'text-blue-600' : 'text-green-600'} font-bold">${user?.avatar || 'U'}</span>
          </div>
          <div>
            <div class="font-medium text-gray-700">${user?.name || '用户'}</div>
            <div class="text-xs ${this.auth.isDepartmentLeader() ? 'text-blue-600' : 'text-green-600'} font-medium">${roleName}</div>
          </div>
          <button id="logout-btn" class="text-gray-500 hover:text-gray-700 ml-2">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
      `;
      
      // 绑定登出按钮
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.onclick = () => {
          if (confirm('确定要退出登录吗？')) {
            this.auth.logout();
            this.showLoginPage();
          }
        };
      }
    }
  }

  initRoleModules() {
    return {
      department_leader: ['dashboard', 'projects', 'resources', 'strategy', 'collaboration'],
      project_leader: ['workspace', 'tasks', 'team', 'execution', 'issues']
    };
  }

  // 以下保留原有方法，但会进行角色化适配
  initCharts() {
    // 根据角色初始化不同的图表
    if (this.auth.isDepartmentLeader()) {
      this.renderDepartmentCharts();
    } else {
      // 项目负责人的图表初始化
      this.renderProjectProgressChart();
      this.renderAIModelChart();
    }
  }

  renderDefaultDashboard() {
    // 默认仪表盘内容（兼容旧版）
    return `
      <!-- 关键指标 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">活跃项目</p>
              <h3 class="text-2xl font-bold mt-2">3</h3>
            </div>
            <div class="bg-blue-100 p-3 rounded-lg">
              <i class="fas fa-project-diagram text-blue-600 text-xl"></i>
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-500">
            <span class="text-green-600 font-medium"><i class="fas fa-arrow-up mr-1"></i>12%</span> 环比增长
          </div>
        </div>
        
        <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">AI任务执行</p>
              <h3 class="text-2xl font-bold mt-2">156</h3>
            </div>
            <div class="bg-green-100 p-3 rounded-lg">
              <i class="fas fa-robot text-green-600 text-xl"></i>
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-500">
            <span class="text-green-600 font-medium"><i class="fas fa-arrow-up mr-1"></i>24%</span> 本周新增
          </div>
        </div>
        
        <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">Skills调用</p>
              <h3 class="text-2xl font-bold mt-2">42</h3>
            </div>
            <div class="bg-purple-100 p-3 rounded-lg">
              <i class="fas fa-tools text-purple-600 text-xl"></i>
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-500">
            <span class="text-green-600 font-medium"><i class="fas fa-arrow-up mr-1"></i>8%</span> 今日新增
          </div>
        </div>
        
        <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">记忆存储</p>
              <h3 class="text-2xl font-bold mt-2">1.2GB</h3>
            </div>
            <div class="bg-orange-100 p-3 rounded-lg">
              <i class="fas fa-database text-orange-600 text-xl"></i>
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-500">
            <span class="text-green-600 font-medium"><i class="fas fa-arrow-up mr-1"></i>5%</span> 本周增长
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">项目进度</h3>
          <div class="h-64">
            <canvas id="projectProgressChart"></canvas>
          </div>
          <div class="mt-4 text-sm text-gray-500">
            V2.5-3.0版本进度追踪
          </div>
        </div>
        
        <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">AI模型使用</h3>
          <div class="h-64">
            <canvas id="aiModelChart"></canvas>
          </div>
          <div class="mt-4 text-sm text-gray-500">
            各模型使用频率分布
          </div>
        </div>
      </div>
    `;
  }

  // 保留原有的图表渲染方法
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

  // 其他现有方法...
  renderProjects() {
    // 原有项目管理渲染（现在由角色化方法处理）
    this.renderProjectPortfolio({ scope: 'default' });
  }

  renderKnowledge() {
    this.renderKnowledgeHub({ filter: 'default' });
  }

  renderAI() {
    // AI调度中心的角色化渲染
    const dataScope = this.auth.getDataScope();
    if (this.auth.isDepartmentLeader()) {
      this.renderAIScheduling({ ...dataScope, level: 'department' });
    } else if (this.auth.isProjectLeader()) {
      this.renderAIScheduling({ ...dataScope, level: 'project' });
    } else {
      // 默认渲染
      this.renderAIDefault();
    }
  }

  renderAIDefault() {
    // 原有的AI渲染逻辑
    const container = document.getElementById('ai');
    if (!container) return;
    
    const existingContent = container.querySelector('.dynamic-content');
    if (existingContent) existingContent.remove();
    
    // ... 原有渲染逻辑
  }

  renderWorkflow() {
    const dataScope = this.auth.getDataScope();
    if (this.auth.isDepartmentLeader()) {
      this.renderWorkflowOrchestration({ ...dataScope, type: 'strategic' });
    } else if (this.auth.isProjectLeader()) {
      this.renderWorkflowOrchestration({ ...dataScope, type: 'execution' });
    } else {
      this.renderWorkflowDefault();
    }
  }

  renderWorkflowDefault() {
    // 原有工作流渲染
    const container = document.getElementById('workflow');
    if (!container) return;
    
    const existingContent = container.querySelector('.dynamic-content');
    if (existingContent) existingContent.remove();
    
    // ... 原有渲染逻辑
  }

  // 简化版的其他模块渲染
  renderSkills(options = {}) {
    const container = document.getElementById('skills');
    if (!container) return;
    
    const existingContent = container.querySelector('.dynamic-content');
    if (existingContent) existingContent.remove();
    
    const view = options.view || 'default';
    const title = view === 'all' ? 'Skill仓库 - 全部门视图' : 
                 view === 'project' ? 'Skill仓库 - 项目视图' : 'Skill仓库';
    
    const content = document.createElement('div');
    content.className = 'dynamic-content';
    content.innerHTML = `
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800">${title}</h3>
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
            <i class="fas fa-plus mr-2"></i>导入Skill
          </button>
        </div>
        
        <div class="card-hover bg-white p-8 rounded-xl shadow border border-gray-100">
          <div class="text-center">
            <i class="fas fa-tools text-4xl text-gray-400 mb-4"></i>
            <h4 class="text-xl font-semibold text-gray-700 mb-2">Skill仓库</h4>
            <p class="text-gray-500 mb-6">Hermes Agent技能管理、分类、编排与执行监控</p>
            <p class="text-gray-400 text-sm">
              ${view === 'all' ? '此视图显示部门所有Skills，包含战略级和项目级技能。' : 
                view === 'project' ? '此视图显示与当前项目相关的Skills，用于任务执行。' :
                '此模块的完整功能需要后端API支持。当前为演示界面。'}
            </p>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(content);
  }

  renderMemory(options = {}) {
    // 类似简化处理
    this.renderModuleTemplate('memory', '记忆系统', '历史经验存储、语义检索、关联分析与智能推荐');
  }

  renderContext(options = {}) {
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

  // 保留原有的模拟数据和交互方法
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

  initModuleContents() {
    // 初始渲染当前模块
    if (this.auth.isAuthenticated()) {
      this.loadModuleContent(this.currentModule);
    }
  }

  initInteractions() {
    // 初始化交互事件
    // 原有交互逻辑...
  }

  initSimulatedUpdates() {
    // 模拟实时更新
    setInterval(() => {
      this.updateSimulatedData();
    }, 30000);
  }

  updateSimulatedData() {
    // 模拟数据更新
    console.log('模拟数据更新...');
  }

  renderDefaultModule(moduleId, dataScope) {
    // 默认模块渲染
    console.log(`渲染默认模块: ${moduleId}`, dataScope);
  }

  // 战略规划器、跨项目协作等模块的渲染（简化版）
  renderStrategyPlanner(dataScope) {
    this.renderPlaceholderModule('strategy', '战略规划器', '目标分解、路线图规划、能力建设与竞品分析');
  }

  renderCrossProjectCollaboration(dataScope) {
    this.renderPlaceholderModule('collaboration', '跨项目协作', '知识共享平台、最佳实践库、专家网络与协调会议');
  }

  renderTeamCollaboration(dataScope) {
    this.renderPlaceholderModule('team', '团队协作空间', '团队仪表盘、沟通中心、技能矩阵与反馈评估');
  }

  renderExecutionEngine(dataScope) {
    this.renderPlaceholderModule('execution', '执行引擎', 'AI助手集成、工作流编排器、自动化脚本库与执行监控');
  }

  renderIssueResolution(dataScope) {
    this.renderPlaceholderModule('issues', '问题解决中心', '问题登记、根因分析、解决方案库与升级机制');
  }

  renderPlaceholderModule(moduleId, title, description) {
    const container = document.getElementById(moduleId);
    if (!container) return;
    
    const existingContent = container.querySelector('.dynamic-content');
    if (existingContent) existingContent.remove();
    
    const roleBadge = this.auth.isDepartmentLeader() ? 
      '<div class="mt-2 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"><i class="fas fa-user-tie mr-1"></i> 部门负责人视图</div>' :
      '<div class="mt-2 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"><i class="fas fa-user-check mr-1"></i> 项目负责人视图</div>';
    
    const content = document.createElement('div');
    content.className = 'dynamic-content';
    content.innerHTML = `
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">${title}</h2>
            <p class="text-gray-600">${description}</p>
            ${roleBadge}
          </div>
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
              此模块正在开发中，将根据您的角色提供专属功能。
              部门负责人和项目负责人将看到不同的界面和工具。
            </p>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(content);
  }

  // AI调度中心的角色化渲染
  renderAIScheduling(options) {
    const container = document.getElementById('ai');
    if (!container) return;
    
    const existingContent = container.querySelector('.dynamic-content');
    if (existingContent) existingContent.remove();
    
    const isDepartment = options.level === 'department';
    const title = isDepartment ? 'AI调度中心 - 部门视图' : 'AI调度中心 - 项目视图';
    const description = isDepartment ? 
      'AI资源整体使用、成本控制、模型性能与配额管理' : 
      '项目内AI使用、任务分配、执行结果与智能辅助';
    
    const roleBadge = isDepartment ? 
      '<div class="mt-2 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"><i class="fas fa-user-tie mr-1"></i> 部门负责人视图</div>' :
      '<div class="mt-2 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"><i class="fas fa-user-check mr-1"></i> 项目负责人视图</div>';
    
    const content = document.createElement('div');
    content.className = 'dynamic-content';
    content.innerHTML = `
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">${title}</h2>
            <p class="text-gray-600">${description}</p>
            ${roleBadge}
          </div>
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
            <i class="fas fa-cog mr-2"></i>${isDepartment ? '部门配置' : '项目配置'}
          </button>
        </div>
        
        <div class="card-hover bg-white p-8 rounded-xl shadow border border-gray-100">
          <div class="text-center">
            <i class="fas fa-robot text-4xl text-gray-400 mb-4"></i>
            <h4 class="text-xl font-semibold text-gray-700 mb-2">${title}</h4>
            <p class="text-gray-500 mb-6">${description}</p>
            <p class="text-gray-400 text-sm">
              ${isDepartment ? 
                '部门负责人可以查看所有项目的AI使用情况、配额分配、成本分析和模型性能监控。' :
                '项目负责人可以查看本项目的AI任务执行、分配AI资源、监控执行结果和获取智能建议。'
              }
            </p>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(content);
  }

  // 工作流编排的角色化渲染
  renderWorkflowOrchestration(options) {
    const container = document.getElementById('workflow');
    if (!container) return;
    
    const existingContent = container.querySelector('.dynamic-content');
    if (existingContent) existingContent.remove();
    
    const isStrategic = options.type === 'strategic';
    const title = isStrategic ? '工作流编排 - 战略视图' : '工作流编排 - 执行视图';
    const description = isStrategic ? 
      '战略级工作流、跨项目流程、自动化治理与合规检查' : 
      '项目级工作流、具体任务流程、执行监控与自动化脚本';
    
    const roleBadge = isStrategic ? 
      '<div class="mt-2 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"><i class="fas fa-user-tie mr-1"></i> 部门负责人视图</div>' :
      '<div class="mt-2 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"><i class="fas fa-user-check mr-1"></i> 项目负责人视图</div>';
    
    const content = document.createElement('div');
    content.className = 'dynamic-content';
    content.innerHTML = `
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">${title}</h2>
            <p class="text-gray-600">${description}</p>
            ${roleBadge}
          </div>
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
            <i class="fas fa-plus mr-2"></i>${isStrategic ? '战略工作流' : '项目工作流'}
          </button>
        </div>
        
        <div class="card-hover bg-white p-8 rounded-xl shadow border border-gray-100">
          <div class="text-center">
            <i class="fas fa-stream text-4xl text-gray-400 mb-4"></i>
            <h4 class="text-xl font-semibold text-gray-700 mb-2">${title}</h4>
            <p class="text-gray-500 mb-6">${description}</p>
            <p class="text-gray-400 text-sm">
              ${isStrategic ? 
                '战略级工作流用于跨项目协调、资源调配、合规检查和战略目标跟踪。' :
                '项目级工作流用于具体任务执行、自动化测试、部署流程和团队协作。'
              }
            </p>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(content);
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  console.log('CenterSystem App 加载中...');
  
  // 先加载认证管理器
  if (typeof window.authManager === 'undefined') {
    console.error('认证管理器未加载，请确保auth.js已正确加载');
    return;
  }
  
  // 初始化主应用
  window.app = new CenterSystemApp();
});