import { Controller, Get, Param, Delete } from '@nestjs/common';
import { PhotosService } from './photos.service';

@Controller('photos')
export class PhotosController {
	constructor(private photosService: PhotosService) {}

	@Get()
	getAllPhotos() {
		return this.photosService.getAllPhotos();
	}

	@Delete(':photoId')
	removePhoto(@Param('photoId') photoId: number) {
		return this.photosService.removePhotoById(photoId);
	}
}
