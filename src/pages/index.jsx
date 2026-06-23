// @ts-ignore;
import React, { useState, useEffect, useRef, useCallback } from 'react';
// @ts-ignore;
import { Settings, RotateCcw, Sparkles } from 'lucide-react';
// @ts-ignore;
import { Button, useToast } from '@/components/ui';

// 默认奖池配置
const DEFAULT_PRIZES = [{
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
}];
export default function HomePage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [prizes, setPrizes] = useState(DEFAULT_PRIZES);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [power, setPower] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const powerBarRef = useRef(null);
  const animationRef = useRef(null);

  // 从本地存储加载配置
  useEffect(() => {
    const loadPrizes = () => {
      const activeTemplateId = localStorage.getItem('wheel_active_template') || 'default';
      const saved = localStorage.getItem(`wheel_prizes_${activeTemplateId}`);
      if (saved) {
        try {
          setPrizes(JSON.parse(saved));
        } catch (e) {
          console.error('加载配置失败');
        }
      }
    };
    loadPrizes();

    // 监听存储变化，实现多页面同步
    const handleStorageChange = e => {
      if (e.key?.startsWith('wheel_prizes_') || e.key === 'wheel_active_template') {
        loadPrizes();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 监听页面重新显示（从设置页返回时）
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadPrizes();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // 计算总角度
  const totalAngle = prizes.reduce((sum, p) => sum + p.angle, 0);

  // 生成SVG路径
  const generateSlicePath = (startAngle, endAngle, radius) => {
    const startRad = startAngle * Math.PI / 180;
    const endRad = endAngle * Math.PI / 180;
    const x1 = 150 + radius * Math.cos(startRad);
    const y1 = 150 + radius * Math.sin(startRad);
    const x2 = 150 + radius * Math.cos(endRad);
    const y2 = 150 + radius * Math.sin(endRad);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M 150 150 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  // 计算文字位置
  const getTextPosition = (startAngle, endAngle, radius) => {
    const midAngle = (startAngle + endAngle) / 2;
    const midRad = midAngle * Math.PI / 180;
    const textRadius = radius * 0.65;
    return {
      x: 150 + textRadius * Math.cos(midRad),
      y: 150 + textRadius * Math.sin(midRad),
      rotate: midAngle > 90 && midAngle < 270 ? midAngle + 180 : midAngle
    };
  };

  // 处理力量条拖拽
  const handlePowerStart = e => {
    if (isSpinning) return;
    setIsDragging(true);
    updatePower(e);
  };
  const handlePowerMove = e => {
    if (!isDragging || isSpinning) return;
    updatePower(e);
  };
  const handlePowerEnd = () => {
    if (!isDragging || isSpinning) return;
    setIsDragging(false);
    if (power >= 1) {
      startSpin();
    } else {
      setPower(0);
    }
  };
  const updatePower = e => {
    const rect = powerBarRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, x / rect.width * 100));
    setPower(percentage);
  };

  // 开始旋转 - 统一物理效果
  const startSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setShowResult(false);

    // 🎯 将力量百分比(0-100)映射到物理参数
    const powerRatio = Math.max(0.1, power / 100); // 最小0.1保证有基本速度

    // 📊 圈数：线性增长，10%→1圈，100%→8圈
    const spins = 1 + powerRatio * 7 + Math.random() * 0.5;

    // ⏱️ 时长：2-3.5秒，力量越大转动越久
    const duration = 2000 + powerRatio * 1500 + Math.random() * 300;

    // 🎲 目标角度：完全随机
    const finalRandomAngle = Math.random() * 360;
    const targetRotation = rotation + spins * 360 + finalRandomAngle;
    const startTime = Date.now();
    const startRotation = rotation;

    // 🎢 物理缓动：三次方缓出，开始快后面慢
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 三次方缓出：自然减速效果
      const easeValue = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + (targetRotation - startRotation) * easeValue;
      setRotation(currentRotation);
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setRotation(targetRotation);
        finishSpin(targetRotation);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  // 结束旋转，计算结果
  const finishSpin = finalRotation => {
    setIsSpinning(false);
    setPower(0);

    // 计算指针指向的角度（指针在上方，对应270度）
    const normalizedRotation = (finalRotation % 360 + 360) % 360;
    const pointerAngle = (270 - normalizedRotation + 360) % 360;

    // 找到对应的奖品
    let currentAngle = 0;
    let selectedPrize = null;
    for (const prize of prizes) {
      const prizeStart = currentAngle / totalAngle * 360;
      const prizeEnd = (currentAngle + prize.angle) / totalAngle * 360;
      if (pointerAngle >= prizeStart && pointerAngle < prizeEnd) {
        selectedPrize = prize;
        break;
      }
      currentAngle += prize.angle;
    }
    if (selectedPrize) {
      setResult(selectedPrize);
      setShowResult(true);
      toast({
        title: '🎉 恭喜获得',
        description: selectedPrize.text,
        duration: 3000
      });
    }
  };

  // 跳转到设置页
  const goToSettings = () => {
    $w.utils.navigateTo({
      pageId: 'settings',
      params: {}
    });
  };

  // 清理动画
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  return <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-green-50 flex flex-col">
      {/* 头部 */}
      <header className="px-6 pt-12 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">幸运转盘</h1>
          <p className="text-sm text-gray-500 mt-1">滑动力量条开始抽奖</p>
        </div>
        <Button variant="ghost" size="icon" onClick={goToSettings} className="rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white">
          <Settings className="w-5 h-5 text-gray-600" />
        </Button>
      </header>
      
      {/* 转盘区域 */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="relative">
          {/* 转盘SVG */}
          <svg width="300" height="300" viewBox="0 0 300 300" className="drop-shadow-xl" style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'none' : 'transform 0.3s ease'
        }}>
            {/* 背景圆 */}
            <circle cx="150" cy="150" r="145" fill="white" />
            
            {/* 奖品扇区 */}
            {(() => {
            let currentAngle = 0;
            return prizes.map((prize, index) => {
              const startAngle = currentAngle / totalAngle * 360;
              const endAngle = (currentAngle + prize.angle) / totalAngle * 360;
              const path = generateSlicePath(startAngle, endAngle, 140);
              const textPos = getTextPosition(startAngle, endAngle, 140);
              currentAngle += prize.angle;
              return <g key={prize.id}>
                    <path d={path} fill={prize.color} stroke="white" strokeWidth="2" />
                    <text x={textPos.x} y={textPos.y} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="12" fontWeight="bold" style={{
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}>
                      {prize.text}
                    </text>
                  </g>;
            });
          })()}
            
            {/* 中心圆 */}
            <circle cx="150" cy="150" r="25" fill="white" stroke="#e5e7eb" strokeWidth="2" />
            <circle cx="150" cy="150" r="15" fill="#f3f4f6" />
          </svg>
          
          {/* 指针 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3">
            <div className="relative">
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[24px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-md" />
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full" />
            </div>
          </div>
          
          {/* 装饰圆环 */}
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-gray-200 -m-3" />
        </div>
        
        {/* 力量条 */}
        <div className="w-full max-w-xs mt-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">力量</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(power)}%</span>
          </div>
          <div ref={powerBarRef} className="h-12 bg-white rounded-full shadow-inner overflow-hidden cursor-pointer relative" onMouseDown={handlePowerStart} onMouseMove={handlePowerMove} onMouseUp={handlePowerEnd} onMouseLeave={handlePowerEnd} onTouchStart={handlePowerStart} onTouchMove={handlePowerMove} onTouchEnd={handlePowerEnd}>
            {/* 力量条背景 */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-100 via-yellow-100 to-red-100" />
            
            {/* 力量填充 */}
            <div className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 transition-all duration-75" style={{
            width: `${power}%`
          }} />
            
            {/* 刻度标记 */}
            <div className="absolute inset-0 flex items-center justify-around px-4 pointer-events-none">
              {[...Array(5)].map((_, i) => <div key={i} className="w-0.5 h-4 bg-white/50" />)}
            </div>
            
            {/* 提示文字 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xs text-gray-500 font-medium">
                {isDragging ? '松开开始抽奖' : '按住滑动'}
              </span>
            </div>
          </div>
        </div>
        
        {/* 快捷按钮 */}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={() => setRotation(0)} disabled={isSpinning} className="rounded-full bg-white/80 backdrop-blur-sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            重置
          </Button>
          <Button onClick={() => {
          // 生成随机力量值（20-100）
          const randomPower = 20 + Math.floor(Math.random() * 81);
          setPower(randomPower);
          // 延迟一点让状态更新后再开始旋转
          setTimeout(() => startSpin(), 50);
        }} disabled={isSpinning} className="rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white border-0">
            <Sparkles className="w-4 h-4 mr-2" />
            随机力度
          </Button>
        </div>
      </main>
      
      {/* 结果弹窗 */}
      {showResult && result && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl" style={{
          backgroundColor: result.color + '30'
        }}>
              🎁
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">恭喜获得</h2>
            <p className="text-3xl font-bold mb-6" style={{
          color: result.color
        }}>
              {result.text}
            </p>
            <Button onClick={() => setShowResult(false)} className="w-full rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white border-0 h-12">
              再来一次
            </Button>
          </div>
        </div>}
    </div>;
}