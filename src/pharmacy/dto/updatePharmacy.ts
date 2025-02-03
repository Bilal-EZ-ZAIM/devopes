import { PartialType } from '@nestjs/mapped-types';
import { CreatePharmacyDto } from './createPharmacy';

export class UpdatePharmacyDto extends PartialType(CreatePharmacyDto) {}
