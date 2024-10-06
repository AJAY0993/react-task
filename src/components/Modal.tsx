import { cloneElement, createContext, ReactElement, ReactNode, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { HiX } from 'react-icons/hi'

// Define the context type for managing modal states
type ModalContextType = {
    open: (id: string) => void // Function to open a modal by id
    close: () => void // Function to close the currently open modal
    openId: string // Currently open modal id
}

// Create a context with an undefined initial value
const ModalContext = createContext<ModalContextType | undefined>(undefined)

function ModalProvider({ children }: { children: ReactNode }) {
    // State to manage the currently open modal id
    const [openId, setOpenId] = useState<string>("")

    // Context value to provide open and close functions and the openId state
    const value = {
        open: (id: string) => {
            setOpenId(id) // Set the open modal id
        },
        close: () => {
            setOpenId("") // Clear the open modal id
        },
        openId
    }

    // Provide the context value to children components
    return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}

// Overlay component that renders the background and close button
function OverLay({ children }: { children: ReactNode }) {
    const { close } = useModalContext() // Get the close function from context
    return (
        createPortal(
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50">
                <button className='fixed top-4 right-4 text-white bg-transparent rounded p-2 hover:bg-neutral-3 dark:hover:bg-dark-blue-2' onClick={close}>
                    <HiX className='text-xl' /> {/* Close icon */}
                </button>
                <div className='w-full h-full flex items-center justify-center p-4'>
                    {children} {/* Render the modal content */}
                </div>
            </div>,
            document.body // Render the overlay into the body
        )
    )
}

// Window component that displays the modal content if the correct modal is open
function Window({ children, id }: { children: ReactNode, id: string }) {
    const { openId } = useModalContext() // Get the currently open modal id from context
    if (openId === "" || openId !== id) return null // Return null if this modal is not open
    return <OverLay>{children}</OverLay> // Render the overlay with children
}

// Open component that wraps children and triggers the open function on click
function Open({ children, id }: { children: ReactNode, id: string }) {
    const { open } = useModalContext() // Get the open function from context
    return cloneElement(children as ReactElement, { onClick: () => open(id) }) // Clone the child and pass the onClick handler
}

// Custom hook to use modal context
export function useModalContext() {
    const context = useContext(ModalContext) // Get the context value
    if (context === undefined) throw new Error("useModalContext was called outside of ModalProvider") // Ensure context is available
    return context
}

// Attach Window and Open components to ModalProvider for easy access
ModalProvider.Window = Window
ModalProvider.Open = Open

export default ModalProvider
