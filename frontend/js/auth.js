// 推栏AI中枢管理后台 - 角色认证与权限管理
class AuthManager {
  constructor() {
    this.currentUser = null;
    this.currentRole = null; // 'department_leader' | 'project_leader'
    this.currentProjectId = null; // 项目负责人专属
    this.init();
  }

  init() {
    // 尝试从localStorage恢复登录状态
    this.restoreFromStorage();
  }

  restoreFromStorage() {
    try {
      const authData = localStorage.getItem('center-system-auth');
      if (authData) {
        const { user, role, project_id, timestamp } = JSON.parse(authData);
        
        // 检查是否过期（24小时）
        const now = Date.now();
        if (now - timestamp < 24 * 60 * 60 * 1000) {
          this.currentUser = user;
          this.currentRole = role;
          this.currentProjectId = project_id;
          return true;
        } else {
          this.clearAuth();
        }
      }
    } catch (error) {
      console.warn('Failed to restore auth from storage:', error);
      this.clearAuth();
    }
    return false;
  }

  saveToStorage() {
    const authData = {
      user: this.currentUser,
      role: this.currentRole,
      project_id: this.currentProjectId,
      timestamp: Date.now()
    };
    localStorage.setItem('center-system-auth', JSON.stringify(authData));
  }

  clearAuth() {
    this.currentUser = null;
    this.currentRole = null;
    this.currentProjectId = null;
    localStorage.removeItem('center-system-auth');
  }

  // 模拟登录 - 实际项目中应调用后端API
  async login(role, projectId = null) {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟用户数据
    const users = {
      department_leader: {
        id: 'dept-001',
        name: '部门负责人',
        email: 'dept-leader@tuilan.com',
        avatar: 'DL'
      },
      project_leader: {
        id: 'proj-001',
        name: '项目负责人',
        email: 'project-leader@tuilan.com',
        avatar: 'PL'
      }
    };
    
    this.currentUser = users[role] || users.department_leader;
    this.currentRole = role;
    this.currentProjectId = projectId;
    
    this.saveToStorage();
    
    return {
      success: true,
      user: this.currentUser,
      role: this.currentRole,
      project_id: this.currentProjectId
    };
  }

  logout() {
    this.clearAuth();
    return { success: true };
  }

  getRole() {
    return this.currentRole;
  }

  getUser() {
    return this.currentUser;
  }

  getProjectId() {
    return this.currentProjectId;
  }

  isAuthenticated() {
    return this.currentUser !== null && this.currentRole !== null;
  }

  isDepartmentLeader() {
    return this.currentRole === 'department_leader';
  }

  isProjectLeader() {
    return this.currentRole === 'project_leader';
  }

  // 权限检查
  hasPermission(module, action) {
    const permissions = {
      department_leader: {
        dashboard: ['view'],
        projects: ['view_all', 'create', 'assign'],
        resources: ['allocate', 'monitor', 'adjust'],
        strategy: ['create', 'update', 'delete'],
        collaboration: ['manage'],
        // 共享模块
        knowledge: ['view_strategic'],
        ai: ['view_department'],
        workflow: ['view_strategic'],
        skills: ['view_all'],
        memory: ['view_all'],
        context: ['view_all']
      },
      project_leader: {
        workspace: ['view', 'manage'],
        tasks: ['create', 'view_own', 'update', 'assign', 'complete'],
        team: ['manage', 'review', 'feedback'],
        execution: ['execute', 'monitor', 'stop'],
        issues: ['create', 'view', 'resolve', 'escalate'],
        // 共享模块
        knowledge: ['view_project'],
        ai: ['view_project', 'execute'],
        workflow: ['view_execution', 'execute'],
        skills: ['view_project', 'execute'],
        memory: ['view_project', 'add'],
        context: ['view_project', 'create']
      }
    };
    
    return permissions[this.currentRole]?.[module]?.includes(action) || false;
  }

  getDataScope() {
    if (this.currentRole === 'department_leader') {
      return { scope: 'department', project_id: null };
    } else if (this.currentRole === 'project_leader') {
      return { scope: 'project', project_id: this.currentProjectId };
    }
    return { scope: 'guest', project_id: null };
  }

  // 获取角色友好的显示名称
  getRoleDisplayName() {
    const names = {
      department_leader: '部门负责人',
      project_leader: '项目负责人'
    };
    return names[this.currentRole] || '未知角色';
  }

  // 获取导航配置
  getNavigationConfig() {
    const baseNav = {
      department_leader: [
        { id: 'dashboard', name: '全局仪表盘', icon: 'tachometer-alt', type: 'primary' },
        { id: 'projects', name: '项目组合管理', icon: 'project-diagram', type: 'primary' },
        { id: 'resources', name: '资源调配中心', icon: 'cogs', type: 'primary' },
        { id: 'strategy', name: '战略规划器', icon: 'chess-board', type: 'primary' },
        { id: 'collaboration', name: '跨项目协作', icon: 'users', type: 'primary' },
        { id: 'divider-1', type: 'divider', label: '共享模块' },
        { id: 'knowledge', name: '知识库中枢', icon: 'book', type: 'shared' },
        { id: 'ai', name: 'AI调度中心', icon: 'robot', type: 'shared' },
        { id: 'workflow', name: '工作流编排', icon: 'stream', type: 'shared' },
        { id: 'skills', name: 'Skill仓库', icon: 'tools', type: 'shared' },
        { id: 'memory', name: '记忆系统', icon: 'history', type: 'shared' },
        { id: 'context', name: '上下文管理', icon: 'layer-group', type: 'shared' }
      ],
      project_leader: [
        { id: 'workspace', name: '项目工作台', icon: 'desktop', type: 'primary' },
        { id: 'tasks', name: '任务管理', icon: 'tasks', type: 'primary' },
        { id: 'team', name: '团队协作', icon: 'users', type: 'primary' },
        { id: 'execution', name: '执行引擎', icon: 'play-circle', type: 'primary' },
        { id: 'issues', name: '问题解决', icon: 'exclamation-triangle', type: 'primary' },
        { id: 'divider-1', type: 'divider', label: '共享模块' },
        { id: 'knowledge', name: '知识库中枢', icon: 'book', type: 'shared' },
        { id: 'ai', name: 'AI调度中心', icon: 'robot', type: 'shared' },
        { id: 'workflow', name: '工作流编排', icon: 'stream', type: 'shared' },
        { id: 'skills', name: 'Skill仓库', icon: 'tools', type: 'shared' },
        { id: 'memory', name: '记忆系统', icon: 'history', type: 'shared' },
        { id: 'context', name: '上下文管理', icon: 'layer-group', type: 'shared' }
      ]
    };
    
    return baseNav[this.currentRole] || [];
  }
}

// 创建全局认证管理器实例
window.authManager = new AuthManager();