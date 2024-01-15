import { Injectable } from "@nestjs/common";

export class PetError extends Error {}
export class PetNotFoundError extends PetError {
  constructor(id: number) {
    super(`Pet '${id}' not found.`);
  }
}
export class PetAlreadyExistsError extends PetError {
  constructor(id: number) {
    super(`Pet '${id}' already exists.`);
  }
}

export enum PetStatus {
  AVAILABLE = "available",
  PENDING = "pending",
  SOLD = "sold",
}

export class Pet {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly category: string,
    public readonly photoUrls: ReadonlyArray<string>,
    public readonly tags: ReadonlyArray<string>,
  ) {}
}

@Injectable()
export class PetService {
  private db: Record<number, Pet> = {};
  byId(id: number): Pet | undefined {
    return this.db[id];
  }

  byTags(tags: string[]) {
    const pets: Pet[] = [];
    for (const pet of Object.values(this.db)) {
      if (tags.every(val => pet.tags.includes(val))) {
        pets.push(pet);
      }
    }
    return pets;
  }

  create(pet: Pet) {
    if (Object.hasOwn(this.db, pet.id)) {
      throw new PetAlreadyExistsError(pet.id);
    }
    this.db[pet.id] = pet;
  }

  update(pet: Pet) {
    if (!Object.hasOwn(this.db, pet.id)) {
      throw new PetNotFoundError(pet.id);
    }
    this.db[pet.id] = pet;
  }

  delete(id: number) {
    delete this.db[id];
  }
}
