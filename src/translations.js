// Centralized translation system
const translations = {
  pt: {
    // App
    appName: 'Father Hood',
    tagline: 'A Jornada Heroica da Paternidade',
    footerText: 'Cada missão faz de você um pai melhor 💙',

    // Dad Levels
    levels: {
      1: 'Papai Novato',
      2: 'Aprendiz de Fraldas',
      3: 'Consultor de Sono',
      4: 'Especialista em Alimentação',
      5: 'Mestre da Canção de Ninar',
      6: 'Super Papai',
      7: 'Encantador de Bebês',
      8: 'Lenda dos Pais',
      9: 'Herói Pai',
      10: 'Papai Supremo',
      11: 'Papai Supremo',
    },

    // Dad Classes
    classes: {
      initiate: 'Iniciante Papai',
      warrior: 'Guerreiro do Cuidado',
      knight: 'Cavaleiro do Sono',
      paladin: 'Paladino Pai',
      legend: 'Lenda Paterna',
    },

    // UI Labels
    level: 'Nível',
    streak: 'Sequência',
    days: 'dias',
    experience: 'Experiência',
    toNextLevel: 'Próximo Nível',
    dailyProgress: 'Progresso Diário',
    complete: 'Completo',
    quests: 'Missões',
    badges: 'Conquistas',
    achievementBadges: 'Medalhas de Conquista',
    unlocked: 'Desbloqueado',
    progress: 'Progresso',
    boss: 'CHEFE',
    defeated: 'DERROTADO',
    bossFightOfDay: 'Chefe do Dia',
    dailyQuests: 'Missões Diárias',
    startNewDay: 'Novo Dia',
    beginNewDay: 'Começar um novo dia de aventuras? Isso resetará as missões diárias mas manterá seu progresso.',

    // Quests
    quests: [
      { title: 'Trocar fralda', description: 'Domínio da troca rápida de fraldas' },
      { title: 'Ajudar durante a noite', description: 'Super-herói do turno da noite' },
      { title: 'Colocar o bebê para dormir', description: 'Sussurrador de boas-vindas' },
      { title: 'Deixar mamãe descansar', description: 'Assuma por uma pausa merecida' },
      { title: 'Passear com o bebê', description: 'Hora da aventura no carrinho' },
      { title: 'Alimentar o bebê', description: 'Campeão da hora da refeição' },
      { title: 'Hora do banho', description: 'Supervisor da zona de respingos' },
      { title: 'Hora da barriguinha', description: 'Diversão no chão' },
    ],

    // Bosses
    bosses: [
      { title: 'O Turno da Noite', description: 'Sobreviva a uma noite completa de despertares' },
      { title: 'A Maratona de Mamadas', description: 'Lide com 5 mamadas em um dia' },
      { title: 'A Calma Suprema', description: 'Acalme um choro inconsolável' },
    ],

    // Achievements
    achievements: [
      { title: 'Primeiros Passos', description: 'Complete sua primeira missão' },
      { title: 'Mestre das Fraldas', description: 'Troque 10 fraldas' },
      { title: 'Coruja Noturna', description: 'Complete 5 missões noturnas' },
      { title: 'Guru do Sono', description: 'Coloque o bebê para dormir 7 vezes' },
      { title: 'Super Parceiro', description: 'Deixe mamãe descansar 5 vezes' },
      { title: 'Papai Aventureiro', description: 'Dê 10 voltas com o bebê' },
      { title: 'Matador de Chefes', description: 'Derrote seu primeiro chefe' },
      { title: 'Lenda', description: 'Alcance o nível 10' },
    ],

    // Achievement Tiers
    tiers: {
      bronze: 'Bronze',
      silver: 'Prata',
      gold: 'Ouro',
      platinum: 'Platina',
    },

    // Fatherhood Messages
    messages: [
      'A maior marca de um pai is how he treats his children when no one is looking.',
      'Um pai é alguém que carrega fotos na carteira onde costumava ter dinheiro.',
      'Ser pai não é apenas sobre ganhar o título, é sobre merecê-lo.',
      'O coração de um pai é a obra-prima da natureza.',
      'Pai: O primeiro herói de um filho, o primeiro amor de uma filha.',
      'Qualquer homem pode ser um pai, mas é preciso alguém especial para ser um papai.',
      'O amor de um pai é para sempre impresso no coração de seu filho.',
      'O poder de um pai na vida de um filho é incomparável.',
      'Por trás de todo grande filho há um pai verdadeiramente incrível.',
      'Pais seguram a mão de seus filhos por um curto tempo, mas seus corações para sempre.',
    ],

    // Language
    language: 'Idioma',
    portuguese: 'Português',
    english: 'Inglês',
  },

  en: {
    // App
    appName: 'Father Hood',
    tagline: 'The Heroic Journey of Fatherhood',
    footerText: 'Every quest makes you a stronger father 💙',

    // Dad Levels
    levels: {
      1: 'New Dad',
      2: 'Diaper Apprentice',
      3: 'Sleep Consultant',
      4: 'Feeding Expert',
      5: 'Lullaby Master',
      6: 'Super Dad',
      7: 'Baby Whisperer',
      8: 'Dad Legend',
      9: 'Father Hero',
      10: 'Ultimate Dad',
      11: 'Dad Supreme',
    },

    // Dad Classes
    classes: {
      initiate: 'Dad Initiate',
      warrior: 'Care Warrior',
      knight: 'Sleep Knight',
      paladin: 'Dad Paladin',
      legend: 'Father Legend',
    },

    // UI Labels
    level: 'Level',
    streak: 'Streak',
    days: 'days',
    experience: 'Experience',
    toNextLevel: 'To Next Level',
    dailyProgress: 'Daily Progress',
    complete: 'Complete',
    quests: 'Quests',
    badges: 'Badges',
    achievementBadges: 'Achievement Badges',
    unlocked: 'Unlocked',
    progress: 'Progress',
    boss: 'BOSS',
    defeated: 'DEFEATED',
    bossFightOfDay: 'Boss Fight of the Day',
    dailyQuests: 'Daily Quests',
    startNewDay: 'New Day',
    beginNewDay: 'Begin a new day of adventures? This will reset daily quests but keep your progress.',

    // Quests
    quests: [
      { title: 'Change diaper', description: 'Quick diaper change mastery' },
      { title: 'Help during the night', description: 'Night shift superhero' },
      { title: 'Put baby to sleep', description: 'Bedtime whisperer' },
      { title: 'Let mom rest', description: 'Take over for some well-deserved break' },
      { title: 'Walk with the baby', description: 'Stroller adventure time' },
      { title: 'Feed the baby', description: 'Mealtime champion' },
      { title: 'Bath time', description: 'Splash zone supervisor' },
      { title: 'Tummy time', description: 'Floor play fun' },
    ],

    // Bosses
    bosses: [
      { title: 'The Night Shift', description: 'Survive a full night of wake-ups' },
      { title: 'The Marathon Feed', description: 'Handle 5 feedings in one day' },
      { title: 'The Ultimate Calm', description: 'Soothe an inconsolable cry' },
    ],

    // Achievements
    achievements: [
      { title: 'First Steps', description: 'Complete your first quest' },
      { title: 'Diaper Master', description: 'Change 10 diapers' },
      { title: 'Night Owl', description: 'Complete 5 night quests' },
      { title: 'Sleep Guru', description: 'Put baby to sleep 7 times' },
      { title: 'Super Partner', description: 'Let mom rest 5 times' },
      { title: 'Adventure Dad', description: 'Take 10 walks with baby' },
      { title: 'Boss Slayer', description: 'Defeat your first boss' },
      { title: 'Legend', description: 'Reach level 10' },
    ],

    // Achievement Tiers
    tiers: {
      bronze: 'Bronze',
      silver: 'Silver',
      gold: 'Gold',
      platinum: 'Platinum',
    },

    // Fatherhood Messages
    messages: [
      'The greatest mark of a father is how he treats his children when no one is looking.',
      'A father is someone who carries pictures in his wallet where his money used to be.',
      'Being a dad isn\'t just about earning the title, it\'s about deserving it.',
      'The heart of a father is the masterpiece of nature.',
      'Dad: A son\'s first hero, a daughter\'s first love.',
      'Any man can be a father, but it takes someone special to be a dad.',
      'A father\'s love is forever imprinted on his child\'s heart.',
      'The power of a dad in a child\'s life is unmatched.',
      'Behind every great kid is a truly amazing dad.',
      'Fathers hold their child\'s hand for a short while, but their hearts forever.',
    ],

    // Language
    language: 'Language',
    portuguese: 'Portuguese',
    english: 'English',
  },
}

// Get translation for a specific key path
export const t = (lang, keyPath) => {
  const keys = keyPath.split('.')
  let value = translations[lang] || translations.pt
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key]
    } else {
      return keyPath // Return key path if translation not found
    }
  }
  
  return value
}

// Get current language from localStorage or default to 'pt'
export const getCurrentLang = () => {
  return localStorage.getItem('fatherhood-lang') || 'pt'
}

// Set language and save to localStorage
export const setLang = (lang) => {
  localStorage.setItem('fatherhood-lang', lang)
  return lang
}

// Get all available languages
export const availableLanguages = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
]

export default translations