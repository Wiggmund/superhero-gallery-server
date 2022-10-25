import { PhotosService } from './../../photos/photos.service';
import { SuperHeroPhotosService } from './superhero-photos.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Superhero } from '../entity/superhero.entity';
import { Repository } from 'typeorm';
import { CreateSuperheroDto } from '../dto/create-superhero.dto';
import { InsertionException } from '../../../common/exceptions/insertion.exception';

@Injectable()
export class SuperHeroService {
	constructor(
		@InjectRepository(Superhero)
		private superheroRepository: Repository<Superhero>,

		@Inject(forwardRef(() => SuperHeroPhotosService))
		private superHeroPhotosService: SuperHeroPhotosService,

		private photosService: PhotosService
	) {}

	getAllHeroes() {
		return this.superheroRepository
			.createQueryBuilder('superhero')
			.getMany();
	}

	async getSuperheroById(id: number): Promise<Superhero> {
		return this.superheroRepository
			.createQueryBuilder('superhero')
			.where('superhero.id = :id', { id })
			.getOne();
	}

	async getSuperheroByNickname(nickname: string): Promise<Superhero> {
		return this.superheroRepository
			.createQueryBuilder('superhero')
			.where('superhero.nickname = :nickname', { nickname })
			.getOne();
	}

	async getSuperheroByRealName(real_name: string): Promise<Superhero> {
		return this.superheroRepository
			.createQueryBuilder('superhero')
			.where('superhero.real_name = :real_name', { real_name })
			.getOne();
	}

	async createSuperhero(dto: CreateSuperheroDto): Promise<Superhero> {
		const { nickname, real_name } = dto;

		let candidate = await this.getSuperheroByNickname(nickname);
		if (candidate) {
			throw new InsertionException(
				`Superhero with given nickname=${nickname} already exists`
			);
		}

		candidate = await this.getSuperheroByRealName(real_name);
		if (candidate) {
			throw new InsertionException(
				`Superhero with given real_name=${real_name} already exists`
			);
		}

		const superheroId = (
			(
				await this.superheroRepository
					.createQueryBuilder()
					.insert()
					.into(Superhero)
					.values({ ...dto })
					.execute()
			).identifiers as Pick<Superhero, 'id'>[]
		)[0].id;

		return this.superheroRepository
			.createQueryBuilder('superhero')
			.where('superhero.id = :superheroId', { superheroId })
			.getOne();
	}

	async updateSuperhero(
		id: number,
		dto: CreateSuperheroDto
	): Promise<Superhero> {
		const candidate = await this.getSuperheroById(id);

		if (!candidate) {
			throw new InsertionException(
				`Superhero with given id=${id} not found`
			);
		}

		const { nickname: oldNickname, real_name: oldRealName } = candidate;
		const { nickname: newNickname, real_name: newRealName } = dto;

		if (
			newNickname != oldNickname &&
			Boolean(await this.getSuperheroByNickname(newNickname))
		) {
			throw new InsertionException(
				`Superhero with given nickname=${newNickname} already exists`
			);
		}

		if (
			newRealName != oldRealName &&
			Boolean(await this.getSuperheroByRealName(newRealName))
		) {
			throw new InsertionException(
				`Superhero with given real_name=${newRealName} already exists`
			);
		}

		await this.superheroRepository
			.createQueryBuilder()
			.update(Superhero)
			.set(dto)
			.where('id = :id', { id })
			.execute();

		return this.getSuperheroById(id);
	}

	async removeSuperhero(id: number) {
		const candidate = await this.getSuperheroById(id);

		if (!candidate) {
			throw new InsertionException(
				`Superhero with given id=${id} not found`
			);
		}

		const superheroPhotos =
			await this.superHeroPhotosService.getSuperheroPhotos(id);
		if (superheroPhotos.length > 0) {
			this.photosService.removeManyPhotos(superheroPhotos);
		}

		await this.superheroRepository
			.createQueryBuilder()
			.delete()
			.from(Superhero)
			.where('id = :id', { id })
			.execute();

		return candidate;
	}
}
