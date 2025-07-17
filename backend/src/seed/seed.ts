import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { UserRole } from '../users/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

export async function seedDatabase(ds: DataSource) {
  const userCount = await ds.getRepository(User).count();
  if (userCount > 0) return;

  const password = await bcrypt.hash('123123', 10);
  const user = ds.getRepository(User).create({
    email: 'user@test.com',
    password,
    name: 'some user',
    role: UserRole.USER,
  });
  await ds.getRepository(User).save(user);

  // Seed categories
  const categories = ['Work', 'Home', 'Todo', 'Misc'].map((name) =>
    ds.getRepository(Category).create({ name }),
  );
  await ds.getRepository(Category).save(categories);

  console.log('DB seeded!');
}
