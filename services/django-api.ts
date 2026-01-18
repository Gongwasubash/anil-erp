const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Authentication
  async login(username: string, password: string) {
    return this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout/', { method: 'POST' });
  }

  // Students
  async getStudents() {
    return this.request('/students/');
  }

  async createStudent(data: any) {
    return this.request('/students/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStudent(id: string, data: any) {
    return this.request(`/students/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStudent(id: string) {
    return this.request(`/students/${id}/`, { method: 'DELETE' });
  }

  // Financial Years
  async getFinancialYears() {
    return this.request('/fees/financial-years/');
  }

  async createFinancialYear(data: any) {
    return this.request('/fees/financial-years/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Fee Heads
  async getFeeHeads() {
    return this.request('/fees/fee-heads/');
  }

  async createFeeHead(data: any) {
    return this.request('/fees/fee-heads/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Fee Structure
  async getFeeStructure() {
    return this.request('/fees/fee-structure/');
  }

  async createFeeStructure(data: any) {
    return this.request('/fees/fee-structure/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Grades
  async getGrades() {
    return this.request('/exams/grades/');
  }

  async createGrade(data: any) {
    return this.request('/exams/grades/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Branches
  async getBranches() {
    return this.request('/masters/branches/');
  }

  async createBranch(data: any) {
    return this.request('/masters/branches/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
export default apiService;