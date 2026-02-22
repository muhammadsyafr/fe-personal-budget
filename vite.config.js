import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [react(), tailwindcss()],
        server: {
            host: true, // 👈 VERY IMPORTANT
            port: 5173,
            strictPort: true,
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        define: {
            "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
                env.VITE_API_BASE_URL || "http://localhost:3000",
            ),
            "import.meta.env.VITE_OCR_SERVICE_API_URL": JSON.stringify(
                env.VITE_OCR_SERVICE_API_URL || "http://localhost:8000",
            ),
        },
    };
});
