import { useState, useEffect } from 'react'
import { t, getCurrentLang, setLang, availableLanguages } from './translations'
import {
  FaBaby,
  FaMoon,
  FaBed,
  FaBath,
  FaWalking,
  FaFire,
  FaTrophy,
  FaBolt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaShare
} from "react-icons/fa";

import {
  GiBabyBottle,
  GiBroadsword,
  GiShield
} from "react-icons/gi";

import heroImage from './assets/hero.png'
import ShareModal from './components/ShareModal'
import './App.css'

// Category configuration with unique colors and icons
const categoryConfig = {
  care: {
    name: 'care',
    icon: FaBaby,
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/40',
    completedBg: 'from-blue-900/50 to-blue-800/30',
    completedBorder: 'border-blue-500/40',
    completedText: 'text-blue-200',
    completedIcon: 'bg-blue-500/20 text-blue-400',
    xpBadge: 'bg-blue-500/15 text-blue-300 border-blue-500/20'
  },
  night: {
    name: 'night',
    icon: FaMoon,
    color: 'indigo',
    gradient: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-500/20',
    textColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/40',
    completedBg: 'from-indigo-900/50 to-indigo-800/30',
    completedBorder: 'border-indigo-500/40',
    completedText: 'text-indigo-200',
    completedIcon: 'bg-indigo-500/20 text-indigo-400',
    xpBadge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20'
  },
  sleep: {
    name: 'sleep',
    icon: FaBed,
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    completedBg: 'from-purple-900/50 to-purple-800/30',
    completedBorder: 'border-purple-500/40',
    completedText: 'text-purple-200',
    completedIcon: 'bg-purple-500/20 text-purple-400',
    xpBadge: 'bg-purple-500/15 text-purple-300 border-purple-500/20'
  },
  support: {
    name: 'support',
    icon: FaBaby,
    color: 'pink',
    gradient: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-500/20',
    textColor: 'text-pink-400',
    borderColor: 'border-pink-500/40',
    completedBg: 'from-pink-900/50 to-pink-800/30',
    completedBorder: 'border-pink-500/40',
    completedText: 'text-pink-200',
    completedIcon: 'bg-pink-500/20 text-pink-400',
    xpBadge: 'bg-pink-500/15 text-pink-300 border-pink-500/20'
  },
  activity: {
    name: 'activity',
    icon: FaWalking,
    color: 'green',
    gradient: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/40',
    completedBg: 'from-green-900/50 to-green-800/30',
    completedBorder: 'border-green-500/40',
    completedText: 'text-green-200',
    completedIcon: 'bg-green-500/20 text-green-400',
    xpBadge: 'bg-green-500/15 text-green-300 border-green-500/20'
  },
  feeding: {
    name: 'feeding',
    icon: GiBabyBottle,
    color: 'orange',
    gradient: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/40',
    completedBg: 'from-orange-900/50 to-orange-800/30',
    completedBorder: 'border-orange-500/40',
    completedText: 'text-orange-200',
    completedIcon: 'bg-orange-500/20 text-orange-400',
    xpBadge: 'bg-orange-500/15 text-orange-300 border-orange-500/20'
  },
  bath: {
    name: 'bath',
    icon: FaBath,
    color: 'cyan',
    gradient: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-500/20',
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
    completedBg: 'from-cyan-900/50 to-cyan-800/30',
    completedBorder: 'border-cyan-500/40',
    completedText: 'text-cyan-200',
    completedIcon: 'bg-cyan-500/20 text-cyan-400',
    xpBadge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20'
  },
  custom: {
    name: 'custom',
    icon: FaBaby,
    color: 'emerald',
    gradient: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500/20',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    completedBg: 'from-emerald-900/50 to-emerald-800/30',
    completedBorder: 'border-emerald-500/40',
    completedText: 'text-emerald-200',
    completedIcon: 'bg-emerald-500/20 text-emerald-400',
    xpBadge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20'
  }
}

// Boss configuration
const bossConfig = {
  sleepBoss: {
    name: 'sleepBoss',
    icon: GiBroadsword,
    color: 'purple',
    gradient: 'from-purple-600 to-purple-800',
    bgColor: 'bg-purple-500/30',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/50',
    glowColor: 'shadow-purple-500/30'
  },
  feedingBoss: {
    name: 'feedingBoss',
    icon: GiBroadsword,
    color: 'red',
    gradient: 'from-red-600 to-red-800',
    bgColor: 'bg-red-500/30',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/50',
    glowColor: 'shadow-red-500/30'
  },
  cryBoss: {
    name: 'cryBoss',
    icon: GiBroadsword,
    color: 'amber',
    gradient: 'from-amber-600 to-amber-800',
    bgColor: 'bg-amber-500/30',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/50',
    glowColor: 'shadow-amber-500/30'
  }
}

// Dad class titles
const getDadClass = (level, lang) => {
  if (level < 3) return { name: t(lang, 'classes.initiate'), color: 'text-slate-400', bgColor: 'bg-slate-500/20' }
  if (level < 5) return { name: t(lang, 'classes.warrior'), color: 'text-blue-400', bgColor: 'bg-blue-500/20' }
  if (level < 7) return { name: t(lang, 'classes.knight'), color: 'text-purple-400', bgColor: 'bg-purple-500/20' }
  if (level < 9) return { name: t(lang, 'classes.paladin'), color: 'text-amber-400', bgColor: 'bg-amber-500/20' }
  return { name: t(lang, 'classes.legend'), color: 'text-red-400', bgColor: 'bg-red-500/20' }
}

