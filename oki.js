import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PharmacyServices } from './pharmacy.service';
import { Pharmacy } from '../schemas/pharmacy.schema';
import { CreatePharmacyDto } from './dto/createPharmacy';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('PharmacyServices', () => {
  let service: PharmacyServices;
  let model: Model<Pharmacy>;

  const mockPharmacy = {
    _id: '1',
    name: 'Test Pharmacy',
    phone: '1234567890',
    city: 'Test City',
    latitude: 0,
    longitude: 0,
    detailedAddress: 'Test Address',
    email: 'test@example.com',
    isOnDuty: false,
    isOnGard: false,
    save: jest.fn().mockResolvedValue(this),
  };

  const mockPharmacyModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockPharmacy]),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockPharmacy),
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockPharmacy),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockPharmacy),
    }),
    aggregate: jest.fn(),
  };
  
  if (model) {
    jest.spyOn(model, 'find').mockResolvedValue([mockPharmacy]);
  } else {
  }
  
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PharmacyServices,
        {
          provide: getModelToken(Pharmacy.name),
          useValue: mockPharmacyModel,
        },
      ],
    }).compile();

    service = module.get<PharmacyServices>(PharmacyServices);
    model = module.get<Model<Pharmacy>>(getModelToken(Pharmacy.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPharmacy', () => {
    it('should create a pharmacy', async () => {
      const createPharmacyDto: CreatePharmacyDto = {
        name: 'Test Pharmacy',
        phone: '1234567890',
        city: 'Test City',
        latitude: 0,
        longitude: 0,
        detailedAddress: 'Test Address',
        email: 'test@example.com',
        isOnDuty: false,
        isOnGard: false,
      };

      jest.spyOn(model, 'findOne').mockResolvedValue(null);
      jest.spyOn(model, 'create').mockResolvedValue(mockPharmacy as any);

      const result = await service.createPharmacy(createPharmacyDto);
      expect(result).toEqual(mockPharmacy);
    });

    it('should throw an error if pharmacy with email already exists', async () => {
      const createPharmacyDto: CreatePharmacyDto = {
        name: 'Test Pharmacy',
        phone: '1234567890',
        city: 'Test City',
        latitude: 0,
        longitude: 0,
        detailedAddress: 'Test Address',
        email: 'test@example.com',
        isOnDuty: false,
        isOnGard: false,
      };

      jest.spyOn(model, 'findOne').mockResolvedValue(mockPharmacy);

      await expect(service.createPharmacy(createPharmacyDto)).rejects.toThrow(
        new HttpException(
          'Pharmacy with this email already exists.',
          HttpStatus.CONFLICT,
        ),
      );
    });
  });

  describe('getAllPharmacies', () => {
    it('should return an array of pharmacies', async () => {
      jest.spyOn(model, 'find').mockResolvedValue([mockPharmacy]);

      const result = await service.getAllPharmacies();
      expect(result).toEqual([mockPharmacy]);
    });
  });

  describe('getPharmacyById', () => {
    it('should return a pharmacy by ID', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockPharmacy);

      const result = await service.getPharmacyById('1');
      expect(result).toEqual(mockPharmacy);
    });
  });

  describe('updatePharmacy', () => {
    it('should update a pharmacy by ID', async () => {
      const updateData = { name: 'Updated Pharmacy' };

      jest.spyOn(model, 'findOne').mockResolvedValue(null);
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(mockPharmacy);

      const result = await service.updatePharmacy('1', updateData);
      expect(result).toEqual(mockPharmacy);
    });

    it('should throw an error if pharmacy with email already exists', async () => {
      const updateData = { email: 'test@example.com' };

      jest.spyOn(model, 'findOne').mockResolvedValue(mockPharmacy);

      await expect(service.updatePharmacy('1', updateData)).rejects.toThrow(
        new HttpException(
          'Pharmacy with this email already exists.',
          HttpStatus.CONFLICT,
        ),
      );
    });
  });

  describe('deletePharmacy', () => {
    it('should delete a pharmacy by ID', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockPharmacy);

      const result = await service.deletePharmacy('1');
      expect(result).toBe(true);
    });

    it('should return false if pharmacy does not exist', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(null);

      const result = await service.deletePharmacy('1');
      expect(result).toBe(false);
    });
  });

  describe('setPharmacyOnDuty', () => {
    it('should set pharmacy as on duty', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockPharmacy);
      jest.spyOn(mockPharmacy, 'save').mockResolvedValue(mockPharmacy);

      const result = await service.setPharmacyOnDuty('1');
      expect(result).toEqual(mockPharmacy);
    });

    it('should return null if pharmacy does not exist', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      const result = await service.setPharmacyOnDuty('1');
      expect(result).toBeNull();
    });
  });

  describe('findGuardPharmacies', () => {
    it('should return guard pharmacies', async () => {
      jest.spyOn(model, 'aggregate').mockResolvedValue([mockPharmacy]);

      const result = await service.findGuardPharmacies({
        latitude: 0,
        longitude: 0,
      });
      expect(result).toEqual([mockPharmacy]);
    });
  });

  describe('getPharmacyDetails', () => {
    it('should return pharmacy details', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockPharmacy);

      const result = await service.getPharmacyDetails('1');
      expect(result).toEqual(mockPharmacy);
    });
  });

  describe('searchPharmacies', () => {
    it('should return pharmacies based on search criteria', async () => {
      jest.spyOn(model, 'aggregate').mockResolvedValue([mockPharmacy]);

      const result = await service.searchPharmacies({
        query: 'Test',
        latitude: 0,
        longitude: 0,
      });
      expect(result).toEqual([mockPharmacy]);
    });

    it('should return all pharmacies if no criteria provided', async () => {
      jest.spyOn(model, 'find').mockResolvedValue([mockPharmacy]);

      const result = await service.searchPharmacies({});
      expect(result).toEqual([mockPharmacy]);
    });
  });
});