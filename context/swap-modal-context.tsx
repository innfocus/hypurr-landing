'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface SwapModalContextType {
	isOpen: boolean
	openModal: () => void
	closeModal: () => void
	toggleModal: () => void
}

const SwapModalContext = createContext<SwapModalContextType | undefined>(undefined)

interface SwapModalProviderProps {
	children: ReactNode
}

export function SwapModalProvider({ children }: SwapModalProviderProps) {
	const [isOpen, setIsOpen] = useState(false)

	const openModal = useCallback(() => {
		setIsOpen(true)
	}, [])

	const closeModal = useCallback(() => {
		setIsOpen(false)
	}, [])

	const toggleModal = useCallback(() => {
		setIsOpen((prev) => !prev)
	}, [])

	return (
		<SwapModalContext.Provider
			value={{
				isOpen,
				openModal,
				closeModal,
				toggleModal,
			}}>
			{children}
		</SwapModalContext.Provider>
	)
}

export function useSwapModal() {
	const context = useContext(SwapModalContext)
	if (context === undefined) {
		throw new Error('useSwapModal must be used within a SwapModalProvider')
	}
	return context
}
