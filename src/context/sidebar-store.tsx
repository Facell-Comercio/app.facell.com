import { create } from 'zustand';

interface useSidebarTypes {
    mobile: boolean,
    sidebarOpen: boolean,
    itemActive: {
        sub: boolean, index?: number | null, parentIndex?: number | null
    },
    setMobile: (mobile: boolean) => void,
    openSidebar: () => void,
    closeSidebar: () => void,
    toggleSidebar: () => void,
    setItemActive: ({ sub, index, parentIndex }: { sub: boolean, index?: number | null, parentIndex?: number | null }) => void,
}

export const useSidebar = create<useSidebarTypes>((set) => ({
    mobile: window.innerWidth <= 768,
    sidebarOpen: true,
    itemActive: { sub: false, index: null, parentIndex: null },
    setMobile: (mobile: boolean) => set(({ mobile })),
    openSidebar: () => set({ sidebarOpen: true }),
    closeSidebar: () => set({ sidebarOpen: false }),
    toggleSidebar: () => set((state: useSidebarTypes) => ({ sidebarOpen: !state.sidebarOpen })),
    setItemActive: ({ sub, index, parentIndex }) => set(({ itemActive: { sub, index, parentIndex } })),
}))