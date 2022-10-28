import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitiesModule } from './entities/entities.module';
import { FileSystemModule } from './file-system/file-system.module';
import * as path from 'path';

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
			synchronize: true,
			autoLoadEntities: true,
			logging: true,
			logger: 'advanced-console'
		}),
		ServeStaticModule.forRoot({
			rootPath: path.resolve(__dirname, '..', 'static')
		}),
		EntitiesModule,
		FileSystemModule
	]
})
export class AppModule {}
