import React, { useRef } from 'react'

interface UseSwipeProps {
  onSwipeRight: () => void
  onSwipeLeft: () => void
}

export const useSwipe = (props: UseSwipeProps) => {
  const touchStart = useRef<number>()
  const touchEnd = useRef<number>()

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 100

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null as unknown as number // otherwise the swipe is fired even with usual touch events
    touchStart.current = e.targetTouches[0].clientX
  }

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX
  }

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) {
      return
    }
    const distance = touchStart.current - touchEnd.current
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe || isRightSwipe) {
      console.log('swipe', isLeftSwipe ? 'left' : 'right')
    }
    if (isRightSwipe) {
      props.onSwipeRight()
    }
    if (isLeftSwipe) {
      props.onSwipeLeft()
    }
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  }
}
