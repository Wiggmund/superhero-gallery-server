import { StringErrorMessages } from './../../../common/constants/class-validator-messages';
import { IsString, MinLength } from 'class-validator';

export class CreateSuperheroDto {
	@IsString({ message: StringErrorMessages.mustBeString })
	@MinLength(3, { message: StringErrorMessages.shortString })
	readonly nickname: string;

	@IsString({ message: StringErrorMessages.mustBeString })
	@MinLength(3, { message: StringErrorMessages.shortString })
	readonly real_name: string;

	@IsString({ message: StringErrorMessages.mustBeString })
	@MinLength(3, { message: StringErrorMessages.shortString })
	readonly origin_description: string;

	@IsString({ message: StringErrorMessages.mustBeString })
	@MinLength(3, { message: StringErrorMessages.shortString })
	readonly superpowers: string;

	@IsString({ message: StringErrorMessages.mustBeString })
	@MinLength(1, { message: StringErrorMessages.shortString })
	readonly catch_phrase: string;
}
