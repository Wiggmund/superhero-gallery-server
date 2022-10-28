import { SuperHeroService } from './superhero.service';
import { Superhero } from '../entity/superhero.entity';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
import { Photo } from '../../photos/entity/photos.entity';

@Injectable()
export class SuperHeroPhotosService {
	constructor(
		@InjectRepository(Superhero)
		private superheroRepository: Repository<Superhero>,

		@Inject(forwardRef(() => SuperHeroService))
		private superheroService: SuperHeroService
	) {}

	async getSuperheroPhotos(superheroId: number): Promise<Photo[]> {
		const candidate = this.superheroService.getSuperheroById(superheroId);

		if (!candidate) {
			throw new EntityNotFoundException(
				`Superhero with given id=${superheroId} not found`
			);
		}

		return this.superheroRepository
			.createQueryBuilder()
			.relation(Superhero, 'photos')
			.of(superheroId) // you can use just post id as well
			.loadMany();
	}

	async getSuperheroAvatar(superheroId: number): Promise<Photo> {
		const candidate = this.superheroService.getSuperheroById(superheroId);

		if (!candidate) {
			throw new EntityNotFoundException(
				`Superhero with given id=${superheroId} not found`
			);
		}

		return this.superheroRepository
			.createQueryBuilder()
			.relation(Superhero, 'photos')
			.of(superheroId) // you can use just post id as well
			.loadOne();
	}
}
