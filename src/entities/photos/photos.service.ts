import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entity/photos.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PhotosService {
	constructor(
		@InjectRepository(Photo) private photoRepository: Repository<Photo>
	) {}

	getAllPhotos() {
		return this.photoRepository.createQueryBuilder('photo').getMany();
	}
}
