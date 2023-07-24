import { Body, Controller, Post, Get } from '@nestjs/common';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  all() {
    return this.assetsService.all();
  }
  @Post()
  async create(@Body() body: { id: string; symbol: string; price: number }) {
    return this.assetsService.create(body);
  }
}
