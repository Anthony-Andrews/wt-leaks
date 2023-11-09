import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Draggable from 'gsap/Draggable'

gsap.registerPlugin(ScrollTrigger, Draggable)

const navLinks = gsap.utils.toArray('[data-link]')

const lastItemWidth = () => navLinks[navLinks.length - 1].offsetWidth

const track = document.querySelector('[data-draggable]')

const tl = gsap.timeline()
	.to(track, {
		x: () => {
			return ((track.offsetWidth * 0.5) - lastItemWidth()) * -1
		},
		ease: 'none' // important!
	})

const st = ScrollTrigger.create({
	animation: tl,
	scrub: 0
})

const getDraggableWidth = () => {
	return (track.offsetWidth * 0.5) - lastItemWidth()
}

const getUseableHeight = () => document.documentElement.offsetHeight - window.innerHeight

const updatePosition = () => {
	const left = track.getBoundingClientRect().left * -1
	const width = getDraggableWidth()
	const useableHeight = getUseableHeight()
	const y = gsap.utils.mapRange(0, width, 0, useableHeight, left)

	st.scroll(y)
}

const draggableInstance = Draggable.create(track, {
	type: 'x',
	inertia: true,
	bounds: {
		minX: 0,
		maxX: getDraggableWidth() * -1
	},
	edgeResistance: 1,
	onDragStart: () => st.disable(),
	onDragEnd: () => st.enable(),
	onDrag: updatePosition,
	onThrowUpdate: updatePosition
})

@media (prefers-reduced-motion: no-preference) {
	html {
		scroll-behavior: smooth;
	}
}

track.addEventListener('keyup', (e) => {
	const id = e.target.getAttribute('href')
	
	/* Return if no section href or the user isn’t using the tab key */
	if (!id || e.key !== 'Tab') return
	
	const section = document.querySelector(id)
	
	/* Get the scroll position of the section */
	const y = section.getBoundingClientRect().top + window.scrollY
	
	/* Use the ScrollTrigger to scroll the window */
	st.scroll(y)
})
