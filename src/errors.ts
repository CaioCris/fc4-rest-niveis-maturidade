import { ValidationError as ClassValidatorError} from "class-validator";

export class ValidationError extends Error {
  constructor(readonly error: ClassValidatorError[]){
    super();
    this.name = "ValidationError";
  }
}

export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
    this.name = "UserAlreadyExistsError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}