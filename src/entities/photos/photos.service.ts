import { EntityNotFoundException } from './../../common/exceptions/entity-not-found.exception';
import { Superhero } from './../superhero/entity/superhero.entity';
import { ParametersException } from './../../common/exceptions/parameters.exception';
import { IResizeOptions } from './types/resize-options.interface';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entity/photos.entity';
import { Repository } from 'typeorm';
import { Express } from 'express';
import { CreatePhotoDto } from './dto/create-photo.dto';
import * as sharp from 'sharp';
import { FileSystemService } from '../../file-system/file-system.service';

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
		console.log('resizeOptions', resizeOptions);
		const { STATIC_FOLDER, ORIGINAL_PHOTO_SIZE, MINIMIZED_PHOTO_SIZE } =
			process.env;

		const candidates = files.map((file) => {
			const photo = new CreatePhotoDto(file);

			const photoOriginalPath = `${STATIC_FOLDER}/${ORIGINAL_PHOTO_SIZE}/${photo.filename}.${photo.type}`;
			const photoMinPath = `${STATIC_FOLDER}/${MINIMIZED_PHOTO_SIZE}/${photo.filename}.${photo.type}`;

			sharp(photoOriginalPath)
				.resize(resizeOptions)
				.toFile(photoMinPath, (err) => {
					if (err) {
						throw new InternalServerErrorException(
							'Error while resizing'
						);
					}
				});

			return photo;
		});
		console.log('candidates', candidates);

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

		console.log('photosId', photosId);

		await this.superheroRepository
			.createQueryBuilder()
			.relation(Superhero, 'photos')
			.of(superheroId) // you can use just post id as well
			.add(photosId);

		return photosId;
	}

	async removePhoto(photoId: number): Promise<Photo> {
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

		this.fileSystemService.deletePhotoFile(
			candidate.filename,
			candidate.type
		);

		return candidate;
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
}
