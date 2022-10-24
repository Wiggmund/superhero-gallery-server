import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put
} from '@nestjs/common';
import { SuperHeroService } from './superhero.service';
import { CreateSuperheroDto } from './dto/create-superhero.dto';

@Controller('superheroes')
export class SuperHeroController {
	constructor(private superHeroService: SuperHeroService) {}

	@Get()
	getAllHeroes() {
		return this.superHeroService.getAllHeroes();
	}

	@Post()
	createSuperhero(@Body() dto: CreateSuperheroDto) {
		return this.superHeroService.createSuperhero(dto);
	}

	@Put(':id')
	updateSuperhero(@Param('id') id: number, @Body() dto: CreateSuperheroDto) {
		return this.superHeroService.updateSuperhero(id, dto);
	}

	@Delete(':id')
	removeSuperhero(@Param('id') id: number) {
		return this.superHeroService.removeSuperhero(id);
	}
}
