// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Plus, Trash2, RotateCcw, Save, Sparkles, Gamepad2, Utensils, BookOpen, Palette, MoreHorizontal, Pencil, Check, X, Copy } from 'lucide-react';

// 本地实现 Button 组件
const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    primary: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 focus:ring-pink-500 shadow-lg',
    secondary: 'bg-white text-gray-700 border-2 border-gray-200 hover:border-pink-300 hover:text-pink-600 focus:ring-pink-500',
    danger: 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 focus:ring-red-500 shadow-lg',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800'
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    icon: 'p-2'
  };
  return <button type={type} onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {children}
    </button>;
};

// 本地实现 Input 组件
const Input = ({
  value,
  onChange,
  placeholder,
  className = '',
  type = 'text',
  maxLength,
  disabled = false
}) => {
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength} disabled={disabled} className={`w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 ${className} ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`} />;
};

// 本地实现 useToast hook
const useToast = () => {
  const showToast = (message, type = 'info') => {
    // 创建 toast 元素
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl transform transition-all duration-300 translate-x-full ${type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : type === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'} text-white font-medium flex items-center gap-2`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);

    // 动画进入
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 10);

    // 自动消失
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };
  return {
    toast: showToast
  };
};

// 彩虹色系
const RAINBOW_COLORS = ['#FF6B6B', '#FF8E53', '#FFCD56', '#4BC0C0', '#36A2EB', '#9966FF', '#FF99CC', '#FFCC99', '#99CCFF', '#CCFF99', '#FFB6C1', '#87CEEB', '#98FB98', '#F0E68C', '#DDA0DD'];

