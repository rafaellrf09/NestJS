import { Controller, Get, Post, Body, Param, Delete, Patch, Query, ValidationPipe, UsePipes, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
    this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`)
    return this.tasksService.getTasks(filterDto, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createtask(@Body() 
  createTaskDto: CreateTaskDto,
  @GetUser() user : User
  ): Promise<Task> {
    this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`)
    return this.tasksService.cretaeTask(createTaskDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Delete("/:id")
  deleteTask(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch("/:id/status")
  updateStatus(
      @Param("id", ParseIntPipe) id : number,
      @GetUser() user: User,
      @Body("status", TaskStatusValidationPipe) status : TaskStatus
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id,status, user);
  }

}
