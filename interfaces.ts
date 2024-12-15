export interface CreateTaskRequest {
  title: string,
  color: string
}

export interface UpdateTaskRequest {
  title: string,
  color: string,
  completed: boolean
}

export interface Task {
  id: number,
  title: string,
  color: string,
  completed: boolean,
}