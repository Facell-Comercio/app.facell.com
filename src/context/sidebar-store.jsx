import { create } from 'zustand';

export const useSidebar = create((set)=>({
    mobile: window.innerWidth <= 768,
    sidebarOpen: true,
    itemActive: {sub: false, index: null, parentIndex: null},
    setMobile: (mobile)=>set(state=>({ mobile })),
    openSidebar: ()=>set(state=>({ sidebarOpen: true})),
    closeSidebar: ()=>set(state=>({ sidebarOpen: false})),
    toggleSidebar: ()=>set(state=>({ sidebarOpen: !state.sidebarOpen})),
    setItemActive: ({sub, index, parentIndex})=>set(state=>({ itemActive: {sub, index, parentIndex} })),
}))