// 内置模板
const BUILT_IN_TEMPLATES = [{
  id: 'default',
  name: '默认奖池',
  icon: Sparkles,
  color: '#FF6B6B',
  prizes: [{
    id: 1,
    text: '奶茶一杯',
    color: '#FF6B6B',
    angle: 30
  }, {
    id: 2,
    text: '免单大奖',
    color: '#4ECDC4',
    angle: 30
  }, {
    id: 3,
    text: '再来一次',
    color: '#45B7D1',
    angle: 30
  }, {
    id: 4,
    text: '谢谢参与',
    color: '#96CEB4',
    angle: 30
  }, {
    id: 5,
    text: '优惠券',
    color: '#FFEAA7',
    angle: 30
  }, {
    id: 6,
    text: '积分+10',
    color: '#DDA0DD',
    angle: 30
  }, {
    id: 7,
    text: '神秘礼物',
    color: '#98D8C8',
    angle: 30
  }, {
    id: 8,
    text: '红包',
    color: '#F7DC6F',
    angle: 30
  }, {
    id: 9,
    text: '折扣券',
    color: '#BB8FCE',
    angle: 30
  }, {
    id: 10,
    text: '幸运星',
    color: '#85C1E2',
    angle: 30
  }, {
    id: 11,
    text: '小零食',
    color: '#F8B500',
    angle: 30
  }, {
    id: 12,
    text: '大奖',
    color: '#E74C3C',
    angle: 30
  }]
}, {
  id: 'divination',
  name: '占卜运势',
  icon: BookOpen,
  color: '#9966FF',
  prizes: [{
    id: 101,
    text: '大吉',
    color: '#FF6B6B',
    angle: 20
  }, {
    id: 102,
    text: '中吉',
    color: '#FF8E53',
    angle: 20
  }, {
    id: 103,
    text: '小吉',
    color: '#FFCD56',
    angle: 20
  }, {
    id: 104,
    text: '吉',
    color: '#4BC0C0',
    angle: 20
  }, {
    id: 105,
    text: '末吉',
    color: '#36A2EB',
    angle: 20
  }, {
    id: 106,
    text: '凶',
    color: '#9966FF',
    angle: 20
  }, {
    id: 107,
    text: '大凶',
    color: '#FF99CC',
    angle: 20
  }, {
    id: 108,
    text: '平',
    color: '#99CCFF',
    angle: 20
  }, {
    id: 109,
    text: '桃花',
    color: '#FFB6C1',
    angle: 20
  }, {
    id: 110,
    text: '财运',
    color: '#F0E68C',
    angle: 20
  }, {
    id: 111,
    text: '事业',
    color: '#87CEEB',
    angle: 20
  }, {
    id: 112,
    text: '健康',
    color: '#98FB98',
    angle: 20
  }, {
    id: 113,
    text: '学业',
    color: '#DDA0DD',
    angle: 20
  }, {
    id: 114,
    text: '贵人',
    color: '#FFCC99',
    angle: 20
  }, {
    id: 115,
    text: '旅行',
    color: '#CCFF99',
    angle: 20
  }, {
    id: 116,
    text: '考试',
    color: '#E74C3C',
    angle: 20
  }, {
    id: 117,
    text: '面试',
    color: '#2ECC71',
    angle: 20
  }, {
    id: 118,
    text: '表白',
    color: '#FF69B4',
    angle: 20
  }]
}, {
  id: 'hobby',
  name: '兴趣爱好',
  icon: Palette,
  color: '#36A2EB',
  prizes: [{
    id: 201,
    text: '看电影',
    color: '#FF6B6B',
    angle: 30
  }, {
    id: 202,
    text: '听音乐',
    color: '#FF8E53',
    angle: 30
  }, {
    id: 203,
    text: '打游戏',
    color: '#4ECDC4',
    angle: 30
  }, {
    id: 204,
    text: '看书',
    color: '#45B7D1',
    angle: 30
  }, {
    id: 205,
    text: '画画',
    color: '#96CEB4',
    angle: 30
  }, {
    id: 206,
    text: '运动',
    color: '#FFEAA7',
    angle: 30
  }, {
    id: 207,
    text: '做饭',
    color: '#DDA0DD',
    angle: 30
  }, {
    id: 208,
    text: '逛街',
    color: '#98D8C8',
    angle: 30
  }, {
    id: 209,
    text: '睡觉',
    color: '#F7DC6F',
    angle: 30
  }, {
    id: 210,
    text: '追剧',
    color: '#BB8FCE',
    angle: 30
  }, {
    id: 211,
    text: '摄影',
    color: '#85C1E2',
    angle: 30
  }, {
    id: 212,
    text: '手工',
    color: '#F8B500',
    angle: 30
  }]
}, {
  id: 'food',
  name: '今天吃什么',
  icon: Utensils,
  color: '#FF8E53',
  prizes: [{
    id: 301,
    text: '火锅',
    color: '#E74C3C',
    angle: 30
  }, {
    id: 302,
    text: '烧烤',
    color: '#FF8E53',
    angle: 30
  }, {
    id: 303,
    text: '麻辣烫',
    color: '#FF6B6B',
    angle: 30
  }, {
    id: 304,
    text: '汉堡',
    color: '#F39C12',
    angle: 30
  }, {
    id: 305,
    text: '披萨',
    color: '#E67E22',
    angle: 30
  }, {
    id: 306,
    text: '寿司',
    color: '#1ABC9C',
    angle: 30
  }, {
    id: 307,
    text: '面条',
    color: '#F1C40F',
    angle: 30
  }, {
    id: 308,
    text: '米饭',
    color: '#ECF0F1',
    angle: 30
  }, {
    id: 309,
    text: '沙拉',
    color: '#2ECC71',
    angle: 30
  }, {
    id: 310,
    text: '炸鸡',
    color: '#F39C12',
    angle: 30
  }, {
    id: 311,
    text: '奶茶',
    color: '#E91E63',
    angle: 30
  }, {
    id: 312,
    text: '冰淇淋',
    color: '#9B59B6',
    angle: 30
  }]
}, {
  id: 'game',
  name: '游戏挑战',
  icon: Gamepad2,
  color: '#4ECDC4',
  prizes: [{
    id: 401,
    text: '真心话',
    color: '#FF6B6B',
    angle: 30
  }, {
    id: 402,
    text: '大冒险',
    color: '#4ECDC4',
    angle: 30
  }, {
    id: 403,
    text: '唱首歌',
    color: '#45B7D1',
    angle: 30
  }, {
    id: 404,
    text: '跳个舞',
    color: '#96CEB4',
    angle: 30
  }, {
    id: 405,
    text: '学动物叫',
    color: '#FFEAA7',
    angle: 30
  }, {
    id: 406,
    text: '做鬼脸',
    color: '#DDA0DD',
    angle: 30
  }, {
    id: 407,
    text: '讲笑话',
    color: '#98D8C8',
    angle: 30
  }, {
    id: 408,
    text: '模仿秀',
    color: '#F7DC6F',
    angle: 30
  }, {
    id: 409,
    text: '罚一杯',
    color: '#BB8FCE',
    angle: 30
  }, {
    id: 410,
    text: '发红包',
    color: '#E74C3C',
    angle: 30
  }, {
    id: 411,
    text: '免罚',
    color: '#2ECC71',
    angle: 30
  }, {
    id: 412,
    text: '指定他人',
    color: '#3498DB',
    angle: 30
  }]
}];
export default function SettingsPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [activeTemplateId, setActiveTemplateId] = useState('default');
  const [prizes, setPrizes] = useState(BUILT_IN_TEMPLATES[0].prizes);
  const [customTemplates, setCustomTemplates] = useState([]);
  const [newPrizeText, setNewPrizeText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  useEffect(() => {
    const savedTemplateId = localStorage.getItem('wheel_active_template');
    const savedCustomTemplates = localStorage.getItem('wheel_custom_templates');
    if (savedTemplateId) setActiveTemplateId(savedTemplateId);
    if (savedCustomTemplates) {
      try {
        const parsed = JSON.parse(savedCustomTemplates);
        // 恢复 icon 为 React 组件（JSON 序列化会丢失函数引用）
        const restored = parsed.map(t => ({
          ...t,
          icon: MoreHorizontal
        }));
        setCustomTemplates(restored);
      } catch (e) {
        console.error('加载自定义模板失败');
      }
    }
  }, []);
  useEffect(() => {
    const savedPrizes = localStorage.getItem(`wheel_prizes_${activeTemplateId}`);
    if (savedPrizes) {
      try {
        setPrizes(JSON.parse(savedPrizes));
      } catch (e) {
        console.error('加载奖项失败');
      }
    } else {
      const builtIn = BUILT_IN_TEMPLATES.find(t => t.id === activeTemplateId);
      if (builtIn) {
        setPrizes([...builtIn.prizes]);
      } else {
        const custom = customTemplates.find(t => t.id === activeTemplateId);
        if (custom) setPrizes([...custom.prizes]);
      }
    }
  }, [activeTemplateId, customTemplates]);
  const totalAngle = prizes.reduce((sum, p) => sum + p.angle, 0);
  const saveCurrentTemplate = () => {
    localStorage.setItem(`wheel_prizes_${activeTemplateId}`, JSON.stringify(prizes));
    localStorage.setItem('wheel_active_template', activeTemplateId);
    toast({
      title: '保存成功',
      description: '当前模板配置已更新',
      duration: 2000
    });
  };
  const saveCustomTemplates = templates => {
    localStorage.setItem('wheel_custom_templates', JSON.stringify(templates));
    setCustomTemplates(templates);
  };
  const switchTemplate = templateId => {
    setActiveTemplateId(templateId);
    localStorage.setItem('wheel_active_template', templateId);
    setShowTemplateMenu(false);
    toast({
      title: '切换成功',
      description: '已切换到新模板',
      duration: 1500
    });
  };
  const createTemplate = () => {
    if (!templateName.trim()) {
      toast({
        title: '请输入模板名称',
        variant: 'destructive',
        duration: 2000
      });
      return;
    }
    const newTemplate = {
      id: `custom_${Date.now()}`,
      name: templateName.trim(),
      icon: MoreHorizontal,
      color: RAINBOW_COLORS[customTemplates.length % RAINBOW_COLORS.length],
      prizes: [{
        id: Date.now(),
        text: '示例奖项',
        color: RAINBOW_COLORS[0],
        angle: 30
      }]
    };
    const updatedTemplates = [...customTemplates, newTemplate];
    saveCustomTemplates(updatedTemplates);
    setTemplateName('');
    setIsCreatingTemplate(false);
    setActiveTemplateId(newTemplate.id);
    setPrizes(newTemplate.prizes);
    toast({
      title: '创建成功',
      description: `模板"${newTemplate.name}"已创建`,
      duration: 2000
    });
  };
  const updateTemplateName = (templateId, newName) => {
    if (!newName.trim()) return;
    const updatedTemplates = customTemplates.map(t => t.id === templateId ? {
      ...t,
      name: newName.trim()
    } : t);
    saveCustomTemplates(updatedTemplates);
    setEditingTemplateId(null);
    toast({
      title: '修改成功',
      description: '模板名称已更新',
      duration: 1500
    });
  };
  const deleteTemplate = templateId => {
    if (!confirm('确定要删除这个模板吗？')) return;
    const updatedTemplates = customTemplates.filter(t => t.id !== templateId);
    saveCustomTemplates(updatedTemplates);
    if (activeTemplateId === templateId) {
      setActiveTemplateId('default');
      localStorage.removeItem(`wheel_prizes_${templateId}`);
    }
    toast({
      title: '删除成功',
      description: '模板已删除',
      duration: 1500
    });
  };
  const duplicateTemplate = template => {
    const newTemplate = {
      ...template,
      id: `custom_${Date.now()}`,
      name: `${template.name} (复制)`,
      prizes: template.prizes.map((p, i) => ({
        ...p,
        id: Date.now() + i,
        color: RAINBOW_COLORS[i % RAINBOW_COLORS.length]
      }))
    };
    const updatedTemplates = [...customTemplates, newTemplate];
    saveCustomTemplates(updatedTemplates);
    toast({
      title: '复制成功',
      description: `模板"${newTemplate.name}"已创建`,
      duration: 2000
    });
  };
  const addPrize = () => {
    if (!newPrizeText.trim()) {
      toast({
        title: '请输入词条内容',
        variant: 'destructive',
        duration: 2000
      });
      return;
    }
    const newPrize = {
      id: Date.now(),
      text: newPrizeText.trim(),
      color: RAINBOW_COLORS[prizes.length % RAINBOW_COLORS.length],
      angle: 30
    };
    const newPrizes = [...prizes, newPrize];
    setPrizes(newPrizes);
    setNewPrizeText('');
    saveCurrentTemplate();
  };
  const deletePrize = id => {
    if (prizes.length <= 2) {
      toast({
        title: '至少保留2个选项',
        variant: 'destructive',
        duration: 2000
      });
      return;
    }
    const newPrizes = prizes.filter(p => p.id !== id);
    setPrizes(newPrizes);
    saveCurrentTemplate();
  };
  const updateAngle = (id, newAngle) => {
    const angle = Math.max(10, Math.min(90, parseInt(newAngle) || 30));
    const newPrizes = prizes.map(p => p.id === id ? {
      ...p,
      angle
    } : p);
    setPrizes(newPrizes);
  };
  const saveAngle = () => saveCurrentTemplate();
  const updateColor = (id, color) => {
    const newPrizes = prizes.map(p => p.id === id ? {
      ...p,
      color
    } : p);
    setPrizes(newPrizes);
    saveCurrentTemplate();
  };
  const startEdit = prize => {
    setEditingId(prize.id);
    setEditText(prize.text);
  };
  const saveEdit = () => {
    if (!editText.trim()) return;
    const newPrizes = prizes.map(p => p.id === editingId ? {
      ...p,
      text: editText.trim()
    } : p);
    setPrizes(newPrizes);
    setEditingId(null);
    saveCurrentTemplate();
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };
  const resetToDefault = () => {
    if (!confirm('确定要重置当前模板吗？')) return;
    const builtIn = BUILT_IN_TEMPLATES.find(t => t.id === activeTemplateId);
    if (builtIn) {
      setPrizes([...builtIn.prizes]);
      localStorage.setItem(`wheel_prizes_${activeTemplateId}`, JSON.stringify(builtIn.prizes));
    } else {
      const custom = customTemplates.find(t => t.id === activeTemplateId);
      if (custom) {
        setPrizes([...custom.prizes]);
        localStorage.setItem(`wheel_prizes_${activeTemplateId}`, JSON.stringify(custom.prizes));
      }
    }
    toast({
      title: '重置成功',
      description: '已恢复默认配置',
      duration: 2000
    });
  };
  const goBack = () => {
    // 返回前自动切换到选中的模板
    const savedTemplateId = localStorage.getItem('wheel_active_template');
    if (activeTemplateId && activeTemplateId !== savedTemplateId) {
      localStorage.setItem('wheel_active_template', activeTemplateId);
      // 同时保存当前模板的奖项配置
      localStorage.setItem(`wheel_prizes_${activeTemplateId}`, JSON.stringify(prizes));
    }
    $w.utils.navigateBack();
  };
  const getCurrentTemplate = () => {
    const builtIn = BUILT_IN_TEMPLATES.find(t => t.id === activeTemplateId);
    if (builtIn) return builtIn;
    return customTemplates.find(t => t.id === activeTemplateId);
  };
  const currentTemplate = getCurrentTemplate();
  const CurrentIcon = currentTemplate?.icon && typeof currentTemplate.icon === 'function' ? currentTemplate.icon : Sparkles;
  const allTemplates = [...BUILT_IN_TEMPLATES, ...customTemplates];
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="icon" onClick={goBack} className="rounded-full hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800">奖池设置</h1>
              <p className="text-xs text-gray-500">共 {prizes.length} 个选项 · 总角度 {totalAngle}°</p>
            </div>
            <Button variant="ghost" size="sm" onClick={resetToDefault} className="text-gray-500 hover:text-gray-700">
              <RotateCcw className="w-4 h-4 mr-1" />
              重置
            </Button>
          </div>

          <div className="relative">
            <Button variant="outline" onClick={() => setShowTemplateMenu(!showTemplateMenu)} className="w-full justify-between rounded-xl border-gray-200 bg-white hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                backgroundColor: currentTemplate?.color || '#FF6B6B'
              }}>
                  <CurrentIcon className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">{currentTemplate?.name || '选择模板'}</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </Button>

            {showTemplateMenu && <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 max-h-80 overflow-y-auto">
                <div className="p-2">
                  <p className="text-xs text-gray-400 px-2 py-1">内置模板</p>
                  {BUILT_IN_TEMPLATES.map(template => {
                const Icon = template.icon;
                return <button key={template.id} onClick={() => switchTemplate(template.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTemplateId === template.id ? 'bg-pink-50 text-pink-600' : 'hover:bg-gray-50'}`}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                    backgroundColor: template.color
                  }}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="flex-1 font-medium">{template.name}</span>
                        {activeTemplateId === template.id && <Check className="w-4 h-4" />}
                      </button>;
              })}
                </div>

                {customTemplates.length > 0 && <div className="p-2 border-t border-gray-100">
                    <p className="text-xs text-gray-400 px-2 py-1">自定义模板</p>
                    {customTemplates.map(template => <div key={template.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${activeTemplateId === template.id ? 'bg-pink-50' : 'hover:bg-gray-50'}`}>
                        <button onClick={() => switchTemplate(template.id)} className="flex-1 flex items-center gap-3 text-left">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                    backgroundColor: template.color
                  }}>
                            <MoreHorizontal className="w-4 h-4 text-white" />
                          </div>
                          {editingTemplateId === template.id ? <Input defaultValue={template.name} autoFocus className="h-8 text-sm" onBlur={e => updateTemplateName(template.id, e.target.value)} onKeyDown={e => {
                    if (e.key === 'Enter') updateTemplateName(template.id, e.target.value);
                    if (e.key === 'Escape') setEditingTemplateId(null);
                  }} /> : <span className={`flex-1 font-medium ${activeTemplateId === template.id ? 'text-pink-600' : ''}`}>{template.name}</span>}
                          {activeTemplateId === template.id && <Check className="w-4 h-4 text-pink-600" />}
                        </button>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setEditingTemplateId(template.id)}>
                            <Pencil className="w-3 h-3 text-gray-400" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => duplicateTemplate(template)}>
                            <Copy className="w-3 h-3 text-gray-400" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:text-red-500" onClick={() => deleteTemplate(template.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>)}
                  </div>}

                <div className="p-2 border-t border-gray-100">
                  {!isCreatingTemplate ? <Button variant="ghost" className="w-full justify-center rounded-lg text-gray-500 hover:text-pink-500" onClick={() => setIsCreatingTemplate(true)}>
                      <Plus className="w-4 h-4 mr-1" />
                      创建新模板
                    </Button> : <div className="flex gap-2 p-2">
                      <Input placeholder="模板名称" value={templateName} onChange={e => setTemplateName(e.target.value)} className="flex-1 h-9" autoFocus onKeyDown={e => {
                  if (e.key === 'Enter') createTemplate();
                  if (e.key === 'Escape') {
                    setIsCreatingTemplate(false);
                    setTemplateName('');
                  }
                }} />
                      <Button size="sm" onClick={createTemplate} className="h-9 px-3 bg-pink-500 hover:bg-pink-600">
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                  setIsCreatingTemplate(false);
                  setTemplateName('');
                }} className="h-9 px-3">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>}
                </div>
              </div>}
          </div>
        </div>
      </header>

      <div className="px-4 py-4 bg-white/60 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input value={newPrizeText} onChange={e => setNewPrizeText(e.target.value)} placeholder="输入新的奖项名称..." className="flex-1 rounded-full bg-white border-gray-200" onKeyDown={e => e.key === 'Enter' && addPrize()} />
          <Button onClick={addPrize} className="rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white border-0">
            <Plus className="w-4 h-4 mr-1" />
            添加
          </Button>
        </div>
      </div>

      <main className="px-4 py-4 pb-24">
        {prizes.length > 0 ? <div className="space-y-3">
            {prizes.map((prize, index) => <div key={prize.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{
              backgroundColor: prize.color
            }}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingId === prize.id ? <div className="flex gap-2">
                        <Input value={editText} onChange={e => setEditText(e.target.value)} className="h-8 rounded-lg" autoFocus onKeyDown={e => {
                  if (e.key === 'Enter') saveEdit();
                  if (e.key === 'Escape') cancelEdit();
                }} />
                        <Button size="sm" onClick={saveEdit} className="h-8 rounded-lg"><Save className="w-3 h-3" /></Button>
                      </div> : <p className="font-medium text-gray-800 truncate cursor-pointer hover:text-pink-500 transition-colors" onClick={() => startEdit(prize)}>{prize.text}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">角度</span>
                    <Input type="number" min={10} max={90} value={prize.angle} onChange={e => updateAngle(prize.id, e.target.value)} onBlur={() => saveAngle(prize.id)} className="w-16 h-8 text-center rounded-lg" />
                    <span className="text-xs text-gray-400">°</span>
                  </div>
                  <div className="relative group">
                    <button className="w-8 h-8 rounded-full border-2 border-white shadow-md transition-transform hover:scale-110" style={{
                backgroundColor: prize.color
              }} />
                    <div className="absolute right-0 top-10 hidden group-hover:grid grid-cols-5 gap-1 p-2 bg-white rounded-xl shadow-lg z-20 w-max">
                      {RAINBOW_COLORS.map(color => <button key={color} className="w-6 h-6 rounded-full border border-gray-200 hover:scale-110 transition-transform" style={{
                  backgroundColor: color
                }} onClick={() => updateColor(prize.id, color)} />)}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deletePrize(prize.id)} className="h-8 w-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-300" style={{
              width: `${prize.angle / totalAngle * 100}%`,
              backgroundColor: prize.color
            }} />
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">占比 {(prize.angle / totalAngle * 100).toFixed(1)}%</p>
              </div>)}
          </div> : <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">还没有添加任何奖项</p>
            <p className="text-sm text-gray-400 mt-1">在上方输入框添加第一个奖项吧</p>
          </div>}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 p-4">
        <p className="text-xs text-gray-500 text-center">💡 点击词条文字可编辑 · 悬停颜色圆圈可换色</p>
      </div>
    </div>;
}