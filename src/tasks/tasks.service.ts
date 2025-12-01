import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    this.logger.log('Creating new task...');

    const task = this.tasksRepository.create(createTaskDto);
    const savedTask = await this.tasksRepository.save(task);

    this.logger.log(`Task created with ID: ${savedTask.id}`);
    await this.cacheManager.del('tasks:all');
    this.logger.log('Cache invalidated for task list');

    return savedTask;
  }

  async getAllTasks(): Promise<Task[]> {
    const cacheKey = 'tasks:all:simple';
    const cached = await this.cacheManager.get<Task[]>(cacheKey);

    if (cached) {
      this.logger.log('✅ Cache HIT for all tasks!');
      return cached;
    }

    const tasks = await this.tasksRepository.find({
      order: { createdAt: 'DESC' },
    });

    await this.cacheManager.set(cacheKey, tasks, 180000);
    this.logger.log('✅ Cached all tasks');

    return tasks;
  }
}
