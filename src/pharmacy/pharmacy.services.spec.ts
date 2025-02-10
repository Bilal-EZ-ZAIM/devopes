import { Test, TestingModule } from '@nestjs/testing';
import { PharmacyServices } from './pharmacy.service';
import { getModelToken } from '@nestjs/mongoose';
import { Pharmacy } from '../schemas/pharmacy.schema';
import { Model } from 'mongoose';
import { CreatePharmacyDto } from './dto/createPharmacy';
import { HttpException, HttpStatus } from '@nestjs/common';

interface MockPharmacy extends Partial<Pharmacy> {
  _id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  latitude: number;
  longitude: number;
  detailedAddress: string;
  isOnDuty: boolean;
  isOnGard: boolean;
  save: jest.Mock;
}

describe('PharmacyServices', () => {
  let service: PharmacyServices;
  let model: Model<Pharmacy>;

  const mockPharmacy: MockPharmacy = {
    _id: 'mockId',
    name: 'Test Pharmacy',
    email: 'test@example.com',
    phone: '123456789',
    city: 'Test City',
    latitude: 40.7128,
    longitude: -74.006,
    detailedAddress: '123 Test St.',
    isOnDuty: false,
    isOnGard: false,
    save: jest.fn().mockResolvedValue(this)
  };

  // Create a proper mock class for the Mongoose Model
  class MockPharmacyModel {
    constructor(private data: any) {
      Object.assign(this, data);
    }

    save = jest.fn().mockResolvedValue(this.data);

    static find = jest.fn();
    static findOne = jest.fn();
    static findById = jest.fn();
    static findByIdAndUpdate = jest.fn();
    static findByIdAndDelete = jest.fn();
    static aggregate = jest.fn();
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PharmacyServices,
        {
          provide: getModelToken(Pharmacy.name),
          useValue: MockPharmacyModel
        },
      ],
    }).compile();

    service = module.get<PharmacyServices>(PharmacyServices);
    model = module.get<Model<Pharmacy>>(getModelToken(Pharmacy.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPharmacy', () => {
    it('should create a pharmacy successfully', async () => {
      const dto: CreatePharmacyDto = {
        name: 'Test Pharmacy',
        email: 'new@example.com',
        phone: '123456789',
        city: 'Test City',
        latitude: 40.7128,
        longitude: -74.006,
        detailedAddress: '123 Test St.',
        isOnDuty: false,
        isOnGard: false,
        description: '',
        image: '',
        imageMobile: ''
      };
      
      jest.spyOn(model, 'findOne').mockResolvedValue(null);
      
      const result = await service.createPharmacy(dto);
      expect(result).toBeDefined();
      expect(result.email).toBe(dto.email);
    });

    it('should throw conflict exception if email exists', async () => {
      const dto = new CreatePharmacyDto();
      dto.email = 'existing@example.com';
      
      jest.spyOn(model, 'findOne').mockResolvedValue(mockPharmacy);
      
      await expect(service.createPharmacy(dto)).rejects.toThrow(HttpException);
    });
  });

  describe('getAllPharmacies', () => {
    it('should return array of pharmacies', async () => {
      const pharmacies = [mockPharmacy];
      jest.spyOn(model, 'find').mockResolvedValue(pharmacies);
      
      const result = await service.getAllPharmacies();
      expect(result).toEqual(pharmacies);
    });
  });

  describe('getPharmacyById', () => {
    it('should return a pharmacy by id', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockPharmacy);
      
      const result = await service.getPharmacyById('mockId');
      expect(result).toEqual(mockPharmacy);
    });

    it('should return null if pharmacy not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);
      
      const result = await service.getPharmacyById('nonexistentId');
      expect(result).toBeNull();
    });
  });

  describe('updatePharmacy', () => {
    it('should update pharmacy successfully', async () => {
      const updateData = { name: 'Updated Pharmacy' };
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue({
        ...mockPharmacy,
        ...updateData,
      });
      
      const result = await service.updatePharmacy('mockId', updateData);
      expect(result.name).toBe(updateData.name);
    });

    it('should throw conflict exception if updating to existing email', async () => {
      const updateData = { email: 'existing@example.com' };
      jest.spyOn(model, 'findOne').mockResolvedValue(mockPharmacy);
      
      await expect(service.updatePharmacy('mockId', updateData)).rejects.toThrow(HttpException);
    });
  });

  describe('deletePharmacy', () => {
    it('should return true when pharmacy is deleted', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockPharmacy);
      
      const result = await service.deletePharmacy('mockId');
      expect(result).toBe(true);
    });

    it('should return false when pharmacy is not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(null);
      
      const result = await service.deletePharmacy('nonexistentId');
      expect(result).toBe(false);
    });
  });

  describe('setPharmacyOnDuty', () => {
   

    it('should return null if pharmacy not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);
      
      const result = await service.setPharmacyOnDuty('nonexistentId');
      expect(result).toBeNull();
    });
  });

  describe('findGuardPharmacies', () => {
    it('should find guard pharmacies within distance', async () => {
      const mockGuardPharmacies = [{
        ...mockPharmacy,
        distance: 1000,
        isOnGard: true,
      }];
      
      jest.spyOn(model, 'aggregate').mockResolvedValue(mockGuardPharmacies);
      
      const result = await service.findGuardPharmacies({
        latitude: 40.7128,
        longitude: -74.006,
      });
      
      expect(result).toEqual(mockGuardPharmacies);
      expect(model.aggregate).toHaveBeenCalled();
    });
  });

  describe('searchPharmacies', () => {
    it('should search pharmacies with query and location', async () => {
      const mockSearchResults = [{
        ...mockPharmacy,
        distance: 1000,
      }];
      
      jest.spyOn(model, 'aggregate').mockResolvedValue(mockSearchResults);
      
      const result = await service.searchPharmacies({
        query: 'test',
        latitude: 40.7128,
        longitude: -74.006,
      });
      
      expect(result).toEqual(mockSearchResults);
      expect(model.aggregate).toHaveBeenCalled();
    });

    it('should return all pharmacies when no criteria provided', async () => {
      const pharmacies = [mockPharmacy];
      jest.spyOn(model, 'find').mockResolvedValue(pharmacies);
      
      const result = await service.searchPharmacies({});
      expect(result).toEqual(pharmacies);
    });
  });
});