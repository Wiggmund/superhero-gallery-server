import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Superhero } from '../../superhero/entity/superhero.entity';

@Entity('photos')
export class Photo {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	url_original: string;

	@Column({ unique: true })
	url_min: string;

	@Column()
	type: string;

	@Column()
	filename: string;

	@Column()
	destination: string;

	@Column()
	size: number;

	@ManyToOne(() => Superhero, (superhero) => superhero.photos)
	superhero: Superhero;
}
