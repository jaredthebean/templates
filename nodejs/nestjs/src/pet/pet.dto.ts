import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, ValidateNested } from "class-validator";
import { Pet } from "src/pet/pet.service";

/** The category of pet. */
export class PetCategoryDto {
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  /**
   * The ID of the category.
   * @example 0
   */
  @IsInt()
  public readonly id: number;

  /**
   * The human readable name of the category
   * @example "dog"
   */
  @IsString()
  public readonly name: string;
}

/** A tag that can be used to search for a pet. */
export class PetTagDto {
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  /**
   * The ID of the tag.
   * @example 0
   */
  @IsInt()
  public readonly id: number;

  /**
   * The human readable name of the tag
   * @example "cute"
   */
  @IsString()
  public readonly name: string;
}

/** A pet that can be placed in the store. */
@ApiExtraModels(PetTagDto)
export class PetDto {
  constructor(
    id: number,
    name: string,
    category: PetCategoryDto,
    photoUrls: ReadonlyArray<string>,
    tags: ReadonlyArray<PetTagDto>,
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.photoUrls = photoUrls;
    this.tags = tags;
  }

  /**
   * The ID of the pet in the store.
   *
   * @example 1
   */
  @IsInt()
  public readonly id: number;

  /**
   * The name of the pet.
   *
   * @example "Fido"
   */
  @IsString()
  public readonly name: string;

  /** The category the pet belongs to. */
  @ValidateNested()
  public readonly category: PetCategoryDto;

  /**
   * Photos of the pet.
   *
   * @example ["https://www.example.com/fido.jpg"]
   */
  @IsString({ each: true })
  public readonly photoUrls: ReadonlyArray<string>;

  /** The tags applied to the pet. */
  @ValidateNested({ each: true })
  @ApiProperty({ type: PetTagDto, isArray: true })
  public readonly tags: ReadonlyArray<PetTagDto>;

  toPet(): Pet {
    return new Pet(
      this.id,
      this.name,
      this.category.name,
      this.photoUrls,
      this.tags.map(tag => tag.name),
    );
  }

  static fromPet(pet: Pet): PetDto {
    return new PetDto(
      pet.id,
      pet.name,
      new PetCategoryDto(0, pet.category),
      pet.photoUrls,
      pet.tags.map((tag, idx) => new PetTagDto(idx, tag)),
    );
  }
}
