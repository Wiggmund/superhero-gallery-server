import * as fs from 'fs';
import * as path from 'path';

import {
	Controller,
	Get,
	Param,
	Post,
	UseInterceptors,
	UploadedFiles
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { Express, Request } from 'express';
import { diskStorage } from 'multer';
import * as uuid from 'uuid';

import { SuperHeroPhotosService } from './services/superhero-photos.service';
import { PhotosService } from '../photos/photos.service';

const checkFoldersExistence = () => {
	const bigImagesPath = path.resolve(process.env.BIG_IMAGES_PATH);
	const minImagesPath = path.resolve(process.env.MIN_IMAGES_PATH);

	if (!fs.existsSync(bigImagesPath)) {
		fs.mkdirSync(bigImagesPath, { recursive: true });
	}

	if (!fs.existsSync(minImagesPath)) {
		fs.mkdirSync(minImagesPath, { recursive: true });
	}
};

const filesConfig = {
	storage: diskStorage({
		destination: (req, file, cb) => {
			checkFoldersExistence();
			cb(null, `./${process.env.BIG_IMAGES_PATH}`);
		},
		filename: (req: Request, file: Express.Multer.File, cb) => {
			const type = file.mimetype.split('/')[1];
			cb(null, `${uuid.v4()}.${type}`);
		}
	})
};

@Controller('superheroes')
export class SuperheroPhotosController {
	constructor(
		private superheroPhotosService: SuperHeroPhotosService,
		private photosService: PhotosService
	) {}

	@Get(':superheroId/photos')
	getSuperheroPhotos(@Param('superheroId') superheroId: number) {
		return this.superheroPhotosService.getSuperheroPhotos(superheroId);
	}

	@Get(':superheroId/avatar')
	getSuperheroAvatar(@Param('superheroId') superheroId: number) {
		return this.superheroPhotosService.getSuperheroAvatar(superheroId);
	}

	@Post(':superheroId/:height')
	@UseInterceptors(FilesInterceptor('files', 6, filesConfig))
	uploadFileResizeAuto(
		@UploadedFiles() files: Array<Express.Multer.File>,
		@Param('superheroId') id: number,
		@Param('height') height: string
	) {
		return this.photosService.createPhotos(id, files, height, null);
	}

	@Post(':superheroId/:height/:width')
	@UseInterceptors(FilesInterceptor('files', 6, filesConfig))
	uploadFileResizeManually(
		@UploadedFiles() files: Array<Express.Multer.File>,
		@Param('superheroId') id: number,
		@Param('height') height: string,
		@Param('width') width: string
	) {
		return this.photosService.createPhotos(id, files, height, width);
	}
}
