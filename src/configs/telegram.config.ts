import { ConfigService } from '@nestjs/config';
import { ITelegramOptions } from 'src/telegram/telegram.interface';

export const getTelegramConfig = (
  configService: ConfigService,
): ITelegramOptions => {
  const token = configService.get('TELEGRAM_TOKEN');
  if (!token) {
    throw new Error('NO TELEGRAM TOKEN');
  }
  return {
    chatId: configService.get('TELEGRAM_CHAT_ID'),
    token: token,
  };
};
