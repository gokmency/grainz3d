'use client'

import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { FeedbackModal } from './feedback-modal'
import { cn } from '@/lib/utils'

interface FeedbackButtonProps {
  className?: string
}

export function FeedbackButton({ className }: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex items-center gap-2 text-sm transition-colors',
          className ?? 'text-primary-foreground/60 hover:text-primary-foreground'
        )}
      >
        <MessageSquare className="w-4 h-4" />
        <span>Feedback</span>
      </button>
      <FeedbackModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        language="en"
      />
    </>
  )
}
