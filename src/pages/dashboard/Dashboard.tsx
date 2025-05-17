import React from 'react'
import { useAuthStore } from '../auth/store/authStore'

const Dashboard: React.FC = () => {
  const { address, email } = useAuthStore()

  return (
    <div className="max-w-[1200px] mx-auto p-5">
      <h1 className="mb-8 text-white text-center">Личный кабинет</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="bg-[rgba(61,61,61,0.8)] rounded-lg p-5 shadow-md">
          <h2 className="mb-5 text-white text-xl border-b border-[rgba(255,255,255,0.1)] pb-2.5">Информация о пользователе</h2>
          {email && (
            <div className="mb-4 text-white">
              <strong className="text-[#3498db] mr-1">Email:</strong> {email}
            </div>
          )}
          {address && (
            <div className="mb-4 text-white">
              <strong className="text-[#3498db] mr-1">Кошелек:</strong> {address}
            </div>
          )}
        </div>
        
        <div className="bg-[rgba(61,61,61,0.8)] rounded-lg p-5 shadow-md">
          <h2 className="mb-5 text-white text-xl border-b border-[rgba(255,255,255,0.1)] pb-2.5">Статистика</h2>
          <div className="mb-4 text-white">
            <strong className="text-[#3498db] mr-1">Активные прокси:</strong> 0
          </div>
          <div className="mb-4 text-white">
            <strong className="text-[#3498db] mr-1">Использовано:</strong> 0 из 0 GB
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-5 mt-8 md:flex-row flex-col md:items-stretch items-center">
        <button className="bg-[#3498db] text-white border-none py-3 px-6 rounded-md font-medium cursor-pointer transition-colors duration-300 hover:bg-[#2980b9] md:w-auto w-full max-w-[300px]">Купить прокси</button>
        <button className="bg-[#3498db] text-white border-none py-3 px-6 rounded-md font-medium cursor-pointer transition-colors duration-300 hover:bg-[#2980b9] md:w-auto w-full max-w-[300px]">Настройки аккаунта</button>
      </div>
    </div>
  )
}

export default Dashboard 