import { defineConfig } from 'vite'

export default defineConfig({
    define: {
        global: 'window', // Fix lỗi SockJS trên Vite
    },
})