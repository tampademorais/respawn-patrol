import { useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import heroImage from '../assets/hero.png'

const ShareCard = ({ 
  type = 'achievement', 
  title = '', 
  subtitle = '', 
  level = 1, 
  xp = 0, 
  streak = 0,
  badgeType = '',
  tier = '',
  showRef = null,
  format = 'square' // 'square' or 'story'
}) => {
  const cardRef = useRef(null)

  // Card dimensions based on format
  const cardWidth = format === 'story' ? 540 : 540
  const cardHeight = format === 'story' ? 960 : 540

  const getTierColors = (tierType) => {
    const colors = {
      bronze: { primary: '#CD7F32', secondary: '#8B4513', glow: 'rgba(205, 127, 50, 0.4)' },
      silver: { primary: '#C0C0C0', secondary: '#808080', glow: 'rgba(192, 192, 192, 0.4)' },
      gold: { primary: '#FFD700', secondary: '#DAA520', glow: 'rgba(255, 215, 0, 0.4)' },
      platinum: { primary: '#E5E4E2', secondary: '#BDC3C7', glow: 'rgba(229, 228, 226, 0.5)' },
      default: { primary: '#F59E0B', secondary: '#D97706', glow: 'rgba(245, 158, 11, 0.4)' }
    }
    return colors[tierType] || colors.default
  }

  const getTypeGradient = (type) => {
    const gradients = {
      achievement: 'from-amber-500 to-orange-600',
      streak: 'from-orange-500 to-red-600',
      level: 'from-purple-500 to-indigo-600',
      boss: 'from-red-600 to-purple-800'
    }
    return gradients[type] || gradients.achievement
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'streak': return '🔥'
      case 'level': return '⚔️'
      case 'boss': return '👹'
      default: return '🏆'
    }
  }

  const tierColors = badgeType ? getTierColors(badgeType) : getTierColors('default')

  return (
    <div
      ref={cardRef}
      style={{
        width: cardWidth,
        height: cardHeight,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        boxSizing: 'border-box',
      }}
    >
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: `radial-gradient(circle at 30% 30%, ${tierColors.glow} 0%, transparent 50%)`,
        opacity: 0.3,
        animation: 'pulse 4s ease-in-out infinite',
      }} />

      {/* Corner decorations */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '60px',
        height: '60px',
        border: '3px solid',
        borderColor: tierColors.primary,
        opacity: 0.3,
        borderTopWidth: '3px',
        borderLeftWidth: '3px',
        borderBottomWidth: '0',
        borderRightWidth: '0',
        borderRadius: '8px 0 0 0',
      }} />
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        border: '3px solid',
        borderColor: tierColors.primary,
        opacity: 0.3,
        borderTopWidth: '3px',
        borderRightWidth: '3px',
        borderBottomWidth: '0',
        borderLeftWidth: '0',
        borderRadius: '0 8px 0 0',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        width: '60px',
        height: '60px',
        border: '3px solid',
        borderColor: tierColors.primary,
        opacity: 0.3,
        borderBottomWidth: '3px',
        borderLeftWidth: '3px',
        borderTopWidth: '0',
        borderRightWidth: '0',
        borderRadius: '0 0 0 8px',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        border: '3px solid',
        borderColor: tierColors.primary,
        opacity: 0.3,
        borderBottomWidth: '3px',
        borderRightWidth: '3px',
        borderTopWidth: '0',
        borderLeftWidth: '0',
        borderRadius: '0 0 8px 0',
      }} />

      {/* Top section - Hero avatar and level */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '30px',
      }}>
        {/* Level badge */}
        <div style={{
          background: `linear-gradient(135deg, ${tierColors.primary}, ${tierColors.secondary})`,
          borderRadius: '20px',
          padding: '8px 24px',
          marginBottom: '16px',
          boxShadow: `0 4px 20px ${tierColors.glow}`,
        }}>
          <span style={{
            color: '#0F172A',
            fontWeight: 'bold',
            fontSize: '18px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}>
            Nível {level}
          </span>
        </div>

        {/* Hero avatar */}
        <div style={{
          position: 'relative',
          width: '120px',
          height: '120px',
          marginBottom: '16px',
        }}>
          <div style={{
            position: 'absolute',
            inset: '-10px',
            background: `radial-gradient(circle, ${tierColors.glow} 0%, transparent 70%)`,
            borderRadius: '50%',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          <img
            src={heroImage}
            alt="Hero"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '24px',
              border: `3px solid ${tierColors.primary}`,
              boxShadow: `0 8px 32px ${tierColors.glow}`,
            }}
          />
        </div>

        {/* XP Bar */}
        <div style={{
          width: '200px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '14px',
            color: '#94A3B8',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            {xp} XP Total
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${Math.min((xp % 200) / 200 * 100, 100)}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${tierColors.primary}, ${tierColors.secondary})`,
              borderRadius: '4px',
            }} />
          </div>
        </div>
      </div>

      {/* Middle section - Main achievement */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        marginBottom: '30px',
        padding: '0 20px',
      }}>
        {/* Type icon */}
        <div style={{
          fontSize: '48px',
          marginBottom: '16px',
          filter: `drop-shadow(0 4px 12px ${tierColors.glow})`,
        }}>
          {getTypeIcon(type)}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#F8FAFC',
          marginBottom: '12px',
          textShadow: `0 4px 20px ${tierColors.glow}`,
          lineHeight: 1.2,
        }}>
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p style={{
            fontSize: '18px',
            color: '#94A3B8',
            marginBottom: '16px',
            lineHeight: 1.4,
          }}>
            {subtitle}
          </p>
        )}

        {/* Tier badge for achievements */}
        {tier && (
          <div style={{
            display: 'inline-block',
            background: `linear-gradient(135deg, ${tierColors.primary}, ${tierColors.secondary})`,
            color: '#0F172A',
            fontWeight: 'bold',
            fontSize: '14px',
            padding: '6px 20px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginTop: '8px',
          }}>
            {tier}
          </div>
        )}
      </div>

      {/* Bottom section - Stats */}
      {streak > 0 && (
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '16px 32px',
          border: `1px solid ${tierColors.primary}30`,
        }}>
          <span style={{ fontSize: '32px' }}>🔥</span>
          <div>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#F8FAFC',
            }}>
              {streak} dias
            </div>
            <div style={{
              fontSize: '12px',
              color: '#94A3B8',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Sequência Ativa
            </div>
          </div>
        </div>
      )}

      {/* Footer - App branding */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: 2,
      }}>
        <div style={{
          fontSize: '14px',
          color: '#64748B',
          textTransform: 'uppercase',
          letterSpacing: '3px',
          marginBottom: '4px',
        }}>
          Father Hood
        </div>
        <div style={{
          fontSize: '10px',
          color: '#475569',
          letterSpacing: '1px',
        }}>
          A Jornada Heróica da Paternidade
        </div>
      </div>
    </div>
  )
}

export default ShareCard