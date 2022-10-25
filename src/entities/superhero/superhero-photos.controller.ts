import { SuperHeroPhotosService } from './services/superhero-photos.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('superheroes')
export class SuperheroPhotosController {
	constructor(private superheroPhotosService: SuperHeroPhotosService) {}

	@Get(':superheroId/photos')
	getSuperheroPhotos(@Param('superheroId') superheroId: number) {
		return this.superheroPhotosService.getSuperheroPhotos(superheroId);
	}
}
