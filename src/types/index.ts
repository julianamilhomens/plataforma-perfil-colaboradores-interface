// Enums
export enum UserRole {
  NORMAL = 'NORMAL',
  MANAGER = 'MANAGER'
}

export enum ContractType {
  CLT = 'CLT',
  PJ = 'PJ',
  FREELANCER = 'FREELANCER'
}

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  DEVELOPMENT = 'DEVELOPMENT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  contractType?: ContractType;
  role: UserRole;
  areas: Area[];
  projects?: ProjectSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface Area {
  id: string;
  name: string;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  deadline?: string;
  technologies?: string[];
  status: ProjectStatus;
  collaborators: UserSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  status: ProjectStatus;
  roleInProject?: string;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  areas: Area[];
  roleInProject?: string;
}

// Auth types
export interface AuthUser {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Form types
export interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  age: number;
  contractType: ContractType;
  role?: UserRole;
  areaIds: string[];
}

export interface UpdateUserForm {
  name?: string;
  email?: string;
  age?: number;
  contractType?: ContractType;
  role?: UserRole;
  areaIds?: string[];
}

export interface CreateProjectForm {
  name: string;
  description?: string;
  deadline?: string;
  technologies?: string[];
  collaboratorIds: string[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter types
export interface UserFilters {
  name?: string;
  email?: string;
  role?: UserRole;
  areaId?: string;
}

export interface ProjectFilters {
  name?: string;
  status?: ProjectStatus;
  collaboratorId?: string;
}

// UI types
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}

// Component Props
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  options: { value: string; label: string }[];
}

// Layout types
export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  permissions?: UserRole[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Hook types
export interface UseApiOptions {
  revalidateOnFocus?: boolean;
  revalidateOnMount?: boolean;
  refreshInterval?: number;
}

export interface UseFormOptions<T> {
  defaultValues?: Partial<T>;
  validationSchema?: any;
  onSubmit: (data: T) => Promise<void> | void;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

// Status mapping
export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  [ContractType.CLT]: 'CLT',
  [ContractType.PJ]: 'PJ',
  [ContractType.FREELANCER]: 'Freelancer'
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNING]: 'Planejamento',
  [ProjectStatus.DEVELOPMENT]: 'Desenvolvimento',
  [ProjectStatus.COMPLETED]: 'Concluído',
  [ProjectStatus.CANCELLED]: 'Cancelado'
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.NORMAL]: 'Colaborador',
  [UserRole.MANAGER]: 'Gestor'
};