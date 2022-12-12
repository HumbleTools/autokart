import { toast } from 'react-toastify'

export const basicCatchToast = (error: any) => {
  console.error(error)
  toast.error('Something went wrong...')
}
