import { HttpException, HttpStatus } from '@nestjs/common';

export class InsertionException extends HttpException {
	constructor(msg: string) {
		super(msg, HttpStatus.BAD_REQUEST);
	}
}
