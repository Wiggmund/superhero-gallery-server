import { Controller, Get } from '@nestjs/common';
import { PhotosService } from './photos.service';

@Controller('photos')
export class PhotosController {
	constructor(private photosService: PhotosService
	) {}

	@Get()
	getAllPhotos() {
		return this.photosService.getAllPhotos();
	}
}
