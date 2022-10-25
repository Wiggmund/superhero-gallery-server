import { PhotoFileException } from './../common/exceptions/photo-file.exception';
import { Photo } from './../entities/photos/entity/photos.entity';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileSystemService {
	removePhotoFile(photo: Photo) {
		const originalPath = path.resolve(
			process.env.BIG_IMAGES_PATH,
			photo.filename
		);
		const minPath = path.resolve(
			process.env.MIN_IMAGES_PATH,
			photo.filename
		);

		try {
			fs.rmSync(originalPath);
			fs.rmSync(minPath);
		} catch (err) {
			console.error(err);
			throw new PhotoFileException(`Error while file removing`);
		}
	}

	removeManyPhotoFiles(photos: Photo[]) {
		for (const photo of photos) {
			this.removePhotoFile(photo);
		}
	}
}
