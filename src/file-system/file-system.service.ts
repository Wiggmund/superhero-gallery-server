import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileSystemService {
	deletePhotoFile(filename: string, type: string) {
		const { STATIC_FOLDER, ORIGINAL_PHOTO_SIZE, MINIMIZED_PHOTO_SIZE } =
			process.env;
		const fullName = `${filename}.${type}`;

		const originalPath = path.resolve(
			__dirname,
			'..',
			'..',
			STATIC_FOLDER,
			ORIGINAL_PHOTO_SIZE,
			fullName
		);

		const minPath = path.resolve(
			__dirname,
			'..',
			'..',
			STATIC_FOLDER,
			MINIMIZED_PHOTO_SIZE,
			fullName
		);

		try {
			fs.rmSync(originalPath);
			fs.rmSync(minPath);
		} catch (err) {
			console.error(err);
			throw new InternalServerErrorException(`Error while file removing`);
		}
	}
}
