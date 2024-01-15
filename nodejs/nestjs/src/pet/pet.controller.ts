import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  ValidationPipe,
} from "@nestjs/common";
import {
  PetService,
  PetStatus,
  PetAlreadyExistsError,
  PetNotFoundError,
} from "./pet.service";
import { PetDto } from "./pet.dto";

const TransformingValidator = new ValidationPipe({
  transform: true,
  skipMissingProperties: false,
});

@Controller("pet")
export class PetController {
  constructor(private service: PetService) {}

  @Get("findByStatus")
  // TODO(Jared): Add validator for PetStatus
  byStatus(@Query("status") status: PetStatus) {
    // TODO(Jared): Implement
  }

  /** Finds all of the pets that have all of the given tags. */
  @Get("findByTags")
  byTags(@Query("tags", ParseArrayPipe) tags: string[]) {
    return this.service.byTags(tags).map(PetDto.fromPet);
  }

  /** Adds the given pet to the store if it does not already exist. */
  @Post()
  add(@Body(TransformingValidator) pet: PetDto) {
    try {
      this.service.create(pet.toPet());
    } catch (e) {
      if (e instanceof PetAlreadyExistsError) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }

  /** Updates a pet's info that is already in the store. */
  @Put()
  update(@Body(TransformingValidator) pet: PetDto) {
    try {
      this.service.update(pet.toPet());
    } catch (e) {
      if (e instanceof PetNotFoundError) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }

  /** Removes a pet from the store. */
  @Delete(":petId")
  delete(@Param("petId", ParseIntPipe) petId: number) {
    this.service.delete(petId);
  }

  /** Gets a pet's info from its ID. */
  @Get(":petId")
  get(@Param("petId", ParseIntPipe) petId: number) {
    const pet = this.service.byId(petId);
    if (pet === undefined) {
      throw new NotFoundException();
    }
    return PetDto.fromPet(pet);
  }
}
