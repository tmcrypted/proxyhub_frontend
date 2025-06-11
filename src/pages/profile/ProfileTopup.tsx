import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../stores/authStore'
import { api } from '../../lib/api'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface NowPaymentsCurrency {
    id: number
    code: string
    name: string
    enable: boolean
    wallet_regex: string
    priority: number
    extra_id_exists: boolean
    extra_id_regex: string | null
    logo_url: string
    track: boolean
    cg_id: string
    is_maxlimit: boolean
    network: string
    smart_contract: string | null
    network_precision: number | null
}

interface NowPaymentsFullCurrenciesListResponse {
    currencies: NowPaymentsCurrency[]
}

const LOGO_BASE_URL = 'https://nowpayments.io/'
const FALLBACK_LOGO = '/logo.svg'

const ProfileTopup = () => {
    const { t } = useTranslation()
    const { user } = useAuthStore()
    const [amount, setAmount] = useState<string>('')
    const [selectedCurrency, setSelectedCurrency] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [currencies, setCurrencies] = useState<NowPaymentsCurrency[]>([])
    const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(true)

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                setIsLoadingCurrencies(true)
                // 1. Получаем доступные тикеры
                const availableRes = await api.get('/payments/available-currencies')
                const availableTickers = new Set(
                    (availableRes.selectedCurrencies || []).map((t: string) => t.toLowerCase())
                )
                // 2. Получаем все валюты
                const response = await api.get('/payments/full-currencies-list')
                const data = response as NowPaymentsFullCurrenciesListResponse
                // 3. Фильтруем только те, что есть в списке доступных тикеров
                const enabledCurrencies = data.currencies
                    .filter(
                        (currency: NowPaymentsCurrency) =>
                            currency.enable && availableTickers.has(currency.code.toLowerCase())
                    )
                    .sort((a: NowPaymentsCurrency, b: NowPaymentsCurrency) => b.priority - a.priority)
                setCurrencies(enabledCurrencies)
                if (enabledCurrencies.length > 0) {
                    setSelectedCurrency(enabledCurrencies[0].code)
                }
            } catch (err) {
                console.error('Failed to fetch currencies:', err)
                setError('Failed to load payment methods')
            } finally {
                setIsLoadingCurrencies(false)
            }
        }
        fetchCurrencies()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user?.nowpaymentsId) {
            setError('User not authenticated')
            return
        }
        const amountNum = parseFloat(amount)
        if (isNaN(amountNum) || amountNum <= 0) {
            setError('Please enter a valid amount')
            return
        }
        try {
            setIsLoading(true)
            setError(null)
            const response = await api.post('/payments/create', {
                userId: user.nowpaymentsId,
                amount: amountNum,
                currency: selectedCurrency
            })
            console.log('Payment created:', response)
        } catch (err) {
            console.error('Failed to create payment:', err)
            setError('Failed to create payment')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount input */}
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium mb-2">
                        {t('profile.topup.amount')}
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                </div>

                {/* Payment method select */}
                <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium mb-2">
                        {t('profile.topup.paymentMethod')}
                    </label>
                    {isLoadingCurrencies ? (
                        <div className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md text-gray-500">
                            Loading payment methods...
                        </div>
                    ) : (
                        <Select
                            value={selectedCurrency}
                            onValueChange={setSelectedCurrency}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map((currency) => (
                                    <SelectItem
                                        key={currency.code}
                                        value={currency.code}
                                        className="flex items-center gap-2"
                                    >
                                        <img
                                            src={LOGO_BASE_URL + currency.logo_url}
                                            alt={currency.name}
                                            className="w-6 h-6 rounded-full"
                                            onError={e => { e.currentTarget.src = FALLBACK_LOGO; }}
                                        />
                                        <span>
                                            {currency.code.toUpperCase()} ({currency.network})
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                {/* Error message */}
                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
                        {error}
                    </div>
                )}

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={isLoading || isLoadingCurrencies}
                    className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? t('profile.topup.processing') : t('profile.topup.submit')}
                </button>
            </form>

            {/* Payment instructions */}
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <h4 className="font-medium mb-2">{t('profile.topup.instructions.title')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t('profile.topup.instructions.description')}
                </p>
            </div>
        </div>
    )
}

export default ProfileTopup 