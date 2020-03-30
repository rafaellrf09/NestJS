import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { stat } from 'fs';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
    ){}



  getTasks(filterDto : GetTasksFilterDto, user: User) :Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });

    if(!found) {
      throw new NotFoundException(`Not found task with id: ${id}.`);
    }
    
    return found;
  }

  async cretaeTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.cretaeTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId: user.id });
    
    if (result.affected === 0){
      throw new NotFoundException(`Not found task with id: ${id}.`);
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task>{
      const task = await this.getTaskById(id, user);
      task.status = status;
      await task.save();
      return task;
  }
}
