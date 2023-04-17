import { ConsoleLogger } from '@nestjs/common';

export class Logger extends ConsoleLogger {
  error(message: any, ...optionalParams: any[]): any {
    super.error(message, optionalParams);
  }

  log(message: any, ...optionalParams: any[]): any {
    super.log(message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): any {
    super.log(message, optionalParams);
  }
}
