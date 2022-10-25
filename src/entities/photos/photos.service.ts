import { EntityNotFoundException } from './../../common/exceptions/entity-not-found.exception';
import { Superhero } from './../superhero/entity/superhero.entity';
import { ParametersException } from './../../common/exceptions/parameters.exception';
import { IResizeOptions } from './types/resize-options.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entity/photos.entity';
import { Repository } from 'typeorm';
import { Express } from 'express';
import { CreatePhotoDto } from './dto/create-photo.dto';
import * as sharp from 'sharp';
import { FileSystemService } from '../../file-system/file-system.service';
import * as path from 'path';
import { PhotoResizeException } from '../../common/exceptions/photo-resize.exception';

@Injectable()
export class PhotosService {
	constructor(
		@InjectRepository(Photo) private photoRepository: Repository<Photo>,
		@InjectRepository(Superhero)
		private superheroRepository: Repository<Superhero>,
		private fileSystemService: FileSystemService
	) {}

	async getAllPhotos(): Promise<Photo[]> {
		return this.photoRepository.createQueryBuilder('photo').getMany();
	}

	async getPhotoByUrl(url: string): Promise<Photo> {
		return this.photoRepository
			.createQueryBuilder('photo')
			.where('photo.url_original = :url', { url })
			.orWhere('photo.url_min = :url', { url })
			.getOne();
	}

	async getPhotoById(photoId: number): Promise<Photo> {
		return this.photoRepository
			.createQueryBuilder('photo')
			.where('photo.id = :photoId', { photoId })
			.getOne();
	}

	async createPhotos(
		superheroId: number,
		files: Express.Multer.File[],
		height: string,
		width: string
	): Promise<number[]> {
		if (!height) {
			throw new ParametersException(
				`You have to provide height parameter for resizing (your value: "${height}")`
			);
		}
		const resizeOptions = this.generateResizeOptions(height, width);

		const candidates = this.getCandidatesAndResize(files, resizeOptions);

		const photosId = (
			(
				await this.photoRepository
					.createQueryBuilder()
					.insert()
					.into(Photo)
					.values(candidates)
					.execute()
			).identifiers as Pick<Photo, 'id'>[]
		).map((item) => item.id);

		await this.superheroRepository
			.createQueryBuilder()
			.relation(Superhero, 'photos')
			.of(superheroId) // you can use just post id as well
			.add(photosId);

		return photosId;
	}

	async removePhotoById(photoId: number): Promise<Photo> {
		const candidate = await this.getPhotoById(photoId);

		if (!candidate) {
			throw new EntityNotFoundException(
				`Photo with given id=${photoId} not found`
			);
		}

		await this.photoRepository
			.createQueryBuilder()
			.delete()
			.from(Photo)
			.where('id = :photoId', { photoId })
			.execute();

		this.fileSystemService.removePhotoFile(candidate);

		return candidate;
	}

	async removeManyPhotos(photos: Photo[]): Promise<Photo[]> {
		const ids = photos.map((photo) => photo.id);

		await this.photoRepository
			.createQueryBuilder()
			.delete()
			.from(Photo)
			.where('id IN (:...ids)', { ids })
			.execute();

		this.fileSystemService.removeManyPhotoFiles(photos);

		return photos;
	}

	private generateResizeOptions(
		height: string,
		width: string
	): IResizeOptions {
		const options: IResizeOptions = { height: Number(height) };

		if (width !== null) {
			options['width'] = Number(width);
		}

		return options;
	}

	private getCandidatesAndResize(
		files: Express.Multer.File[],
		resizeOptions: IResizeOptions
	): CreatePhotoDto[] {
		return files.map((file) => {
			const photo = new CreatePhotoDto(file);

			const bigImagesPath = path.resolve(
				process.env.BIG_IMAGES_PATH,
				photo.filename
			);
			const minImagesPath = path.resolve(
				process.env.MIN_IMAGES_PATH,
				photo.filename
			);

			sharp(bigImagesPath)
				.resize(resizeOptions)
				.toFile(minImagesPath, (err) => {
					if (err) {
						console.error(err);
						throw new PhotoResizeException('Error while resizing');
					}
				});

			return photo;
		});
	}
}
