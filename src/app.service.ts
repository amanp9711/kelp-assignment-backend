import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getSuccessMessage(): string {
    return 'Successfully inserted data!';
  }
  getErrorMessage(): string {
    return 'Something went wrong!';
  }
}
