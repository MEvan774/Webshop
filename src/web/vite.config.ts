import { globSync } from "glob";
import { resolve } from "path";
import { defineConfig, loadEnv, type PluginOption } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig((async (config: { mode: string; }) => {
    // Gather all entry points
    const input: Record<string, string> = {};

    const htmlFiles: string[] = globSync("wwwroot/**/*.html");

    htmlFiles.forEach((e: string, i: number) => {
        input[`app_${i}`] = resolve(e);
    });

    // Gather all environment variables
    const defines: Record<string, string> = loadEnv(config.mode, process.cwd(), "VITE");

    // BUGFIX: Vite assumes al defines are objects by default
    for (const define of Object.entries(defines)) {
        defines[define[0]] = JSON.stringify(define[1]);
    }

    // After the loadEnv loop
    if (process.env.VITE_API_URL && !defines["VITE_API_URL"]) {
        defines["VITE_API_URL"] = JSON.stringify(process.env.VITE_API_URL);
    }

    // Only load the typechecks plugin when NOT on Vercel
    const plugins: PluginOption[] = [tsconfigPaths()];

    if (!process.env.VERCEL) {
        try {
            const { default: typechecksPlugin } = await import("@hboictcloud/vite-plugin-typechecks");
            plugins.push(
                typechecksPlugin({
                    rootDirectory: resolve(__dirname),
                    tsConfigPath: "./tsconfig.json",
                    includePatterns: [
                        "./global.d.ts",
                        "./src/**/*.ts",
                        "../shared/**/*.ts",
                    ],
                    lintOnBuild: true,
                    lintOnWatchDelay: 200,
                })
            );
        } catch {
            console.warn("Skipping typechecks plugin (not available).");
        }
    }

    return {
        base: "./",
        root: "wwwroot",
        appType: "mpa",
        resolve: {
            alias: {
                "/src": resolve(__dirname, "./src"),
            },
        },
        build: {
            sourcemap: true,
            rollupOptions: {
                input: input,
            },
            outDir: resolve(__dirname, "../../dist/web"),
            emptyOutDir: true,
        },
        esbuild: {
            supported: {
                "top-level-await": true,
            },
        },
        plugins: plugins,
        define: defines,
        server: {
            strictPort: true,
            port: 3000,
        },
        preview: {
            strictPort: true,
            port: 3000,
        },
    };
}) as any);
