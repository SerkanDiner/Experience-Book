'use client'

import { useState } from 'react'

export default function useShare({ title, url }) {
  const [copied, setCopied] = useState(false)

  const shareData = {
    title: title || 'Check this out!',
    text: 'I found this post interesting and wanted to share it with you!',
    url: url || (typeof window !== 'undefined' ? window.location.href : ''),
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Clipboard error:', err)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Native share cancelled or failed:', err)
      }
    } else {
      handleCopy()
    }
  }

  return { copied, handleCopy, handleNativeShare }
}
