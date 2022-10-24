import { Module } from '@nestjs/common';
import { FileSystemService } from './file-system.service';

@Module({
	providers: [FileSystemService]
})
export class FileSystemModule {}