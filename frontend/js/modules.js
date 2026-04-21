// 模块特定的功能
class ModuleExtensions {
    // 工作流编排模块
    static renderWorkflowContent() {
        return `
            <div class="mb-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-semibold text-gray-800">可视化工作流设计器</h3>
                    <div class="flex space-x-2">
                        <button id="saveWorkflowBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
                            <i class="fas fa-save mr-2"></i>保存工作流
                        </button>
                        <button id="runWorkflowBtn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
                            <i class="fas fa-play mr-2"></i>运行工作流
                        </button>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100 lg:col-span-2">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">工作流画布</h4>
                        <div id="workflowCanvas" class="h-96 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                            <div class="text-center">
                                <i class="fas fa-project-diagram text-4xl text-gray-400 mb-3"></i>
                                <p class="text-gray-500">拖拽节点到此区域构建工作流</p>
                                <button id="addNodeBtn" class="mt-3 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
                                    <i class="fas fa-plus mr-1"></i>添加节点
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">节点库</h4>
                        <div class="space-y-3">
                            ${this.renderWorkflowNodes()}
                        </div>
                        <div class="mt-4 text-sm text-gray-500">
                            拖拽节点到画布上构建工作流
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">工作流列表</h4>
                        <div class="space-y-3">
                            ${this.renderWorkflowList()}
                        </div>
                    </div>
                    
                    <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">执行历史</h4>
                        <div class="space-y-3">
                            ${this.renderWorkflowHistory()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    static renderWorkflowNodes() {
        const nodes = [
            { id: 'start', name: '开始', icon: 'play', color: 'green' },
            { id: 'ai-task', name: 'AI任务', icon: 'robot', color: 'blue' },
            { id: 'skill-call', name: 'Skill调用', icon: 'tools', color: 'purple' },
            { id: 'condition', name: '条件分支', icon: 'code-branch', color: 'yellow' },
            { id: 'api-call', name: 'API调用', icon: 'server', color: 'indigo' },
            { id: 'data-process', name: '数据处理', icon: 'database', color: 'pink' },
            { id: 'end', name: '结束', icon: 'flag-checkered', color: 'red' }
        ];
        
        return nodes.map(node => `
            <div class="workflow-node draggable p-3 border border-gray-200 rounded-lg bg-white cursor-move hover:bg-gray-50" data-node-id="${node.id}">
                <div class="flex items-center">
                    <div class="bg-${node.color}-100 p-2 rounded-lg mr-3">
                        <i class="fas fa-${node.icon} text-${node.color}-600"></i>
                    </div>
                    <div>
                        <h5 class="font-medium text-gray-800">${node.name}</h5>
                        <p class="text-xs text-gray-500">拖拽到画布</p>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    static renderWorkflowList() {
        const workflows = [
            { id: 'wf-001', name: '需求分析工作流', description: '自动分析需求并生成实施计划', status: 'active', runs: 42 },
            { id: 'wf-002', name: '代码审查工作流', description: '自动化代码审查与质量检查', status: 'active', runs: 28 },
            { id: 'wf-003', name: '部署发布工作流', description: '自动构建、测试与部署', status: 'paused', runs: 15 },
            { id: 'wf-004', name: '知识库同步', description: '同步Obsidian知识库内容', status: 'active', runs: 36 }
        ];
        
        return workflows.map(wf => `
            <div class="workflow-item p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h5 class="font-medium text-gray-800">${wf.name}</h5>
                        <p class="text-sm text-gray-500">${wf.description}</p>
                    </div>
                    <span class="ml-2 px-2 py-1 text-xs rounded-full ${wf.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                        ${wf.status}
                    </span>
                </div>
                <div class="flex items-center mt-2 text-xs text-gray-500">
                    <span class="mr-3"><i class="fas fa-play-circle mr-1"></i>执行次数: ${wf.runs}</span>
                    <span><i class="far fa-clock mr-1"></i>最后运行: 今天 10:30</span>
                </div>
            </div>
        `).join('');
    }
    
    static renderWorkflowHistory() {
        const history = [
            { id: 'run-001', workflow: '需求分析工作流', status: 'success', time: '今天 10:24', duration: '2分14秒' },
            { id: 'run-002', workflow: '代码审查工作流', status: 'success', time: '今天 09:45', duration: '1分38秒' },
            { id: 'run-003', workflow: '部署发布工作流', status: 'failed', time: '昨天 16:30', duration: '4分22秒' },
            { id: 'run-004', workflow: '知识库同步', status: 'success', time: '昨天 14:15', duration: '3分05秒' }
        ];
        
        return history.map(h => `
            <div class="workflow-history-item p-3 border-l-4 ${h.status === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}">
                <div class="flex justify-between">
                    <span class="font-medium">${h.workflow}</span>
                    <span class="text-sm text-gray-500">${h.time}</span>
                </div>
                <div class="flex justify-between text-sm text-gray-600 mt-1">
                    <span>状态: <span class="${h.status === 'success' ? 'text-green-600' : 'text-red-600'} font-medium">${h.status}</span></span>
                    <span>耗时: ${h.duration}</span>
                </div>
            </div>
        `).join('');
    }
    
    // Skill仓库模块
    static renderSkillsContent() {
        return `
            <div class="mb-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-semibold text-gray-800">Skill仓库管理</h3>
                    <div class="flex space-x-2">
                        <button id="importSkillBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
                            <i class="fas fa-file-import mr-2"></i>导入Skill
                        </button>
                        <button id="createSkillBtn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
                            <i class="fas fa-plus mr-2"></i>新建Skill
                        </button>
                    </div>
                </div>
                
                <div class="mb-6">
                    <div class="relative">
                        <input type="text" placeholder="搜索Skills..." class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <i class="fas fa-search absolute left-3 top-3.5 text-gray-400"></i>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                    <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">Skill分类</h4>
                        <div class="space-y-4">
                            ${this.renderSkillCategories()}
                        </div>
                    </div>
                    
                    <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">热门Skills</h4>
                        <div class="space-y-3">
                            ${this.renderPopularSkills()}
                        </div>
                    </div>
                </div>
                
                <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4">Skill执行统计</h4>
                    <div class="h-64">
                        <canvas id="skillUsageChart"></canvas>
                    </div>
                </div>
            </div>
        `;
    }
    
    static renderSkillCategories() {
        const categories = [
            { name: 'GitHub工作流', count: 8, icon: 'github', color: 'gray' },
            { name: 'AI模型调用', count: 6, icon: 'robot', color: 'blue' },
            { name: 'Taro小程序', count: 4, icon: 'mobile-alt', color: 'green' },
            { name: '数据库操作', count: 5, icon: 'database', color: 'purple' },
            { name: '系统工具', count: 7, icon: 'tools', color: 'orange' },
            { name: '第三方API', count: 9, icon: 'plug', color: 'pink' }
        ];
        
        return categories.map(cat => `
            <div class="skill-category-item flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div class="flex items-center">
                    <div class="bg-${cat.color}-100 p-2 rounded-lg mr-3">
                        <i class="fab fa-${cat.icon} text-${cat.color}-600"></i>
                    </div>
                    <div>
                        <h5 class="font-medium text-gray-800">${cat.name}</h5>
                        <p class="text-sm text-gray-500">${cat.count} 个Skills</p>
                    </div>
                </div>
                <i class="fas fa-chevron-right text-gray-400"></i>
            </div>
        `).join('');
    }
    
    static renderPopularSkills() {
        const skills = [
            { name: 'github-pr-workflow', description: 'GitHub PR全流程管理', usage: 142, category: 'GitHub' },
            { name: 'taro-4-testing-setup', description: 'Taro小程序测试框架', usage: 98, category: 'Taro' },
            { name: 'ai-plan-generation', description: 'AI计划生成器', usage: 76, category: 'AI' },
            { name: 'wiki-feature-module-index', description: '知识库功能模块索引', usage: 45, category: '知识库' },
            { name: 'systematic-debugging', description: '系统化调试流程', usage: 38, category: '系统工具' }
        ];
        
        return skills.map(skill => `
            <div class="popular-skill-item p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h5 class="font-medium text-gray-800">${skill.name}</h5>
                        <p class="text-sm text-gray-500">${skill.description}</p>
                    </div>
                    <span class="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        ${skill.category}
                    </span>
                </div>
                <div class="flex items-center mt-2 text-xs text-gray-500">
                    <span><i class="fas fa-play-circle mr-1"></i>执行次数: ${skill.usage}</span>
                    <span class="ml-3"><i class="fas fa-star mr-1 text-yellow-500"></i>4.8</span>
                </div>
            </div>
        `).join('');
    }
    
    // 记忆系统模块
    static renderMemoryContent() {
        return `
            <div class="mb-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-semibold text-gray-800">记忆系统</h3>
                    <div class="flex space-x-2">
                        <button id="addMemoryBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
                            <i class="fas fa-plus mr-2"></i>添加记忆
                        </button>
                        <button id="searchMemoryBtn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
                            <i class="fas fa-search mr-2"></i>语义搜索
                        </button>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">记忆统计</h4>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">总记忆条目</span>
                                <span class="text-xl font-bold">1,247</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">今日新增</span>
                                <span class="text-xl font-bold">18</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">关联关系</span>
                                <span class="text-xl font-bold">3,842</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">存储占用</span>
                                <span class="text-xl font-bold">1.2 GB</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100 lg:col-span-2">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">近期重要记忆</h4>
                        <div class="space-y-3">
                            ${this.renderRecentMemories()}
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">记忆类型分布</h4>
                        <div class="h-64">
                            <canvas id="memoryTypeChart"></canvas>
                        </div>
                    </div>
                    
                    <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">关联推荐</h4>
                        <div class="space-y-3">
                            ${this.renderMemoryAssociations()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    static renderRecentMemories() {
        const memories = [
            { id: 'mem-001', title: '聊天消息撤回实现方案', type: 'technical', relevance: 'high', date: '今天 10:24', tags: ['chat', 'V2.8', 'frontend'] },
            { id: 'mem-002', title: 'Taro小程序兼容性问题', type: 'lesson', relevance: 'high', date: '昨天 16:30', tags: ['taro', 'bugfix', 'compatibility'] },
            { id: 'mem-003', title: 'API响应时间优化经验', type: 'optimization', relevance: 'medium', date: '昨天 14:15', tags: ['performance', 'backend', 'V2.6'] },
            { id: 'mem-004', title: '复合页面配置最佳实践', type: 'best-practice', relevance: 'high', date: '前天 09:42', tags: ['ui', 'configuration', 'V2.6'] }
        ];
        
        return memories.map(mem => `
            <div class="memory-item p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" data-id="${mem.id}">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h5 class="font-medium text-gray-800">${mem.title}</h5>
                        <div class="flex items-center mt-1">
                            <span class="text-xs px-2 py-1 rounded-full ${mem.type === 'technical' ? 'bg-blue-100 text-blue-800' : mem.type === 'lesson' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'} mr-2">
                                ${mem.type}
                            </span>
                            <span class="text-xs text-gray-500">
                                ${mem.tags.map(tag => `<span class="mr-1">#${tag}</span>`).join('')}
                            </span>
                        </div>
                    </div>
                    <span class="ml-2 px-2 py-1 text-xs rounded-full ${mem.relevance === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}">
                        ${mem.relevance}
                    </span>
                </div>
                <div class="mt-2 text-xs text-gray-500">
                    记录时间: ${mem.date}
                </div>
            </div>
        `).join('');
    }
    
    static renderMemoryAssociations() {
        const associations = [
            { source: '聊天互通功能', target: '消息撤回需求', strength: 'strong', type: 'implementation' },
            { source: 'Taro测试框架', target: 'V2.8测试计划', strength: 'medium', type: 'dependency' },
            { source: 'API性能优化', target: '聊天接口响应', strength: 'strong', type: 'optimization' },
            { source: '复合页面配置', target: 'UI组件库', strength: 'weak', type: 'component' }
        ];
        
        return associations.map(assoc => `
            <div class="association-item p-3 border border-gray-200 rounded-lg">
                <div class="flex items-center">
                    <div class="flex-1">
                        <div class="font-medium text-gray-800">${assoc.source}</div>
                        <div class="text-sm text-gray-500">关联到: ${assoc.target}</div>
                    </div>
                    <div class="text-right">
                        <span class="text-xs px-2 py-1 rounded-full ${assoc.strength === 'strong' ? 'bg-green-100 text-green-800' : assoc.strength === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}">
                            ${assoc.strength}
                        </span>
                        <div class="text-xs text-gray-500 mt-1">${assoc.type}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // 上下文管理模块
    static renderContextContent() {
        return `
            <div class="mb-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-semibold text-gray-800">上下文管理系统</h3>
                    <div class="flex space-x-2">
                        <button id="createContextBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
                            <i class="fas fa-plus mr-2"></i>创建上下文
                        </button>
                        <button id="mergeContextBtn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
                            <i class="fas fa-code-branch mr-2"></i>合并上下文
                        </button>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                    <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">活跃上下文</h4>
                        <div class="space-y-3">
                            ${this.renderActiveContexts()}
                        </div>
                    </div>
                    
                    <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">上下文版本树</h4>
                        <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div class="text-center">
                                <i class="fas fa-sitemap text-4xl text-gray-400 mb-3"></i>
                                <p class="text-gray-500">上下文版本关系图</p>
                                <button class="mt-3 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
                                    查看完整版本树
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card-hover bg-white p-6 rounded-xl shadow border border-gray-100">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4">上下文注入记录</h4>
                    <div class="space-y-3">
                        ${this.renderContextInjectionLog()}
                    </div>
                </div>
            </div>
        `;
    }
    
    static renderActiveContexts() {
        const contexts = [
            { id: 'ctx-001', name: 'V2.8聊天优化', scope: '项目级', status: 'active', size: '24KB', updated: '今天 10:24' },
            { id: 'ctx-002', name: '用户反馈分析', scope: '功能级', status: 'active', size: '18KB', updated: '今天 09:45' },
            { id: 'ctx-003', name: '技术方案评审', scope: '任务级', status: 'archived', size: '42KB', updated: '昨天 16:30' },
            { id: 'ctx-004', name: 'API接口设计', scope: '模块级', status: 'active', size: '31KB', updated: '昨天 14:15' }
        ];
        
        return contexts.map(ctx => `
            <div class="context-item p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h5 class="font-medium text-gray-800">${ctx.name}</h5>
                        <p class="text-sm text-gray-500">范围: ${ctx.scope} | 大小: ${ctx.size}</p>
                    </div>
                    <span class="ml-2 px-2 py-1 text-xs rounded-full ${ctx.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                        ${ctx.status}
                    </span>
                </div>
                <div class="mt-2 text-xs text-gray-500">
                    最后更新: ${ctx.updated}
                </div>
            </div>
        `).join('');
    }
    
    static renderContextInjectionLog() {
        const logs = [
            { id: 'inj-001', context: 'V2.8聊天优化', target: '需求分析任务', result: 'success', time: '今天 10:24' },
            { id: 'inj-002', context: '用户反馈分析', target: 'AI计划生成', result: 'success', time: '今天 09:45' },
            { id: 'inj-003', context: '技术方案评审', target: '代码审查', result: 'partial', time: '昨天 16:30' },
            { id: 'inj-004', context: 'API接口设计', target: 'API开发任务', result: 'success', time: '昨天 14:15' }
        ];
        
        return logs.map(log => `
            <div class="injection-log-item p-3 border-l-4 ${log.result === 'success' ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'}">
                <div class="flex justify-between">
                    <div>
                        <span class="font-medium">${log.context}</span>
                        <span class="text-gray-500 mx-2">→</span>
                        <span class="font-medium">${log.target}</span>
                    </div>
                    <span class="text-sm text-gray-500">${log.time}</span>
                </div>
                <div class="text-sm text-gray-600 mt-1">
                    注入结果: <span class="${log.result === 'success' ? 'text-green-600' : 'text-yellow-600'} font-medium">${log.result}</span>
                </div>
            </div>
        `).join('');
    }
}

// 更新CenterSystemApp类以使用模块扩展
if (typeof window !== 'undefined' && window.app && window.app.constructor.name === 'CenterSystemApp') {
    // 如果已经定义了CenterSystemApp，扩展它的方法
    const originalRenderWorkflow = window.app.renderWorkflow;
    const originalRenderSkills = window.app.renderSkills;
    const originalRenderMemory = window.app.renderMemory;
    const originalRenderContext = window.app.renderContext;
    
    window.app.renderWorkflow = function() {
        const container = document.getElementById('workflow');
        if (!container) return;
        
        const existingContent = container.querySelector('.dynamic-content');
        if (existingContent) existingContent.remove();
        
        const content = document.createElement('div');
        content.className = 'dynamic-content';
        content.innerHTML = ModuleExtensions.renderWorkflowContent();
        container.appendChild(content);
        
        this.bindWorkflowEvents();
    };
    
    window.app.renderSkills = function() {
        const container = document.getElementById('skills');
        if (!container) return;
        
        const existingContent = container.querySelector('.dynamic-content');
        if (existingContent) existingContent.remove();
        
        const content = document.createElement('div');
        content.className = 'dynamic-content';
        content.innerHTML = ModuleExtensions.renderSkillsContent();
        container.appendChild(content);
        
        this.bindSkillsEvents();
        this.renderSkillUsageChart();
    };
    
    window.app.renderMemory = function() {
        const container = document.getElementById('memory');
        if (!container) return;
        
        const existingContent = container.querySelector('.dynamic-content');
        if (existingContent) existingContent.remove();
        
        const content = document.createElement('div');
        content.className = 'dynamic-content';
        content.innerHTML = ModuleExtensions.renderMemoryContent();
        container.appendChild(content);
        
        this.bindMemoryEvents();
        this.renderMemoryTypeChart();
    };
    
    window.app.renderContext = function() {
        const container = document.getElementById('context');
        if (!container) return;
        
        const existingContent = container.querySelector('.dynamic-content');
        if (existingContent) existingContent.remove();
        
        const content = document.createElement('div');
        content.className = 'dynamic-content';
        content.innerHTML = ModuleExtensions.renderContextContent();
        container.appendChild(content);
        
        this.bindContextEvents();
    };
    
    // 添加事件绑定方法
    window.app.bindWorkflowEvents = function() {
        // 保存工作流按钮
        document.getElementById('saveWorkflowBtn')?.addEventListener('click', () => {
            alert('保存工作流功能\n\n将当前工作流设计保存到数据库，包括所有节点、连接和配置参数。');
        });
        
        // 运行工作流按钮
        document.getElementById('runWorkflowBtn')?.addEventListener('click', () => {
            alert('运行工作流功能\n\n执行当前工作流，AI将按照节点顺序执行任务，监控执行进度并处理异常。');
        });
        
        // 添加节点按钮
        document.getElementById('addNodeBtn')?.addEventListener('click', () => {
            alert('添加工作流节点\n\n从节点库中选择节点类型，配置节点参数，添加到工作流画布中。');
        });
    };
    
    window.app.bindSkillsEvents = function() {
        // 导入Skill按钮
        document.getElementById('importSkillBtn')?.addEventListener('click', () => {
            alert('导入Skill功能\n\n从本地文件或GitHub仓库导入Hermes Agent Skill配置文件。');
        });
        
        // 新建Skill按钮
        document.getElementById('createSkillBtn')?.addEventListener('click', () => {
            alert('新建Skill功能\n\n创建新的Hermes Agent Skill，定义触发条件、执行步骤和预期结果。');
        });
        
        // Skill分类点击
        document.querySelectorAll('.skill-category-item').forEach(item => {
            item.addEventListener('click', () => {
                const categoryName = item.querySelector('h5').textContent;
                alert(`查看${categoryName}分类\n\n显示该分类下的所有Skills，支持筛选、排序和批量管理。`);
            });
        });
        
        // 热门Skill点击
        document.querySelectorAll('.popular-skill-item').forEach(item => {
            item.addEventListener('click', () => {
                const skillName = item.querySelector('h5').textContent;
                alert(`查看Skill详情: ${skillName}\n\n显示Skill的完整配置、使用统计和执行日志。`);
            });
        });
    };
    
    window.app.renderSkillUsageChart = function() {
        const canvas = document.getElementById('skillUsageChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                datasets: [{
                    label: 'Skill执行次数',
                    data: [42, 38, 56, 47, 62, 34, 28],
                    backgroundColor: '#3b82f6',
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
                        title: {
                            display: true,
                            text: '执行次数'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: '日期'
                        }
                    }
                }
            }
        });
    };
    
    window.app.bindMemoryEvents = function() {
        // 添加记忆按钮
        document.getElementById('addMemoryBtn')?.addEventListener('click', () => {
            alert('添加记忆功能\n\n记录项目经验、技术方案、问题解决方法等，AI将自动提取关键信息并建立关联。');
        });
        
        // 语义搜索按钮
        document.getElementById('searchMemoryBtn')?.addEventListener('click', () => {
            alert('语义搜索记忆\n\n基于自然语言查询，从记忆系统中检索相关经验，支持语义理解和相关性排序。');
        });
        
        // 记忆项点击
        document.querySelectorAll('.memory-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.getAttribute('data-id');
                alert(`查看记忆详情\n\n显示完整的记忆内容、相关上下文、关联的知识库条目和历史引用记录。`);
            });
        });
    };
    
    window.app.renderMemoryTypeChart = function() {
        const canvas = document.getElementById('memoryTypeChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['技术方案', '经验教训', '最佳实践', '问题解决', '其他'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
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
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    };
    
    window.app.bindContextEvents = function() {
        // 创建上下文按钮
        document.getElementById('createContextBtn')?.addEventListener('click', () => {
            alert('创建上下文功能\n\n为特定任务或项目创建上下文容器，包含相关背景信息、约束条件和目标设定。');
        });
        
        // 合并上下文按钮
        document.getElementById('mergeContextBtn')?.addEventListener('click', () => {
            alert('合并上下文功能\n\n将多个相关上下文合并为一个统一的上下文，消除冗余信息并建立关联关系。');
        });
        
        // 上下文项点击
        document.querySelectorAll('.context-item').forEach(item => {
            item.addEventListener('click', () => {
                alert('查看上下文详情\n\n显示上下文的完整内容、版本历史、依赖关系和注入记录。');
            });
        });
        
        // 注入记录点击
        document.querySelectorAll('.injection-log-item').forEach(item => {
            item.addEventListener('click', () => {
                alert('查看注入详情\n\n显示上下文注入的完整过程、结果分析和影响评估。');
            });
        });
    };
}