import { Module } from '@nestjs/common';
import { EntitiesModule } from './entities/entities.module';
import { FileSystemModule } from './file-system/file-system.module';

@Module({
	imports: [EntitiesModule, FileSystemModule]
})
export class AppModule {}
