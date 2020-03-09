import { Controller, Get, Post, Body, Param, Delete, Patch, Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {

    if(Object.keys(filterDto).length) return this.tasksService.getTasksWithFilters(filterDto);
    else return this.tasksService.getAllTasks();
  }

  @Post()
  @UsePipes(ValidationPipe)
  createtask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.cretaeTask(createTaskDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Delete("/:id")
  deleteTask(@Param('id') id: string): void {
    this.tasksService.deleteTask(id);
  }

  @Patch("/:id/status")
  updateStatus(
      @Param("id") id : string,
      @Body("status", TaskStatusValidationPipe) status : TaskStatus
  ): Task {
    return this.tasksService.updateTaskStatus(id,status);
  }

}
