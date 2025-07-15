'use client'
import { useState, useRef, TouchEvent, MouseEvent, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const carouselData = [
	{
		id: 1,
		image: '/custompcimg.webp',
		mainText: 'Custom PC Builder',
		subText: 'Start your custom PC build journey with us',
		link: '/custom-pc',
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

function CarouselComponent() {
	const [currentSlide, setCurrentSlide] = useState(0)
	const touchStart = useRef(0)
	const touchEnd = useRef(0)

	const handleTouchStart = (e: TouchEvent) => {
		touchStart.current = e.touches[0].clientX
	}

	const handleMouseDown = (e: MouseEvent) => {
		touchStart.current = e.clientX
	}

	const handleTouchMove = (e: TouchEvent) => {
		if (!touchStart.current) return
		touchEnd.current = e.touches[0].clientX
	}

	const handleMouseMove = (e: MouseEvent) => {
		if (!touchStart.current) return
		touchEnd.current = e.clientX
	}

	const handleSwipe = () => {
		const threshold = window.innerWidth * 0.2 // 20% of screen width
		const diff = touchStart.current - touchEnd.current
		if (Math.abs(diff) > threshold) {
			if (diff > 0) {
				nextSlide()
			} else {
				prevSlide()
			}
		}
		touchStart.current = 0
		touchEnd.current = 0
	}

	const handleDragEnd = () => {
		handleSwipe()
	}

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % carouselData.length)
	}

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length)
	}

	return (
		<div className="relative overflow-hidden rounded-lg">
			<div 
				className="flex transition-transform duration-300 ease-out"
				style={{ transform: `translateX(-${currentSlide * 100}%)` }}
			>
				{carouselData.map((slide, index) => (
					<div key={slide.id} className="relative w-full h-64 flex-shrink-0">
						<Image
							src={slide.image}
							alt={slide.mainText}
							fill
							priority={index === 0}
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover"
							loading={index === 0 ? 'eager' : 'lazy'}
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
						<div className="absolute bottom-0 left-0 p-4 text-white">
							<h2 className="text-2xl font-bold">{slide.mainText}</h2>
							<p className="text-sm opacity-90">{slide.subText}</p>
							<Link
								href={slide.link}
								className={`
									inline-block px-4 py-2 mt-2 rounded-lg
									bg-gradient-to-r ${slide.buttonTheme}
									text-white font-medium
									transition-transform hover:scale-105
								`}
							>
								{slide.buttonText}
							</Link>
						</div>
					</div>
				))}
			</div>
			
			{/* Navigation dots */}
			<div className="absolute bottom-4 right-4 flex gap-2">
				{carouselData.map((_, index) => (
					<button
						key={index}
						className={`w-2 h-2 rounded-full transition-colors ${
							index === currentSlide ? 'bg-white' : 'bg-white/50'
						}`}
						onClick={() => setCurrentSlide(index)}
					/>
				))}
			</div>
		</div>
	)
}

export default function HomeCarousel() {
	return (
		<Suspense fallback={
			<div className="h-64 animate-pulse bg-gray-200 rounded-lg" />
		}>
			<CarouselComponent />
		</Suspense>
	)
}