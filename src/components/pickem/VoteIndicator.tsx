type VoteIndicatorProps = {
    isHighlighted?: boolean,
    className?: string
}

export function VoteIndicator({ isHighlighted }: VoteIndicatorProps) {
    return (
        <div className="w-6 h-6 border-2 border-[#838383] flex flex-col items-center justify-center rounded-full" >
            {isHighlighted &&
                <div className="w-4 h-4 border bg-blue-600 rounded-full" ></div>
            }
        </div>
    )
}