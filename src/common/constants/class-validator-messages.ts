import { ValidationArguments } from 'class-validator';

const undefinedMessage = `You didn't provide value for $property`;

export const StringErrorMessages = {
	mustBeString: (data: ValidationArguments) => {
		return `Must be a string type, you provide [ ${checkForType(
			data.value
		)} ] type`;
	},
	shortString: (data: ValidationArguments) => {
		if (data.value === undefined) {
			return undefinedMessage;
		}
		return `Is too short, minimum length is ${
			data.constraints[0]
		} characters you provide ${data.value.length || 0}`;
	},
	longString: (data: ValidationArguments) => {
		if (data.value === undefined) {
			return undefinedMessage;
		}
		return `Is too long, maximum length is ${
			data.constraints[0]
		} characters you provide ${data.value.length || 0}`;
	}
};

function checkForType(data) {
	if (data === null) {
		return 'null';
	}

	return typeof data;
}
