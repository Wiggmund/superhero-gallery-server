import { DtoValidationPipe } from './../../common/pipes/dto-validation.pipe';
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query
} from '@nestjs/common';
import { SuperHeroService } from './services/superhero.service';
import { CreateSuperheroDto } from './dto/create-superhero.dto';

@Controller('superheroes')
export class SuperHeroController {
	constructor(private superHeroService: SuperHeroService) {}

	@Get()
	getAllHeroes(@Query('take') take: number, @Query('skip') skip: number) {
		return this.superHeroService.getAllHeroesScroll(take, skip);
	}

	@Get(':superheroId')
	getSuperHeroById(@Param('superheroId') superheroId: number) {
		return this.superHeroService.getSuperheroById(superheroId);
	}

	@Post()
	createSuperhero(@Body(DtoValidationPipe) dto: CreateSuperheroDto) {
		return this.superHeroService.createSuperhero(dto);
	}

	@Put(':id')
	updateSuperhero(
		@Param('id') id: number,
		@Body(DtoValidationPipe) dto: CreateSuperheroDto
	) {
		return this.superHeroService.updateSuperhero(id, dto);
	}

	@Delete(':id')
	removeSuperhero(@Param('id') id: number) {
		return this.superHeroService.removeSuperhero(id);
	}
}
