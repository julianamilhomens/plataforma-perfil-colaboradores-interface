import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

class ApiClient {
  private client: AxiosInstance
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Log da requisição em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data)
        }
        return config
      },
      (error) => {
        console.error('❌ Request error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log da resposta em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ ${response.status} ${response.config.url}`, response.data)
        }
        return response
      },
      (error) => {
        // Log do erro
        console.error('❌ Response error:', error.response?.data || error.message)

        // Tratar erros específicos
        if (error.response?.status === 401) {
          // Token inválido ou expirado
          this.removeAuthToken()
          
          // Redirecionar para login apenas se não estivermos já na página de login
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
        }

        return Promise.reject(error)
      }
    )
  }

  // Métodos HTTP básicos
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config)
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config)
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config)
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config)
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config)
  }

  // Métodos de autenticação
  setAuthToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  removeAuthToken() {
    delete this.client.defaults.headers.common['Authorization']
  }

  // Métodos de conveniência para upload
  async uploadFile<T = any>(
    url: string,
    file: File,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<AxiosResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    return this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
  }

  // Método para requisições com parâmetros de query
  async getWithParams<T = any>(
    url: string,
    params: Record<string, any>
  ): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, { params })
  }

  // Métodos específicos da API
  
  // Autenticação
  async login(credentials: { email: string; password: string }) {
    return this.post('/auth/login', credentials)
  }

  async validateToken() {
    return this.get('/auth/validate')
  }

  async logout() {
    return this.post('/auth/logout')
  }

  // Usuários
  async getUsers(params?: {
    page?: number
    limit?: number
    name?: string
    email?: string
    role?: string
    areaId?: string
  }) {
    return this.getWithParams('/users', params || {})
  }

  async getUserById(id: string) {
    return this.get(`/users/${id}`)
  }

  async getCurrentUser() {
    return this.get('/users/me')
  }

  async createUser(userData: any) {
    return this.post('/users', userData)
  }

  async updateUser(id: string, userData: any) {
    return this.put(`/users/${id}`, userData)
  }

  async deleteUser(id: string) {
    return this.delete(`/users/${id}`)
  }

  // Áreas
  async getAreas() {
    return this.get('/areas')
  }

  // Projetos (placeholder para implementação futura)
  async getProjects(params?: any) {
    return this.getWithParams('/projects', params || {})
  }

  async getProjectById(id: string) {
    return this.get(`/projects/${id}`)
  }

  async createProject(projectData: any) {
    return this.post('/projects', projectData)
  }

  async updateProject(id: string, projectData: any) {
    return this.put(`/projects/${id}`, projectData)
  }

  async deleteProject(id: string) {
    return this.delete(`/projects/${id}`)
  }

  // Método para health check
  async healthCheck() {
    return this.get('/health')
  }

  // Getter para acessar o cliente axios diretamente se necessário
  get axiosInstance() {
    return this.client
  }
}

// Instância singleton da API
export const api = new ApiClient()

// Export default para compatibilidade
export default api