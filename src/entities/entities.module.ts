import { Module } from '@nestjs/common';
import { EntitiesService } from './entities.service';

import { PhotosController } from './photos/photos.controller';
import { PhotosService } from './photos/photos.service';

import { SuperHeroController } from './superhero/superhero.controller';
import { SuperHeroSevice } from './superhero/superhero.service';

@Module({
	controllers: [SuperHeroController, PhotosController],
	providers: [EntitiesService, SuperHeroSevice, PhotosService]
})
export class EntitiesModule {}
