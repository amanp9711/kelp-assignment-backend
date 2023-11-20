import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from './database/user.service';
import { readFileSync } from 'fs';
import * as csvtojson from 'csvtojson';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Get()
  serverCheck(): string {
    return 'Server is up';
  }

  @Get('/convert')
  async insertData(): Promise<string> {
    try {
      // Taking filepath from .env file using configService
      const filePath: string = this.configService.get<string>('CSV_FILE_URL');
      // Reading csv data
      const csvData: string = readFileSync(filePath, 'utf-8');
      // Convert csv data into json (It handles the nested properties scenario by itself)
      const jsonArray: any[] = await csvtojson().fromString(csvData);
      // Inserting users data into postgres in required data format
      await this.userService.insertUsersFromJsonArray(jsonArray);
      // Fetching ageDistribution based on age bucket query
      const ageDistribution: object =
        await this.userService.getAgeDistribution();
      console.table(ageDistribution);
      return this.appService.getSuccessMessage();
    } catch (error) {
      console.log(error);
      return this.appService.getErrorMessage();
    }
  }
}
