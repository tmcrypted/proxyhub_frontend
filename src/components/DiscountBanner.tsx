import { Gift } from 'lucide-react'

interface DiscountBannerProps {
    discount: number
    code: string
    expiresAt?: string
}

const DiscountBanner = ({ discount, code, expiresAt }: DiscountBannerProps) => {
    return (
        <div className="py-2 px-4 text-white">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Gift className="w-5 h-5" />
                    <div>
                        <h3 className="font-semibold text-base">Special Discount!</h3>
                        <p className="text-sm opacity-90">Use code <span className="font-mono font-bold">{code}</span> for {discount}% off</p>
                        {expiresAt && (
                            <p className="text-xs opacity-75 mt-0.5">Expires: {new Date(expiresAt).toLocaleDateString()}</p>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => navigator.clipboard.writeText(code)}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-sm font-medium transition-colors"
                >
                    Copy Code
                </button>
            </div>
        </div>
    )
}

export default DiscountBanner 