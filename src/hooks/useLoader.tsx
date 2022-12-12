import { useState } from 'react'

export const useLoader = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const loader = loading
    ? <div className="loader-overlay">
        <div className="sp sp-loadbar"></div>
    </div>
    : <></>

  return {
    loading,
    setLoading,
    loader
  }
}
