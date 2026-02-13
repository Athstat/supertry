type Props = {
    className?: string,
    size?: string
}

export default function RugbyGoalPostIcon({className, size = "20"} : Props) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            
            <g clipPath="url(#clip0_36_11)">
                <path  className={className} d="M10 6.00012H2M7.85 1.15012C7.75 1.05012 7.4 0.950116 7 1.00012C6.68456 1.05231 6.38347 1.16969 6.11594 1.34478C5.84842 1.51986 5.62034 1.7488 5.44625 2.01698C5.27217 2.28516 5.15592 2.58669 5.10491 2.90232C5.0539 3.21795 5.06926 3.54075 5.15 3.85012C5.3 3.95012 5.6 4.05012 6 4.00012C6.31544 3.94792 6.61653 3.83054 6.88406 3.65545C7.15158 3.48037 7.37966 3.25143 7.55375 2.98325C7.72783 2.71507 7.84408 2.41354 7.89509 2.09791C7.9461 1.78228 7.93074 1.45948 7.85 1.15012Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                <path className={className} d="M2.5 8H1.5C1.22386 8 1 8.22386 1 8.5V10.5C1 10.7761 1.22386 11 1.5 11H2.5C2.77614 11 3 10.7761 3 10.5V8.5C3 8.22386 2.77614 8 2.5 8Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                <path className={className} d="M2 1V8" stroke="black" strokeLinecap="round" stroke-linejoin="round" />
                <path className={className} d="M10.5 8H9.5C9.22386 8 9 8.22386 9 8.5V10.5C9 10.7761 9.22386 11 9.5 11H10.5C10.7761 11 11 10.7761 11 10.5V8.5C11 8.22386 10.7761 8 10.5 8Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                <path className={className} d="M10 1V8" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
                <clipPath  id="clip0_36_11">
                    <rect  width="12" height="12" fill="white" />
                </clipPath>
            </defs>
        </svg>

    )
}
