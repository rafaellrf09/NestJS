import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { stat } from 'fs';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
    ){}



  getTasks(filterDto : GetTasksFilterDto) :Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);

    if(!found) {
      throw new NotFoundException(`Not found task with id: ${id}.`);
    }
    
    return found;
  }

  async cretaeTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.cretaeTask(createTaskDto);
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id)
    if (result.affected === 0){
      throw new NotFoundException(`Not found task with id: ${id}.`);
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task>{
      const task = await this.getTaskById(id);
      task.status = status;
      await task.save();
      return task;
  }
}
