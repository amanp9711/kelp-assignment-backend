import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAgeDistribution(): Promise<any> {
    const ageDistributionQuery: string = `
  SELECT
  CASE
    WHEN bucket = 1 THEN '< 20'
    WHEN bucket = 2 THEN '20 to 40'
    WHEN bucket = 3 THEN '40 to 60'
    WHEN bucket = 4 THEN '> 60'
  END AS "Age-Group",
  COALESCE(
    ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM public.users), 1), 2),
    0
  ) AS "% Distribution"
	FROM (
		  SELECT
		    width_bucket(age, ARRAY[0, 20, 40, 60, 200]) AS bucket
		  FROM
		    public.users
		) AS bucketed_users
		GROUP BY
		  bucket
		ORDER BY
		  bucket;

  `;
    const result: any = await this.userRepository.query(ageDistributionQuery);
    return result;
  }

  async insertUsersFromJsonArray(usersJson: any[]): Promise<void> {
    try {
      // Convert JSON array to an array of User entities
      const users: any[] = usersJson.map((user) => {
        const { name, age, address, ...additional_info } = user;
        const updatedUser: User = {
          name: name['firstName'] + ' ' + name['lastName'],
          age: age,
          address: address,
          additional_info: additional_info,
        };
        return this.userRepository.create(updatedUser);
      });

      // Insert all users in one go
      await this.userRepository.insert(users);
    } catch (err) {
      throw err;
    }
  }
}
