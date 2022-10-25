import { Express } from 'express';

export class CreatePhotoDto {
	readonly url_original: string;
	readonly url_min: string;
	readonly filename: string;
	readonly destination: string;
	readonly type: string;
	readonly size: number;

	constructor(file: Express.Multer.File) {
		const host = process.env.NGINX_STATIC_HOST;
		const port = process.env.NGINX_PORT;
		console.log('FILE', file);

		this.type = file.mimetype.split('/')[1];
		this.filename = file.filename.slice(0, file.filename.lastIndexOf('.'));
		this.destination = file.destination;
		this.size = file.size;
		this.url_original = `http://${host}:${port}/max/${this.filename}.${this.type}`;
		this.url_min = `http://${host}:${port}/min/${this.filename}.${this.type}`;
	}
}
