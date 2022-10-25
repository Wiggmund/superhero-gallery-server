import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileSystemService {
	deletePhotoFile(filename: string, type: string) {
		const fullName = `${filename}.${type}`;

		const originalPath = path.resolve(process.env.BIG_IMAGES_PATH, fullName);
		const minPath = path.resolve(process.env.MIN_IMAGES_PATH, fullName);

		try {
			fs.rmSync(originalPath);
			fs.rmSync(minPath);
		} catch (err) {
			console.error(err);
			throw new InternalServerErrorException(`Error while file removing`);
		}
	}
}
