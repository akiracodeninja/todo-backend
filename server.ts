import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createResponse } from './messageHandler';
import { CreateTaskRequest, UpdateTaskRequest, Task } from './interfaces';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Get all tasks
app.get('/tasks', async (req: Request, res: Response) => {
  try {
    const tasks: Task[] = await prisma.task.findMany();
    const response = createResponse<Task[]>('success', 'Tasks retrieved successfully', tasks);
    res.json(response);
  } 
  catch (error: any) {
    console.error('Error fetching tasks:', error);
    const errorResponse = createResponse<null>('error', 'Failed to fetch tasks', null);
    res.status(500).json(errorResponse);
  }
});

// Create a task
app.post('/tasks', async (req: Request<{}, {}, CreateTaskRequest>, res: Response) => {
  const { title, color } = req.body;

  try {
    const task: Task = await prisma.task.create({
      data: {
        title,
        color,
        completed: false
      },
    });

    const response = createResponse<Task>('success', 'Task created successfully', task);
    res.status(201).json(response);
  } 
  catch (error: any) {
    console.error('Error creating task:', error);
    const errorResponse = createResponse<null>('error', 'Task creation failed', null);
    res.status(500).json(errorResponse);
  }
});

app.get('/tasks/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const task: Task | null = await prisma.task.findUnique({
      where: { id: parseInt(id) }
    });

    if (task) {
      const response = createResponse<Task>('success', 'Task fetched successfully', task);
      res.status(200).json(response);
    }
    else {
      const errorResponse = createResponse<null>('error', 'Task not found', null);
      res.status(404).json(errorResponse);
    }
  } catch (error: any) {
    console.error('Error fetching task:', error);
    const errorResponse = createResponse<null>('error', 'Failed to fetch task', null);
    res.status(500).json(errorResponse);
  }
});

// Update a task
app.post('/tasks/:id', async (req: Request<{ id: string }, {}, UpdateTaskRequest>, res: Response) => {
  const { id } = req.params;
  const { color, title, completed } = req.body;

  try {
    const task: Task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        title,
        color,
        completed,
      },
    });

    const response = createResponse<Task>('success', 'Task updated successfully', task);
    res.status(200).json(response);
  } catch (error:any) {
    console.error('Error updating task:', error);
    const errorResponse = createResponse<null>('error', 'Task update failed', null);
    res.status(500).json(errorResponse);
  }
});

// Delete a task
app.delete('/tasks/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({
      where: { id: parseInt(id) },
    });

    const response = createResponse<null>('success', 'Task deleted successfully', null);
    res.status(200).json(response); // Status 200 for successful deletion
  } catch (error) {
    console.error('Error deleting task:', error);
    const errorResponse = createResponse<null>('error', 'Task deletion failed', null);
    res.status(500).json(errorResponse);
  }
});

// Start server
app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});