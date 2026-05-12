import { useState, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { FaTimes, FaDownload, FaShare, FaTwitter, FaWhatsapp } from 'react-icons/fa'
import ShareCard from './ShareCard'

const ShareModal = ({ isOpen, onClose, shareData }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState(null)
  const [selectedFormat, setSelectedFormat] = useState('square')
  const cardRef = useRef(null)

  useEffect(() => {
    if (isOpen && shareData) {
      generateImage()
    }
  }, [isOpen, shareData, selectedFormat])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const generateImage = async () => {
    if (!cardRef.current) return
    
    setIsGenerating(true)
    
    try {
      // Wait a bit for the card to render
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      })
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          setGeneratedImage(url)
        }
      }, 'image/png', 0.95)
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedImage) return
    
    const link = document.createElement('a')
    link.href = generatedImage
    link.download = `father-hood-${shareData?.type}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (!generatedImage) return

    // Try Web Share API first
    if (navigator.share && navigator.canShare) {
      try {
        // Fetch the image as a blob
        const response = await fetch(generatedImage)
        const blob = await response.blob()
        const file = new File([blob], 'father-hood-share.png', { type: 'image/png' })
        
        const shareData = {
          files: [file],
          title: 'Father Hood - Conquista',
          text: shareData?.shareText || 'Confira minha conquista no Father Hood!'
        }

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData)
          return
        }
      } catch (error) {
        console.error('Web Share API failed:', error)
      }
    }

    // Fallback to download
    handleDownload()
  }

  const handleShareTwitter = () => {
    if (!generatedImage) return
    // Twitter doesn't support direct image sharing via URL, so we download
    handleDownload()
    // Open Twitter with pre-filled text
    const text = encodeURIComponent(shareData?.shareText || 'Confira minha conquista no Father Hood!')
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  const handleShareWhatsApp = () => {
    if (!generatedImage) return
    // WhatsApp also requires download first on web
    handleDownload()
    // Open WhatsApp
    const text = encodeURIComponent(shareData?.shareText || 'Confira minha conquista no Father Hood!')
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            <FaShare className="text-amber-400" />
            Compartilhar Conquista
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Format selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedFormat('square')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              selectedFormat === 'square'
                ? 'bg-amber-500/20 border-amber-500/50 border text-amber-300'
                : 'bg-slate-700/30 border-slate-600/30 border text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            Quadrado (1:1)
          </button>
          <button
            onClick={() => setSelectedFormat('story')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              selectedFormat === 'story'
                ? 'bg-amber-500/20 border-amber-500/50 border text-amber-300'
                : 'bg-slate-700/30 border-slate-600/30 border text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            Story (9:16)
          </button>
        </div>

        {/* Preview */}
        <div className="mb-6">
          <div className="relative rounded-xl overflow-hidden border border-slate-600 bg-slate-900">
            {isGenerating ? (
              <div className="aspect-square flex items-center justify-center">
                <div className="text-slate-400 text-sm">Gerando card...</div>
              </div>
            ) : generatedImage ? (
              <img 
                src={generatedImage} 
                alt="Share card preview" 
                className="w-full h-auto"
              />
            ) : (
              <div className="aspect-square flex items-center justify-center">
                <div className="text-slate-400 text-sm">Carregando...</div>
              </div>
            )}
          </div>
        </div>

        {/* Share buttons */}
        <div className="space-y-3">
          <button
            onClick={handleShare}
            disabled={!generatedImage || isGenerating}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300"
          >
            <FaShare />
            Compartilhar (Web Share)
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleShareWhatsApp}
              disabled={!generatedImage || isGenerating}
              className="py-3 bg-green-600/20 border border-green-500/30 rounded-xl text-green-400 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600/30 transition-all duration-300"
            >
              <FaWhatsapp />
              WhatsApp
            </button>
            <button
              onClick={handleShareTwitter}
              disabled={!generatedImage || isGenerating}
              className="py-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600/30 transition-all duration-300"
            >
              <FaTwitter />
              Twitter
            </button>
          </div>

          <button
            onClick={handleDownload}
            disabled={!generatedImage || isGenerating}
            className="w-full py-3 bg-slate-700/50 border border-slate-600/30 rounded-xl text-slate-300 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-all duration-300"
          >
            <FaDownload />
            Salvar Imagem
          </button>
        </div>

        {/* Hidden card for generation */}
        <div className="absolute -left-[9999px] top-0">
          <div ref={cardRef}>
            <ShareCard
              {...shareData}
              format={selectedFormat}
              showRef={cardRef}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareModal