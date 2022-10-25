import { HttpException, HttpStatus } from '@nestjs/common';

export class PhotoFileException extends HttpException {
	constructor(msg: string) {
		super(msg, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
