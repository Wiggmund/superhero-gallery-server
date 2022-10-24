import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Photo } from '../../photos/entity/photos.entity';

@Entity('superheroes')
export class Superhero {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	nickname: string;

	@Column({ unique: true })
	real_name: string;

	@Column()
	origin_description: string;

	@Column()
	superpowers: string;

	@Column()
	catch_phrase: string;

	@OneToMany(() => Photo, (photo) => photo.superhero)
	photos: Photo[];
}
