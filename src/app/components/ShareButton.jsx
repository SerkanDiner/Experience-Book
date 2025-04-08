'use client'

import { useEffect, useRef, useState } from 'react'
import { Share2, ClipboardCopy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTwitter, FaFacebookF, FaWhatsapp } from 'react-icons/fa'
import useShare from '@/app/hooks/useShare'

export default function ShareButton({ title, likes, avatar }) {
  const [open, setOpen] = useState(false)
  const cardRef = useRef(null)
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const { copied, handleCopy } = useShare({ title, url })

  // Close modal when clicking outside + lock scroll
  useEffect(() => {
    function handleClickOutside(event) {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    if (open) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.body.style.overflow = 'auto'
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <div className="relative z-50">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-orange-400 transition"
        title="Share this post"
      >
        <Share2 className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* 🔲 Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-40"
            />

            {/* 🧡 Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.2 }}
              className="fixed sm:absolute inset-0 sm:inset-auto sm:top-10 sm:right-4 flex sm:block items-end sm:items-start justify-center sm:justify-end z-50"
            >
              <div
                ref={cardRef}
                className="w-[90%] max-w-sm sm:w-80 bg-white dark:bg-gray-900 border border-orange-300 rounded-2xl shadow-xl p-5 relative mb-8 sm:mb-0"
              >
                {/* ✖ Close Button */}
                <div className="flex justify-end sm:hidden mb-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="text-gray-400 hover:text-orange-400 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* 🧡 Preview Card */}
                <div className="relative mb-5 overflow-hidden rounded-xl border border-orange-200 shadow">
                  {avatar && (
                    <img
                      src={avatar}
                      alt="Preview"
                      className="w-full h-28 object-cover"
                    />
                  )}
                  <div className="p-4 bg-white dark:bg-gray-800">
                    <h4 className="text-sm font-bold text-gray-800 dark:text-white line-clamp-2">
                      {title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ❤️ {likes || 0} likes
                    </p>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-[12px] text-orange-500 font-semibold hover:underline"
                    >
                      ➡️ Read this post
                    </a>
                  </div>
                </div>

                {/* 🔗 Copy Button */}
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 mb-5 bg-orange-400 hover:bg-orange-500 text-white text-sm font-semibold rounded-xl transition"
                >
                  <ClipboardCopy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>

                {/* 🌐 Social Icons */}
                <div className="flex justify-around text-orange-400">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      title
                    )}&url=${encodeURIComponent(url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-500 transition"
                    title="Twitter"
                  >
                    <FaTwitter size={20} />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      url
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-500 transition"
                    title="Facebook"
                  >
                    <FaFacebookF size={20} />
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      title + ' ' + url
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-500 transition"
                    title="WhatsApp"
                  >
                    <FaWhatsapp size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
