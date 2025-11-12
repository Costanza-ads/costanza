(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/lib/axiosInstance.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/axiosInstance.ts
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
// 🚨 CORREÇÃO DO 404: Removendo a barra final da BASE_URL
const BASE_URL = 'http://localhost:8000/api/v1';
const TOKEN_REFRESH_URL = 'http://localhost:8000/api/token/refresh/';
// 🚨 NOVO REFRESH TOKEN (Para inicialização)
const INITIAL_REFRESH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2MTEzMzMyNCwiaWF0IjoxNzYxMDQ2OTI0LCJqdGkiOiIxMWE0NWYzNTA3YTY0YWU0OWYxYzE1YTk3MzA1MjJmMyIsInVzZXJfaWQiOiIzIn0.ooFCw0-NZ_O9lQgqAOLyev_nwRSAjC3uAFTnxoQfnT0";
// 💡 Configuração inicial: SALVA o refresh token APENAS NO CLIENTE (Evita ReferenceError)
if ("object" !== 'undefined' && !localStorage.getItem('refreshToken')) {
    localStorage.setItem('refreshToken', INITIAL_REFRESH_TOKEN);
}
// Crie a instância base do Axios
const axiosInstance = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
// Variáveis de controle
let isRefreshing = false;
let failedQueue = [];
// Função que processa a fila de requisições que falharam
const processQueue = function(error) {
    let token = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    failedQueue.forEach((prom)=>{
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};
// -------------------------------------------------------------
// 1. INTERCEPTOR DE REQUISIÇÃO (ANEXA O ACCESS TOKEN ANTES DE ENVIAR)
// -------------------------------------------------------------
axiosInstance.interceptors.request.use((config)=>{
    let token = null;
    // 🚨 CORREÇÃO DO LOCALSTORAGE: Acesso apenas no lado do cliente
    if ("TURBOPACK compile-time truthy", 1) {
        token = localStorage.getItem('accessToken');
    }
    if (token) {
        config.headers.Authorization = "Bearer ".concat(token);
    }
    return config;
}, (error)=>{
    return Promise.reject(error);
});
// -------------------------------------------------------------
// 2. INTERCEPTOR DE RESPOSTA (DETECTA 401 E RENOVA)
// -------------------------------------------------------------
axiosInstance.interceptors.response.use((response)=>response, async (error)=>{
    var _error_response;
    const originalRequest = error.config;
    const isClient = "object" !== 'undefined';
    // Verifica se é um 401 E que não seja a própria requisição de refresh
    if (((_error_response = error.response) === null || _error_response === void 0 ? void 0 : _error_response.status) === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        // Obtém o refresh token
        const REFRESH_TOKEN = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('refreshToken') : "TURBOPACK unreachable";
        if (!REFRESH_TOKEN) {
            return Promise.reject("Refresh token não encontrado. Sessão expirada.");
        }
        if (isRefreshing) {
            // Adiciona requisições à fila
            return new Promise((resolve, reject)=>{
                failedQueue.push({
                    resolve,
                    reject
                });
            }).then((token)=>{
                originalRequest.headers.Authorization = "Bearer ".concat(token);
                return axiosInstance(originalRequest);
            }).catch((err)=>{
                return Promise.reject(err);
            });
        }
        isRefreshing = true;
        try {
            // Envia o refresh token para o endpoint do Django
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(TOKEN_REFRESH_URL, {
                refresh: REFRESH_TOKEN
            });
            const { access: newAccessToken, refresh: newRefreshToken } = response.data;
            // 🚨 CORREÇÃO DO LOCALSTORAGE: Salva os novos tokens apenas no cliente
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.setItem('accessToken', newAccessToken);
                if (newRefreshToken) {
                    localStorage.setItem('refreshToken', newRefreshToken);
                }
            }
            // Atualiza cabeçalhos
            axiosInstance.defaults.headers.common['Authorization'] = "Bearer ".concat(newAccessToken);
            originalRequest.headers.Authorization = "Bearer ".concat(newAccessToken);
            // Processa a fila e repete a requisição original
            processQueue(null, newAccessToken);
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            // Falha na renovação: Limpa tokens e força logout
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }
            processQueue(refreshError);
            return Promise.reject(refreshError);
        } finally{
            isRefreshing = false;
        }
    }
    return Promise.reject(error);
});
const __TURBOPACK__default__export__ = axiosInstance;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/components/UserFetcher.tsx
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// Importa a instância configurada
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$src$2f$lib$2f$axiosInstance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/lib/axiosInstance.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/node_modules/axios/lib/axios.js [app-client] (ecmascript)"); // Importa o Axios para tratamento de erros
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const UserFetcher = ()=>{
    _s();
    const [profiles, setProfiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // 🚨 CORREÇÃO DO 404: O PATH RELATIVO DEVE COMEÇAR COM BARRA.
    const DJANGO_API_PATH = '/users/profile/';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserFetcher.useEffect": ()=>{
            const fetchProfiles = {
                "UserFetcher.useEffect.fetchProfiles": async ()=>{
                    try {
                        // Usa axiosInstance.get - A autenticação e renovação são automáticas.
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$src$2f$lib$2f$axiosInstance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(DJANGO_API_PATH);
                        let data = response.data;
                        // Ajuste para garantir que 'data' seja um array
                        if (data && !Array.isArray(data)) {
                            data = [
                                data
                            ];
                        }
                        setProfiles(data);
                    } catch (err) {
                        let errorMessage = "Ocorreu um erro desconhecido.";
                        if (__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isAxiosError(err)) {
                            var _err_response, _err_response1;
                            if (((_err_response = err.response) === null || _err_response === void 0 ? void 0 : _err_response.status) === 404) {
                                // 🚨 Se for 404, confirma problema na URL
                                errorMessage = "Erro 404: O caminho '".concat(DJANGO_API_PATH, "' não foi encontrado no servidor.");
                            } else if (((_err_response1 = err.response) === null || _err_response1 === void 0 ? void 0 : _err_response1.status) === 401) {
                                // Se a renovação falhou
                                errorMessage = "Sessão expirada. O Refresh Token não conseguiu renovar o acesso. Faça login novamente.";
                            } else if (err.response) {
                                errorMessage = "Erro HTTP ".concat(err.response.status, ": ").concat(JSON.stringify(err.response.data));
                            }
                        } else if (err instanceof Error) {
                            errorMessage = err.message;
                        }
                        setError(errorMessage);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["UserFetcher.useEffect.fetchProfiles"];
            fetchProfiles();
        }
    }["UserFetcher.useEffect"], []);
    // 3. Renderização
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: "Carregando dados do Django..."
        }, void 0, false, {
            fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
            lineNumber: 77,
            columnNumber: 12
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '10px',
                border: '1px solid red',
                color: 'red'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    children: "Erro ao Carregar Perfis"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: error
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                    lineNumber: 84,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: [
                        "URL Base: ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$src$2f$lib$2f$axiosInstance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.baseURL
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                            lineNumber: 85,
                            columnNumber: 22
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                    lineNumber: 85,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: [
                        "Caminho Solicitado: ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                            children: DJANGO_API_PATH
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                            lineNumber: 86,
                            columnNumber: 32
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
            lineNumber: 82,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "Lista de Perfis (via Django API)"
            }, void 0, false, {
                fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            profiles && profiles.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                children: profiles.map((profile)=>// Renderização dos dados
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        style: {
                            marginBottom: '20px',
                            border: '1px solid #ccc',
                            padding: '10px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "ID do Perfil:"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                                lineNumber: 100,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            profile.id,
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                                lineNumber: 100,
                                columnNumber: 59
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Nome Completo:"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                                lineNumber: 101,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            profile.nome,
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                                lineNumber: 101,
                                columnNumber: 62
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Arroba:"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                                lineNumber: 102,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            profile.arroba,
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                                lineNumber: 102,
                                columnNumber: 57
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Stack:"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                                lineNumber: 103,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            profile.stack,
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                                lineNumber: 103,
                                columnNumber: 55
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "XP:"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                                lineNumber: 104,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            profile.xp,
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                                lineNumber: 104,
                                columnNumber: 49
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Skills:"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                                lineNumber: 107,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            profile.skills,
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                                lineNumber: 107,
                                columnNumber: 57
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Bio:"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                                lineNumber: 108,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            profile.bio,
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                                lineNumber: 108,
                                columnNumber: 51
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, profile.id, true, {
                        fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                        lineNumber: 99,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                lineNumber: 96,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2fc1$rea__de__Trabalho$2f$costanzaVE$2d$master$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Nenhum perfil encontrado na API."
            }, void 0, false, {
                fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
                lineNumber: 114,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Área de Trabalho/costanzaVE-master/frontend-next/src/components/user-fetcher.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(UserFetcher, "22fKuvYZj+g+3rIgio4x3vgVD3A=");
_c = UserFetcher;
const __TURBOPACK__default__export__ = UserFetcher;
var _c;
__turbopack_context__.k.register(_c, "UserFetcher");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=OneDrive_%C3%81rea%20de%20Trabalho_costanzaVE-master_frontend-next_src_69921028._.js.map