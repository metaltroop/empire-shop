// empire-client/components/HomeCarousel.tsx
'use client'
import { useState, useRef, TouchEvent, MouseEvent, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const carouselData = [
	{
		id: 1,
		image: '/custompcimg.webp',
		mainText: 'Custom PC Builder',
		subText: 'Start your custom PC build journey with us',
		link: '/PartPicker',
		buttonText: 'Start Building',
		buttonTheme:
			'from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900',
	},
	{
		id: 2,
		image: '/crash2.webp',
		mainText: 'Repair Services',
		subText: 'Having problems? We are the solution',
		link: '/repair',
		buttonText: 'Get Help',
		buttonTheme: 'from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900'
	},
	{
		id: 3,
		image: '/PC-upgrades.webp',
		mainText: 'PC Upgrades',
		subText: 'Boost your system performance',
		link: '/upgrade',
		buttonText: 'Explore Options',
		buttonTheme:
			'from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900',
	},
]

export default function HomeCarousel() {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [touchStart, setTouchStart] = useState(0)
	const [dragging, setDragging] = useState(false)
	const [dragOffset, setDragOffset] = useState(0)  
	const [isPaused, setIsPaused] = useState(false)
  const slideRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | undefined>(undefined)

	const nextSlide = useCallback(() => {
		setCurrentSlide((prev) => (prev + 1) % carouselData.length)
	}, [])

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length)
	}

	// Auto-play functionality
	useEffect(() => {
		const startAutoPlay = () => {
			autoPlayRef.current = setInterval(() => {
				if (!isPaused) {
					nextSlide()
				}
			}, 2000)
		}

		startAutoPlay()

		return () => {
			if (autoPlayRef.current) {
				clearInterval(autoPlayRef.current)
			}
		}
	}, [isPaused, nextSlide])

	const handleTouchStart = (e: TouchEvent) => {
		setTouchStart(e.touches[0].clientX)
		setDragging(true)
		setIsPaused(true) // Pause auto-play on interaction
	}

	const handleMouseDown = (e: MouseEvent) => {
		setTouchStart(e.clientX)
		setDragging(true)
		setIsPaused(true) // Pause auto-play on interaction
	}

	const handleTouchMove = (e: TouchEvent) => {
		if (!dragging) return
		const touchEnd = e.touches[0].clientX
		const diff = touchStart - touchEnd
		// Limit the drag offset to prevent overscrolling
		const maxDrag = window.innerWidth
		const limitedDiff = Math.max(Math.min(diff, maxDrag), -maxDrag)
		setDragOffset(limitedDiff)
	}

	const handleMouseMove = (e: MouseEvent) => {
		if (!dragging) return
		const touchEnd = e.clientX
		const diff = touchStart - touchEnd
		// Limit the drag offset to prevent overscrolling
		const maxDrag = window.innerWidth
		const limitedDiff = Math.max(Math.min(diff, maxDrag), -maxDrag)
		setDragOffset(limitedDiff)
	}

	const handleSwipe = () => {
		const threshold = window.innerWidth * 0.2 // 20% of screen width
		if (Math.abs(dragOffset) > threshold) {
			if (dragOffset > 0) {
				nextSlide()
			} else {
				prevSlide()
			}
		}
		// Add smooth return animation
		setDragOffset(0)
		setDragging(false)
		setIsPaused(false) // Resume auto-play after interaction
	}

	const handleDragEnd = () => {
		handleSwipe()
	}

	// Mouse enter/leave handlers for pause/resume
	const handleMouseEnter = () => {
		setIsPaused(true)
	}

	const handleMouseLeave = () => {
		handleDragEnd()
		setIsPaused(false)
	}

	return (
		<div 
			className="relative overflow-hidden rounded-lg"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<div
				ref={slideRef}
				className="relative flex transition-transform duration-500 ease-out"
				style={{
					transform: `translateX(calc(${-currentSlide * 100}% - ${
						dragging ? dragOffset / 2 : 0
					}px))`,
					width: `${carouselData.length * 100}%`,
					touchAction: 'pan-y pinch-zoom',
				}}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleDragEnd}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleDragEnd}
			>
				{carouselData.map((slide, index) => (
					<div
						key={slide.id}
						className="relative w-full h-64 flex-shrink-0 rounded-lg overflow-hidden"
					>
						<Image 
							src={slide.image}
							alt={slide.mainText}
							fill
							className="object-cover"
							sizes="(max-width: 768px) 100vw, 50vw"
							priority={index === 0} // Add priority to first slide
							placeholder="blur"
							blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Add base64 blur placeholder
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

						{/* Content */}
						<div className="absolute bottom-4 left-4 max-w-xl z-10">
							<h2 className="text-2xl font-bold text-white">{slide.mainText}</h2>
							<p className="text-white mt-2">{slide.subText}</p>
							<Link
								href={slide.link}
								className={`mt-3 inline-block px-4 py-2 rounded-md text-sm text-white font-medium
    bg-gradient-to-r ${slide.buttonTheme}
    transform hover:scale-102
    transition-all duration-200
    border border-white/10
    shadow-md shadow-black/10
    backdrop-blur-sm
    relative
    overflow-hidden
    group`}
							>
								<span className="relative z-10 flex items-center gap-1.5">
									{slide.buttonText}
									<svg
										className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</span>
								<div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
							</Link>
						</div>
					</div>
				))}
			</div>

			{/* Navigation arrows */}
			<button
				onClick={prevSlide}
				className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
			>
				&#8249;
			</button>
			<button
				onClick={nextSlide}
				className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
			>
				&#8250;
			</button>

			{/* Dots */}
			<div className="absolute bottom-4 right-4 flex space-x-2 z-10">
				{carouselData.map((_, index) => (
					<button
						key={index}
						onClick={() => setCurrentSlide(index)}
						className={`w-2 h-2 rounded-full transition-colors ${
							index === currentSlide ? 'bg-white' : 'bg-white/50'
						}`}
					/>
				))}
			</div>
		</div>
	)
}