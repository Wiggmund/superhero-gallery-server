import {
	Controller,
	Get,
	Post,
	UseInterceptors,
	UploadedFiles,
	Param,
	Delete
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PhotosService } from './photos.service';
import { Express, Request } from 'express';
import { diskStorage } from 'multer';
import * as uuid from 'uuid';

const superheroPhotos = {
	storage: diskStorage({
		destination: (req, file, cb) => {
			cb(null, `./${process.env.STATIC_FOLDER}/max`);
		},
		filename: (req: Request, file: Express.Multer.File, cb) => {
			const type = file.mimetype.split('/')[1];
			cb(null, `${uuid.v4()}.${type}`);
		}
	})
};

@Controller('photos')
export class PhotosController {
	constructor(private photosService: PhotosService) {}

	@Get()
	getAllPhotos() {
		return this.photosService.getAllPhotos();
	}

	@Post(':superheroId/:height')
	@UseInterceptors(FilesInterceptor('files', 6, superheroPhotos))
	uploadFileResizeAuto(
		@UploadedFiles() files: Array<Express.Multer.File>,
		@Param('superheroId') id: number,
		@Param('height') height: string
	) {
		return this.photosService.createPhotos(id, files, height, null);
	}

	@Post(':superheroId/:height/:width')
	@UseInterceptors(FilesInterceptor('files', 6, superheroPhotos))
	uploadFileResizeManually(
		@UploadedFiles() files: Array<Express.Multer.File>,
		@Param('superheroId') id: number,
		@Param('height') height: string,
		@Param('width') width: string
	) {
		return this.photosService.createPhotos(id, files, height, width);
	}

	@Delete(':photoId')
	removePhoto(@Param('photoId') photoId: number) {
		return this.photosService.removePhoto(photoId);
	}
}
