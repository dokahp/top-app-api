import { PartialType } from '@nestjs/swagger';
import { CreateTopPageDto } from './create-top-page.dto';

export class UpdateTopPageDto extends PartialType(CreateTopPageDto) {}
