import { Module } from '@nestjs/common';
import { EntitiesService } from './entities.service';

import { PhotosController } from './photos/photos.controller';
import { PhotosService } from './photos/photos.service';

import { SuperHeroController } from './superhero/superhero.controller';
import { SuperHeroService } from './superhero/superhero.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Superhero } from './superhero/entity/superhero.entity';
import { Photo } from './photos/entity/photos.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Superhero, Photo])],
	controllers: [SuperHeroController, PhotosController],
	providers: [EntitiesService, SuperHeroService, PhotosService]
})
export class EntitiesModule {}