// Icon components
const SwordIcon = () => <GiBroadsword className="w-4 h-4" />
const ShieldIcon = () => <GiShield className="w-4 h-4" />

// Achievement icon component
const AchievementIcon = ({ type, size = 24 }) => {
  const icons = {
    total: FaBaby,
    diapers: FaBaby,
    night: FaMoon,
    sleep: FaBed,
    support: FaBaby,
    activity: FaWalking,
    feeding: GiBabyBottle,
    bath: FaBath,
    boss: GiBroadsword,
    level: FaTrophy,
  }
  const Icon = icons[type] || FaTrophy
  return <Icon className="text-2xl" style={{ width: size, height: size }} />
}

// Default quest data
const defaultQuestData = [
  { id: 1, category: 'care', icon: FaBaby, xp: 50 },
  { id: 2, category: 'night', icon: FaMoon, xp: 100 },
  { id: 3, category: 'sleep', icon: FaBed, xp: 75 },
  { id: 4, category: 'support', icon: FaBaby, xp: 80 },
  { id: 5, category: 'activity', icon: FaWalking, xp: 60 },
  { id: 6, category: 'feeding', icon: GiBabyBottle, xp: 70 },
  { id: 7, category: 'bath', icon: FaBath, xp: 90 },
  { id: 8, category: 'support', icon: FaBaby, xp: 40 },
]

// Default boss data
const defaultBossData = [
  { id: 'boss1', category: 'sleepBoss', icon: GiBroadsword, xp: 200 },
  { id: 'boss2', category: 'feedingBoss', icon: GiBroadsword, xp: 250 },
  { id: 'boss3', category: 'cryBoss', icon: GiBroadsword, xp: 300 },
]

