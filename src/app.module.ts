import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitiesModule } from './entities/entities.module';
import { FileSystemModule } from './file-system/file-system.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
			// entities: [],
			synchronize: true,
			autoLoadEntities: true,
			logging: true,
			logger: 'advanced-console'
		}),
		EntitiesModule,
		FileSystemModule
	]
})
export class AppModule {}
