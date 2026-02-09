export enum HttpCode {
  OK = 200,
  CREATED = 201,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum Message {
  SOMETHING_WENT_WRONG = "Something went wrong!",
  NO_DATA_FOUND = "No data is found!",
  NO_USER_FOUND = "No user is found!",
  TOKEN_NOT_FOUND = "Token is not found!",
  CREATE_FAILED = "Create is failed!",
  UPDATE_FAILED = "Update is failed!",

  USED_NICK_PHONE = "You are inserting already username or phone!",
  TOKEN_CREATION_FAILED = "Token creation error!",
  EXIST_USER = "User with that username is already exist!",
  NO_MEMBER_NICK = "No member with that username!",
  BLOCKED_USER = "You have been blocked, contact with admin!",
  WRONG_PASSWORD = "Wrong password intered, please try again!",
  NOT_AUTHENTICATED = "You are not authenticated, Please login first!",
}

class Errors extends Error {
    public code: HttpCode
    public override message: Message

    static readonly standard = {
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: Message.SOMETHING_WENT_WRONG
    } as const;

    constructor(statusCode: HttpCode, statusMessage: Message) {
        super(statusMessage);
        this.code = statusCode;
        this.message = statusMessage;

        Object.setPrototypeOf(this, Errors.prototype);
    }

    toJSON() {
        return {
            code: this.code,
            message: this.message,
        };
    }
}

export default Errors