function App() {
  const [lang, setLanguage] = useState(() => getCurrentLang())
  const [quests, setQuests] = useState(() => {
    const saved = localStorage.getItem('fatherhood-quests')
    return saved ? JSON.parse(saved) : null
  })
  
  const [bosses, setBosses] = useState(() => {
    const saved = localStorage.getItem('fatherhood-bosses')
    return saved ? JSON.parse(saved) : null
  })
  
  const [customQuests, setCustomQuests] = useState(() => {
    const saved = localStorage.getItem('fatherhood-custom-quests')
    return saved ? JSON.parse(saved) : []
  })
  
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('fatherhood-xp')
    return saved ? parseInt(saved) : 0
  })
  
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('fatherhood-streak')
    return saved ? parseInt(saved) : 0
  })
  
  const [lastCompletionDate, setLastCompletionDate] = useState(() => {
    return localStorage.getItem('fatherhood-lastdate') || ''
  })
  
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('fatherhood-stats')
    return saved ? JSON.parse(saved) : { total: 0, diapers: 0, night: 0, sleep: 0, support: 0, activity: 0, feeding: 0, bath: 0, boss: 0, level: 1 }
  })
  
  const [celebratingId, setCelebratingId] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [activeTab, setActiveTab] = useState('quests')
  const [showLangModal, setShowLangModal] = useState(false)
  const [dailyMessage, setDailyMessage] = useState('')
  
  // Share modal state
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareData, setShareData] = useState(null)
  
  // Create mission modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingQuest, setEditingQuest] = useState(null)
  const [newQuest, setNewQuest] = useState({
    title: '',
    description: '',
    xp: 50,
    frequency: 'daily',
    category: 'custom'
  })

  useEffect(() => {
    const messages = t(lang, 'messages')
    setDailyMessage(messages[Math.floor(Math.random() * messages.length)])
  }, [lang])

  // Initialize quests and bosses
  const getInitialQuests = () => {
    const questTexts = t(lang, 'quests')
    return questTexts.map((q, i) => {
      const questInfo = defaultQuestData[i]
      return {
        id: questInfo.id,
        title: q.title,
        description: q.description,
        xp: questInfo.xp,
        icon: questInfo.icon.name,
        category: questInfo.category,
        completed: false
      }
    })
  }

  const getInitialBosses = () => {
    const bossTexts = t(lang, 'bosses')
    return bossTexts.map((b, i) => {
      const bossInfo = defaultBossData[i]
      return {
        id: bossInfo.id,
        title: b.title,
        description: b.description,
        xp: bossInfo.xp,
        icon: bossInfo.icon.name,
        category: bossInfo.category,
        completed: false
      }
    })
  }

  const [questList, setQuestList] = useState(() => quests || getInitialQuests())
  const [bossList, setBossList] = useState(() => bosses || getInitialBosses())

  const level = Math.floor(xp / 200) + 1
  const currentLevelXp = xp % 200
  const xpProgress = (currentLevelXp / 200) * 100
  const completedCount = questList.filter(q => q.completed).length
  const totalCount = questList.length
  const dadClass = getDadClass(level, lang)

  // Get icon component by name
  const getIconByName = (name) => {
    const allIcons = {
      FaBaby: FaBaby,
      FaMoon: FaMoon,
      FaBed: FaBed,
      FaWalking: FaWalking,
      FaBath: FaBath,
      GiBabyBottle: GiBabyBottle,
      GiBroadsword: GiBroadsword,
    }
    return allIcons[name] || FaBaby
  }

  // Get category config
  const getCategoryConfig = (category) => {
    return categoryConfig[category] || categoryConfig.custom
  }

  // Get boss config
  const getBossConfig = (category) => {
    return bossConfig[category] || bossConfig.sleepBoss
  }

  // Check streak on mount
  useEffect(() => {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    if (lastCompletionDate === yesterday) {
      // Streak continues
    } else if (lastCompletionDate !== today) {
      setStreak(0)
    }
  }, [lastCompletionDate])

  // Update level in stats
  useEffect(() => {
    setStats(prev => ({ ...prev, level }))
  }, [level])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('fatherhood-quests', JSON.stringify(questList))
  }, [questList])

  useEffect(() => {
    localStorage.setItem('fatherhood-bosses', JSON.stringify(bossList))
  }, [bossList])

  useEffect(() => {
    localStorage.setItem('fatherhood-custom-quests', JSON.stringify(customQuests))
  }, [customQuests])

  useEffect(() => {
    localStorage.setItem('fatherhood-xp', xp.toString())
  }, [xp])

  useEffect(() => {
    localStorage.setItem('fatherhood-streak', streak.toString())
  }, [streak])

  useEffect(() => {
    localStorage.setItem('fatherhood-stats', JSON.stringify(stats))
  }, [stats])

  const handleLanguageChange = (newLang) => {
    const questsData = t(newLang, 'quests')
    const bossesData = t(newLang, 'bosses')
    setLang(newLang)
    setLanguage(newLang)
    setShowLangModal(false)
    
    const newQuests = questsData.map((q, i) => {
      const questInfo = defaultQuestData[i]
      return {
        id: questInfo.id,
        title: q.title,
        description: q.description,
        xp: questInfo.xp,
        icon: questInfo.icon.name,
        category: questInfo.category,
        completed: questList[i]?.completed || false
      }
    })
    const newBosses = bossesData.map((b, i) => {
      const bossInfo = defaultBossData[i]
      return {
        id: bossInfo.id,
        title: b.title,
        description: b.description,
        xp: bossInfo.xp,
        icon: bossInfo.icon.name,
        category: bossInfo.category,
        completed: bossList[i]?.completed || false
      }
    })
    setQuestList(newQuests)
    setBossList(newBosses)
  }

  const toggleQuest = (questId) => {
    setQuestList(questList.map(quest => {
      if (quest.id === questId) {
        const newCompleted = !quest.completed
        
        if (newCompleted && !quest.completed) {
          setXp(prev => prev + quest.xp)
          setCelebratingId(questId)
          setShowConfetti(true)
          
          setStats(prev => ({
            ...prev,
            total: prev.total + 1,
            [quest.category]: (prev[quest.category] || 0) + 1
          }))
          
          const today = new Date().toDateString()
          if (lastCompletionDate !== today) {
            const yesterday = new Date(Date.now() - 86400000).toDateString()
            if (lastCompletionDate === yesterday) {
              setStreak(prev => prev + 1)
            } else if (lastCompletionDate === '') {
              setStreak(1)
            }
            setLastCompletionDate(today)
          }
          
          setTimeout(() => {
            setCelebratingId(null)
            setShowConfetti(false)
          }, 800)
        } else if (!newCompleted && quest.completed) {
          setXp(prev => Math.max(0, prev - quest.xp))
          setStats(prev => ({
            ...prev,
            total: Math.max(0, prev.total - 1),
            [quest.category]: Math.max(0, (prev[quest.category] || 0) - 1)
          }))
        }
        
        return { ...quest, completed: newCompleted }
      }
      return quest
    }))
  }

  const toggleCustomQuest = (questId) => {
    setCustomQuests(customQuests.map(quest => {
      if (quest.id === questId) {
        const newCompleted = !quest.completed
        
        if (newCompleted && !quest.completed) {
          setXp(prev => prev + quest.xp)
          setCelebratingId(questId)
          setShowConfetti(true)
          
          setStats(prev => ({
            ...prev,
            total: prev.total + 1,
            [quest.category]: (prev[quest.category] || 0) + 1
          }))
          
          const today = new Date().toDateString()
          if (lastCompletionDate !== today) {
            const yesterday = new Date(Date.now() - 86400000).toDateString()
            if (lastCompletionDate === yesterday) {
              setStreak(prev => prev + 1)
            } else if (lastCompletionDate === '') {
              setStreak(1)
            }
            setLastCompletionDate(today)
          }
          
          setTimeout(() => {
            setCelebratingId(null)
            setShowConfetti(false)
          }, 800)
        } else if (!newCompleted && quest.completed) {
          setXp(prev => Math.max(0, prev - quest.xp))
          setStats(prev => ({
            ...prev,
            total: Math.max(0, prev.total - 1),
            [quest.category]: Math.max(0, (prev[quest.category] || 0) - 1)
          }))
        }
        
        return { ...quest, completed: newCompleted }
      }
      return quest
    }))
  }

  const toggleBoss = (bossId) => {
    setBossList(bossList.map(boss => {
      if (boss.id === bossId) {
        const newCompleted = !boss.completed
        
        if (newCompleted && !boss.completed) {
          setXp(prev => prev + boss.xp)
          setCelebratingId(bossId)
          setShowConfetti(true)
          setStats(prev => ({ ...prev, boss: prev.boss + 1 }))
          
          setTimeout(() => {
            setCelebratingId(null)
            setShowConfetti(false)
          }, 1200)
        } else if (!newCompleted && boss.completed) {
          setXp(prev => Math.max(0, prev - boss.xp))
          setStats(prev => ({ ...prev, boss: Math.max(0, prev.boss - 1) }))
        }
        
        return { ...boss, completed: newCompleted }
      }
      return boss
    }))
  }

  const resetQuests = () => {
    if (window.confirm(t(lang, 'beginNewDay'))) {
      setQuestList(getInitialQuests())
      // Reset custom quests completion
      setCustomQuests(customQuests.map(q => ({ ...q, completed: false })))
    }
  }

  // Create custom quest
  const handleCreateQuest = () => {
    if (!newQuest.title.trim()) return
    
    const quest = {
      id: Date.now(),
      title: newQuest.title,
      description: newQuest.description || '',
      xp: parseInt(newQuest.xp) || 50,
      frequency: newQuest.frequency || 'daily',
      category: newQuest.category || 'custom',
      completed: false,
      isCustom: true
    }
    
    if (editingQuest) {
      setCustomQuests(customQuests.map(q => q.id === editingQuest.id ? { ...quest, id: q.id } : q))
    } else {
      setCustomQuests([...customQuests, quest])
    }
    
    setNewQuest({ title: '', description: '', xp: 50, frequency: 'daily', category: 'custom' })
    setEditingQuest(null)
    setShowCreateModal(false)
  }

  // Edit custom quest
  const handleEditQuest = (quest) => {
    setNewQuest({
      title: quest.title,
      description: quest.description,
      xp: quest.xp,
      frequency: quest.frequency,
      category: quest.category
    })
    setEditingQuest(quest)
    setShowCreateModal(true)
  }

  // Delete custom quest
  const handleDeleteQuest = (questId) => {
    if (window.confirm(lang === 'pt' ? 'Excluir esta missão?' : 'Delete this quest?')) {
      setCustomQuests(customQuests.filter(q => q.id !== questId))
    }
  }

  const getUnlockedBadges = () => {
    const achievements = t(lang, 'achievements')
    const tiers = t(lang, 'tiers')
    return achievements.map((achievement, i) => ({
      ...achievement,
      type: ['total', 'diapers', 'night', 'sleep', 'support', 'activity', 'feeding', 'bath', 'boss', 'level'][i],
      requirement: [1, 10, 5, 7, 5, 10, 10, 5, 1, 10][i],
      tier: ['bronze', 'bronze', 'bronze', 'silver', 'silver', 'gold', 'gold', 'gold', 'platinum', 'platinum'][i],
      tierLabel: tiers[['bronze', 'bronze', 'bronze', 'silver', 'silver', 'gold', 'gold', 'gold', 'platinum', 'platinum'][i]],
      unlocked: (stats[['total', 'diapers', 'night', 'sleep', 'support', 'activity', 'feeding', 'bath', 'boss', 'level'][i]] || 0) >= [1, 10, 5, 7, 5, 10, 10, 5, 1, 10][i]
    }))
  }

  const renderQuests = () => (
    <div className="space-y-2.5">
      {questList.map((quest, index) => {
        const catConfig = getCategoryConfig(quest.category)
        const IconComponent = getIconByName(quest.icon)
        return (
          <div
            key={quest.id}
            className={`
              group relative overflow-hidden rounded-xl p-3.5 border transition-all duration-300 cursor-pointer
              animate-fade-in-up
              ${quest.completed 
                ? `bg-gradient-to-br ${catConfig.completedBg} ${catConfig.completedBorder}` 
                : `bg-gradient-to-br from-slate-800/70 to-slate-900/50 border-slate-700/60 hover:${catConfig.borderColor}`
              }
              ${celebratingId === quest.id ? 'animate-celebrate' : ''}
            `}
            style={{ animationDelay: `${index * 0.04}s` }}
            onClick={() => toggleQuest(quest.id)}
          >
            {/* Category accent bar */}
            {!quest.completed && (
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${catConfig.gradient}`} />
            )}

            <div className="flex items-center gap-3">
              {/* Status Indicator */}
              <div className={`
                w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300
                ${quest.completed 
                  ? `bg-gradient-to-br ${catConfig.gradient} shadow-lg`
                  : 'bg-slate-700/50 border border-slate-600 group-hover:border-slate-500'
                }
              `}>
                <div className="text-white">
                  {quest.completed ? '✓' : <span className="text-[10px] text-slate-500 font-bold">{index + 1}</span>}
                </div>
              </div>

              {/* Icon with category color */}
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300
                ${quest.completed 
                  ? catConfig.completedIcon
                  : catConfig.bgColor
                }
              `}>
                <IconComponent className={`text-xl ${quest.completed ? catConfig.textColor : 'text-white'}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-sm transition-all duration-300 ${quest.completed ? catConfig.completedText : 'text-white'}`}>
                  {quest.title}
                </h3>
                <p className={`text-xs mt-0.5 ${quest.completed ? `${catConfig.textColor}/40` : 'text-slate-400'}`}>
                  {quest.description}
                </p>
              </div>

              {/* XP Badge with category color */}
              <div className={`
                px-2.5 py-1 rounded-lg text-[10px] font-bold flex-shrink-0 flex items-center gap-1
                ${quest.completed 
                  ? catConfig.xpBadge
                  : 'bg-slate-700/40 text-slate-300 border border-slate-600/40'
                }
              `}>
                <FaBolt className="w-3 h-3" />
                +{quest.xp}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )

  const renderCustomQuests = () => (
    <div className="space-y-2.5">
      {customQuests.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <FaPlus className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{lang === 'pt' ? 'Nenhuma missão personalizada' : 'No custom missions yet'}</p>
          <p className="text-xs mt-1">{lang === 'pt' ? 'Crie sua primeira missão!' : 'Create your first mission!'}</p>
        </div>
      ) : (
        customQuests.map((quest, index) => {
          const catConfig = getCategoryConfig(quest.category)
          const IconComponent = getIconByName(quest.icon) || FaBaby
          return (
            <div
              key={quest.id}
              className={`
                group relative overflow-hidden rounded-xl p-3.5 border transition-all duration-300
                animate-fade-in-up
                ${quest.completed 
                  ? `bg-gradient-to-br ${catConfig.completedBg} ${catConfig.completedBorder}` 
                  : `bg-gradient-to-br from-slate-800/70 to-slate-900/50 border-slate-700/60 hover:${catConfig.borderColor}`
                }
                ${celebratingId === quest.id ? 'animate-celebrate' : ''}
              `}
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              {/* Category accent bar */}
              {!quest.completed && (
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${catConfig.gradient}`} />
              )}

              <div className="flex items-center gap-3">
                {/* Status Indicator */}
                <div className={`
                  w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 cursor-pointer
                  ${quest.completed 
                    ? `bg-gradient-to-br ${catConfig.gradient} shadow-lg`
                    : 'bg-slate-700/50 border border-slate-600 group-hover:border-slate-500'
                  }
                `}
                onClick={() => toggleCustomQuest(quest.id)}
                >
                  <div className="text-white">
                    {quest.completed ? '✓' : <span className="text-[10px] text-slate-500 font-bold">★</span>}
                  </div>
                </div>

                {/* Icon with category color */}
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                  ${quest.completed 
                    ? catConfig.completedIcon
                    : catConfig.bgColor
                  }
                `}>
                  <IconComponent className={`text-xl ${quest.completed ? catConfig.textColor : 'text-white'}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-sm transition-all duration-300 ${quest.completed ? catConfig.completedText : 'text-white'}`}>
                    {quest.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className={`text-xs ${quest.completed ? `${catConfig.textColor}/40` : 'text-slate-400'}`}>
                      {quest.description || (lang === 'pt' ? 'Missão personalizada' : 'Custom quest')}
                    </p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${catConfig.bgColor} ${catConfig.textColor}`}>
                      {quest.frequency === 'daily' ? (lang === 'pt' ? 'Diária' : 'Daily') : 
                       quest.frequency === 'weekly' ? (lang === 'pt' ? 'Semanal' : 'Weekly') : 
                       (lang === 'pt' ? 'Única' : 'Once')}
                    </span>
                  </div>
                </div>

                {/* XP Badge */}
                <div className={`
                  px-2.5 py-1 rounded-lg text-[10px] font-bold flex-shrink-0 flex items-center gap-1
                  ${quest.completed 
                    ? catConfig.xpBadge
                    : 'bg-slate-700/40 text-slate-300 border border-slate-600/40'
                  }
                `}>
                  <FaBolt className="w-3 h-3" />
                  +{quest.xp}
                </div>

                {/* Edit/Delete buttons */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEditQuest(quest); }}
                    className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    <FaEdit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteQuest(quest.id); }}
                    className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )

  const renderBosses = () => (
    <div className="space-y-3">
      {bossList.map((boss, index) => {
        const bossCfg = getBossConfig(boss.category)
        const IconComponent = getIconByName(boss.icon)
        return (
          <div
            key={boss.id}
            className={`
              group relative overflow-hidden rounded-xl p-4 border-2 transition-all duration-300 cursor-pointer
              animate-fade-in-up
              ${boss.completed 
                ? `bg-gradient-to-br ${bossCfg.gradient} ${bossCfg.borderColor}` 
                : `bg-gradient-to-br from-slate-900 to-slate-950 border-slate-700/60 hover:${bossCfg.borderColor}`
              }
              ${celebratingId === boss.id ? 'animate-celebrate' : ''}
            `}
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => toggleBoss(boss.id)}
          >
            {/* Boss danger glow effect */}
            {!boss.completed && (
              <>
                <div className={`absolute inset-0 bg-gradient-to-r ${bossCfg.gradient} opacity-5 animate-pulse-slow`} />
                <div className={`absolute -inset-1 bg-gradient-to-r ${bossCfg.gradient} opacity-10 blur-xl`} />
              </>
            )}
            
            {/* Rarity badge */}
            {!boss.completed && (
              <div className="absolute top-2 right-2 flex items-center gap-1">
                <FaBolt className="w-3 h-3 text-amber-400 animate-pulse" />
                <span className="text-[8px] text-amber-400 font-bold uppercase tracking-wider">Legendary</span>
              </div>
            )}
            
            <div className="relative flex items-center gap-3">
              {/* Boss Icon - larger and more imposing */}
              <div className={`
                w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300
                ${boss.completed 
                  ? `${bossCfg.bgColor} ${bossCfg.textColor} ${bossCfg.glowColor}`
                  : `bg-gradient-to-br from-slate-800 to-slate-900 text-red-400 shadow-lg shadow-red-500/10`
                }
              `}>
                <IconComponent className="text-2xl" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-bold text-base ${boss.completed ? `${bossCfg.textColor} line-through` : 'text-red-300'}`}>
                    {boss.title}
                  </h3>
                  {!boss.completed && (
                    <span className="flex items-center gap-1 text-[10px] text-red-400 font-bold uppercase tracking-wider">
                      <SwordIcon /> {t(lang, 'boss')}
                    </span>
                  )}
                  {boss.completed && (
                    <span className={`text-[10px] ${bossCfg.textColor} font-bold uppercase tracking-wider`}>{t(lang, 'defeated')}</span>
                  )}
                </div>
                <p className={`text-xs ${boss.completed ? `${bossCfg.textColor}/50` : 'text-slate-400'}`}>
                  {boss.description}
                </p>
              </div>

              {/* XP Badge - larger for bosses */}
              <div className={`
                px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 flex items-center gap-1
                ${boss.completed 
                  ? `${bossCfg.bgColor} ${bossCfg.textColor}`
                  : 'bg-red-500/15 text-red-300 border border-red-500/20'
                }
              `}>
                <FaBolt className="w-3 h-3" />
                +{boss.xp}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )

  const renderBadges = () => {
    const unlockedBadges = getUnlockedBadges()
    const unlockedCount = unlockedBadges.filter(b => b.unlocked).length
    
    return (
      <div className="space-y-3">
        {/* Badge Summary */}
        <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/50 rounded-xl p-4 border border-slate-700/60">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold text-sm">{t(lang, 'achievementBadges')}</h3>
            <span className="text-xs text-slate-400">{unlockedCount} / {unlockedBadges.length} {t(lang, 'unlocked')}</span>
          </div>
          <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / unlockedBadges.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {unlockedBadges.map((badge, index) => (
            <div
              key={badge.id || index}
              className={`
                relative overflow-hidden rounded-xl p-3 border transition-all duration-300
                animate-fade-in-up
                ${badge.unlocked 
                  ? `bg-gradient-to-br from-${badge.tier === 'bronze' ? 'orange' : badge.tier === 'silver' ? 'purple' : badge.tier === 'gold' ? 'amber' : 'red'}-900/30 to-${badge.tier === 'bronze' ? 'orange' : badge.tier === 'silver' ? 'purple' : badge.tier === 'gold' ? 'amber' : 'red'}-800/10 border-${badge.tier === 'bronze' ? 'orange' : badge.tier === 'silver' ? 'purple' : badge.tier === 'gold' ? 'amber' : 'red'}-500/30`
                  : 'bg-slate-800/30 border-slate-700/30 opacity-60'
                }
              `}
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <div className="flex items-center gap-2.5">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                  ${badge.unlocked ? 'bg-white/10' : 'bg-slate-700/30'}
                `}>
                  <AchievementIcon type={badge.type} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-xs ${badge.unlocked ? 'text-white' : 'text-slate-500'}`}>
                    {badge.title}
                  </h4>
                  {badge.unlocked ? (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      ✓ {t(lang, 'unlocked')}
                    </span>
                  ) : (
                    <p className="text-[10px] text-slate-500">
                      {stats[badge.type] || 0}/{badge.requirement}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderCreateQuest = () => (
    <div className="space-y-4">
      {/* Create New Mission Card */}
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/50 rounded-xl p-4 border border-slate-700/60">
        <div className="flex items-center gap-2 mb-4">
          <FaPlus className="text-emerald-400" />
          <h2 className="text-white font-semibold text-sm">{lang === 'pt' ? 'Criar Nova Missão' : 'Create New Mission'}</h2>
        </div>

        <div className="space-y-3">
          {/* Title */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">{lang === 'pt' ? 'Nome da Missão' : 'Mission Name'}</label>
            <input
              type="text"
              value={newQuest.title}
              onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
              placeholder={lang === 'pt' ? 'Ex: Ler história' : 'Ex: Read story'}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">{lang === 'pt' ? 'Descrição' : 'Description'}</label>
            <textarea
              value={newQuest.description}
              onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
              placeholder={lang === 'pt' ? 'Descrição opcional...' : 'Optional description...'}
              rows={2}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            />
          </div>

          {/* XP */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">{lang === 'pt' ? 'XP Reward' : 'XP Reward'}</label>
            <div className="flex items-center gap-2">
              <FaBolt className="text-yellow-400" />
              <input
                type="number"
                value={newQuest.xp}
                onChange={(e) => setNewQuest({ ...newQuest, xp: e.target.value })}
                min="10"
                max="500"
                step="10"
                className="w-24 bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <span className="text-xs text-slate-500">10-500</span>
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">{lang === 'pt' ? 'Frequência' : 'Frequency'}</label>
            <div className="flex gap-2">
              {[
                { value: 'daily', label: lang === 'pt' ? 'Diária' : 'Daily' },
                { value: 'weekly', label: lang === 'pt' ? 'Semanal' : 'Weekly' },
                { value: 'once', label: lang === 'pt' ? 'Única' : 'Once' }
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setNewQuest({ ...newQuest, frequency: opt.value })}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                    newQuest.frequency === opt.value
                      ? 'bg-emerald-500/20 border-emerald-500/50 border text-emerald-300'
                      : 'bg-slate-700/30 border-slate-600/30 border text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">{lang === 'pt' ? 'Categoria' : 'Category'}</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(categoryConfig).map(([key, config]) => {
                const Icon = config.icon
                return (
                  <button
                    key={key}
                    onClick={() => setNewQuest({ ...newQuest, category: key })}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-all duration-300 ${
                      newQuest.category === key
                        ? `${config.bgColor} ${config.borderColor} border text-white`
                        : 'bg-slate-700/30 border-slate-600/30 border text-slate-400 hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="capitalize">{key}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Preview */}
          {newQuest.title && (
            <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <p className="text-xs text-slate-400 mb-2">{lang === 'pt' ? 'Prévia:' : 'Preview:'}</p>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCategoryConfig(newQuest.category).bgColor}`}>
                  {(() => {
                    const Icon = getCategoryConfig(newQuest.category).icon
                    return <Icon className="text-white text-sm" />
                  })()}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{newQuest.title}</p>
                  <p className="text-slate-400 text-xs">{newQuest.description || (lang === 'pt' ? 'Sem descrição' : 'No description')}</p>
                </div>
                <div className="px-2 py-1 bg-slate-700/50 rounded text-xs text-yellow-400 flex items-center gap-1">
                  <FaBolt className="w-3 h-3" />
                  {newQuest.xp}
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleCreateQuest}
            disabled={!newQuest.title.trim()}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300"
          >
            <FaSave />
            {editingQuest ? (lang === 'pt' ? 'Salvar Alterações' : 'Save Changes') : (lang === 'pt' ? 'Criar Missão' : 'Create Mission')}
          </button>

          {editingQuest && (
            <button
              onClick={() => {
                setEditingQuest(null)
                setNewQuest({ title: '', description: '', xp: 50, frequency: 'daily', category: 'custom' })
                setShowCreateModal(false)
              }}
              className="w-full py-2 bg-slate-700/50 rounded-lg text-slate-300 font-medium text-sm hover:bg-slate-700 transition-all duration-300"
            >
              {lang === 'pt' ? 'Cancelar' : 'Cancel'}
            </button>
          )}
        </div>
      </div>

      {/* Custom Quests List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FaBaby className="text-emerald-400" />
            <h2 className="text-white font-semibold text-sm">{lang === 'pt' ? 'Minhas Missões' : 'My Missions'}</h2>
            <span className="text-xs text-slate-500">({customQuests.length})</span>
          </div>
        </div>
        {renderCustomQuests()}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex justify-center">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fade-in-up"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            >
              <span className="text-2xl">
                {['⚔️', '🏆', '⭐', '💪', '👶', '🎯', '🔥'][Math.floor(Math.random() * 7)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Language Modal */}
      {showLangModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLangModal(false)} />
          <div className="relative bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl max-w-sm w-full animate-fade-in-up">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <GiShield className="w-5 h-5" />
              {t(lang, 'language')}
            </h3>
            <div className="space-y-2">
              {availableLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                    lang === language.code
                      ? 'bg-amber-500/20 border-amber-500/50 border text-amber-300'
                      : 'bg-slate-700/30 border-slate-600/30 border text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <span className="text-2xl">{language.flag}</span>
                  <span className="font-medium">{language.name}</span>
                  {lang === language.code && (
                    <span className="w-5 h-5 ml-auto text-amber-400 font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-[420px] min-h-screen flex flex-col relative">
        {/* Hero Header - Dad Profile Card */}
        <div className="relative px-5 pt-6 pb-6">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
          
          {/* Language Switcher */}
          <div className="relative flex justify-end mb-3">
            <button
              onClick={() => setShowLangModal(true)}
              className="flex items-center gap-2 bg-slate-800/70 backdrop-blur-sm rounded-xl px-3 py-2 border border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600 transition-all duration-300"
            >
              <GiShield className="w-5 h-5" />
              <span className="text-xs font-medium">
                {availableLanguages.find(l => l.code === lang)?.flag} {lang.toUpperCase()}
              </span>
            </button>
          </div>

          {/* Level & Class Row */}
          <div className="relative flex items-center justify-between mb-4">
            {/* Level Badge */}
            <div className="flex items-center gap-2.5 bg-gradient-to-br from-amber-500/15 to-amber-600/5 backdrop-blur-sm rounded-xl px-3 py-2 border border-amber-500/25">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <span className="text-white font-bold text-base">{level}</span>
              </div>
              <div>
                <p className="text-[10px] text-amber-300/60 uppercase tracking-wider">{t(lang, 'level')}</p>
                <p className="text-xs text-amber-200 font-semibold">{t(lang, `levels.${level}`)}</p>
              </div>
            </div>

            {/* Streak Flame */}
            <div className="flex items-center gap-2 bg-gradient-to-br from-orange-500/15 to-red-500/5 backdrop-blur-sm rounded-xl px-3 py-2 border border-orange-500/25">
              <FaFire className="w-5 h-5 text-orange-400 animate-pulse-slow" />
              <div>
                <p className="text-[10px] text-orange-300/60 uppercase tracking-wider">{t(lang, 'streak')}</p>
                <p className="text-sm text-orange-200 font-bold">{streak} {t(lang, 'days')}</p>
              </div>
            </div>
          </div>

          {/* Dad Class Banner */}
          <div className={`relative mb-4 ${dadClass.bgColor} backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldIcon />
                <span className={`text-sm font-semibold ${dadClass.color}`}>{dadClass.name}</span>
              </div>
              <span className="text-[10px] text-slate-400">{xp} Total XP</span>
            </div>
          </div>

          {/* Main Title */}
          <div className="relative text-center mb-4">
            <div className="inline-block mb-3 animate-float">
              <div className="relative">
                {/* Glow effect behind the image */}
                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full scale-110"></div>
                {/* Hero image with styling */}
                <img
                  src={heroImage}
                  alt="Father Hood Hero"
                  className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shadow-2xl shadow-amber-500/30 border-2 border-amber-500/30"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
              {t(lang, 'appName')}
            </h1>
            <p className="text-slate-400 text-xs">{t(lang, 'tagline')}</p>
          </div>

          {/* XP Progress Card */}
          <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-lg rounded-xl p-4 border border-slate-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <FaBolt className="text-2xl text-yellow-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t(lang, 'experience')}</p>
                  <p className="text-base font-bold text-white">{xp} XP</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t(lang, 'toNextLevel')}</p>
                <p className="text-sm font-semibold text-amber-300">{200 - currentLevelXp} XP</p>
              </div>
            </div>
            
            {/* XP Progress Bar */}
            <div className="relative h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${xpProgress}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Daily Message */}
        <div className="px-5 mb-4">
          <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/20 backdrop-blur-sm rounded-xl p-3 border border-indigo-500/20">
            <p className="text-xs text-indigo-200/80 italic text-center">"{dailyMessage}"</p>
          </div>
        </div>

        {/* Quest Progress */}
        <div className="px-5 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">{t(lang, 'dailyProgress')}</span>
            <span className="text-[10px] text-emerald-400 font-semibold">{completedCount}/{totalCount} {t(lang, 'complete')}</span>
          </div>
          <div className="mt-1.5 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-5 pb-24 overflow-y-auto">
          {/* Tab Content */}
          {activeTab === 'quests' && (
            <div className="space-y-4">
              {/* Daily Quests */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <FaBaby className="text-lg text-amber-400" />
                  <h2 className="text-white font-semibold text-sm">{t(lang, 'dailyQuests')}</h2>
                </div>
                {renderQuests()}
              </div>

              {/* Custom Quests */}
              {customQuests.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <FaPlus className="text-lg text-emerald-400" />
                    <h2 className="text-white font-semibold text-sm">{lang === 'pt' ? 'Missões Personalizadas' : 'Custom Missions'}</h2>
                    <span className="text-xs text-slate-500">({customQuests.filter(q => q.completed).length}/{customQuests.length})</span>
                  </div>
                  {renderCustomQuests()}
                </div>
              )}

              {/* Boss Fight */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <GiBroadsword className="text-lg text-red-400" />
                  <h2 className="text-red-300 font-semibold text-sm">{t(lang, 'bossFightOfDay')}</h2>
                </div>
                {renderBosses()}
              </div>
            </div>
          )}
          {activeTab === 'create' && renderCreateQuest()}
          {activeTab === 'badges' && renderBadges()}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-gradient-to-t from-slate-950 via-slate-950/95 to-slate-900/80 backdrop-blur-lg border-t border-slate-700/50 px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Quests Tab */}
            <button
              onClick={() => setActiveTab('quests')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                activeTab === 'quests' 
                  ? 'text-amber-400 bg-amber-500/10' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <FaBaby className="w-5 h-5" />
              <span className="text-[10px] font-medium">{t(lang, 'dailyQuests')}</span>
            </button>

            {/* Create Tab */}
            <button
              onClick={() => setActiveTab('create')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                activeTab === 'create' 
                  ? 'text-emerald-400 bg-emerald-500/10' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <FaPlus className="w-5 h-5" />
              <span className="text-[10px] font-medium">{lang === 'pt' ? 'Criar' : 'Create'}</span>
            </button>

            {/* Badges Tab */}
            <button
              onClick={() => setActiveTab('badges')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                activeTab === 'badges' 
                  ? 'text-purple-400 bg-purple-500/10' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <FaTrophy className="w-5 h-5" />
              <span className="text-[10px] font-medium">{t(lang, 'badges')}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-3 text-slate-600 text-[10px]">
          <p>{t(lang, 'footerText')}</p>
        </div>
      </div>
    </div>
  )
}

export default App