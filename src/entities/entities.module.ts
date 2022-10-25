import { SuperheroPhotosController } from './superhero/superhero-photos.controller';
import { SuperHeroPhotosService } from './superhero/services/superhero-photos.service';
import { Module } from '@nestjs/common';
import { EntitiesService } from './entities.service';

import { PhotosController } from './photos/photos.controller';
import { PhotosService } from './photos/photos.service';

import { SuperHeroController } from './superhero/superhero.controller';
import { SuperHeroService } from './superhero/services/superhero.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Superhero } from './superhero/entity/superhero.entity';
import { Photo } from './photos/entity/photos.entity';
import { FileSystemModule } from '../file-system/file-system.module';

@Module({
	imports: [TypeOrmModule.forFeature([Superhero, Photo]), FileSystemModule],
	controllers: [
		SuperHeroController,
		SuperheroPhotosController,
		PhotosController
	],
	providers: [
		EntitiesService,
		SuperHeroService,
		SuperHeroPhotosService,
		PhotosService
	]
})
export class EntitiesModule {}
