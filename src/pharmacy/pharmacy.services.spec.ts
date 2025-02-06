import { validate } from 'class-validator';
import { CreatePharmacyDto } from './dto/createPharmacy';

describe('CreatePharmacyDto', () => {
  let dto: CreatePharmacyDto;

  beforeEach(() => {
    dto = new CreatePharmacyDto();
    dto.name = 'Test Pharmacy';
    dto.phone = '123456789';
    dto.city = 'Test City';
    dto.latitude = 40.7128;
    dto.longitude = -74.006;
    dto.detailedAddress = '123 Test St.';
    dto.email = 'test@example.com';
    dto.isOnDuty = true;
    dto.isOnGard = true;
    dto.description = 'Test description';
    dto.image = 'https://example.com/image.jpg';
    dto.imageMobile = 'https://example.com/image-mobile.jpg';
  });

  it('should validate a correct DTO', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if name is empty', async () => {
    dto.name = '';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail if email is invalid', async () => {
    dto.email = 'invalid-email';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should fail if latitude is missing', async () => {
    dto.latitude = null as any;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should allow optional fields to be empty', async () => {
    dto.description = undefined;
    dto.image = undefined;
    dto.imageMobile = undefined;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
